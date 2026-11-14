/**
 * Maths in AI replies, typeset with KaTeX (its CSS is loaded in the root layout).
 *
 * Pass the text through normalizeMath() from chat-markdown.ts first: it turns
 * \( \), \[ \] and $ $ into the $$ form remark-math reads. Then:
 *
 *   remarkPlugins: [..., remarkMathPlugin]
 *   rehypePlugins: [..., rehypeMath]          (after rehype-raw)
 *   components:    {...mathComponents, ...}   (from components/math-markdown)
 */
import katex from 'katex';
import type {Options} from 'react-markdown';
import remarkMath from 'remark-math';

type Plugin = NonNullable<Options['remarkPlugins']>[number];

/** $$ … $$ only. Single-dollar maths is off so prices such as "$5 and $10" stay text. */
export const remarkMathPlugin: Plugin = [remarkMath, {singleDollarTextMath: false}];

// ── Typesetting ───────────────────────────────────────────────────────────────

/**
 * A formula KaTeX can't read shows its source in the normal text colour
 * (styled by .katex-error) instead of red. No console warnings about Unicode.
 * `trust` stays off, so the HTML can't carry links, classes or styles from the text.
 */
const KATEX_OPTIONS = {throwOnError: false, errorColor: 'inherit', strict: 'ignore'} as const;

/**
 * Typeset formulas, newest last. A streaming reply renders again on every
 * token, so without this each formula would be typeset over and over.
 */
const typeset = new Map<string, string>();
const TYPESET_CACHE_SIZE = 500;

/** KaTeX's HTML for a formula. */
export function typesetMath(tex: string, display: boolean): string {
  const key = (display ? 'D' : 'I') + tex;
  const cached = typeset.get(key);
  if (cached !== undefined) return cached;

  let html: string;
  try {
    html = katex.renderToString(tex, {...KATEX_OPTIONS, displayMode: display});
  } catch {
    // KaTeX handles bad LaTeX itself; this is for anything else it throws
    html = `<span class="katex-error">${escapeHtml(tex)}</span>`;
  }
  if (typeset.size >= TYPESET_CACHE_SIZE) typeset.delete(typeset.keys().next().value as string);
  typeset.set(key, html);
  return html;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── rehype plugin ─────────────────────────────────────────────────────────────

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** The element that carries a typeset formula; rendered by mathComponents. */
export const MATH_TAG = 'soham-math';

const hasClass = (node: HastNode, name: string): boolean => {
  const classes = node.properties?.className;
  return Array.isArray(classes) && classes.includes(name);
};

const textOf = (node: HastNode): string =>
  node.type === 'text' ? node.value ?? '' : (node.children ?? []).map(textOf).join('');

const mathElement = (tex: string, display: boolean): HastNode => ({
  type: 'element',
  tagName: MATH_TAG,
  properties: {display: display ? 'block' : 'inline', html: typesetMath(tex, display)},
  children: [],
});

/**
 * rehype plugin. remark-math turns formulas into <code class="language-math">
 * (inside a <pre> for display maths, as are ```math code blocks). Each one is
 * replaced by a single element holding KaTeX's HTML, rather than the thousands
 * of nodes KaTeX's markup would add to the tree on every render.
 */
export function rehypeMath() {
  return (tree: HastNode) => {
    const walk = (parent: HastNode) => {
      const children = parent.children;
      if (!children) return;
      for (let k = 0; k < children.length; k++) {
        const node = children[k];
        if (node.type !== 'element') continue;
        if (node.tagName === 'pre') {
          const inner = (node.children ?? []).filter((child) => child.type === 'element');
          if (inner.length === 1 && inner[0].tagName === 'code' && hasClass(inner[0], 'language-math')) {
            children[k] = mathElement(textOf(inner[0]).replace(/\n$/, ''), true);
            continue;
          }
        }
        if (node.tagName === 'code' && hasClass(node, 'math-inline')) {
          children[k] = mathElement(textOf(node), false);
          continue;
        }
        walk(node);
      }
    };
    walk(tree);
  };
}
