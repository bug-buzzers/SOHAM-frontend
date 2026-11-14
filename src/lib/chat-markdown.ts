/**
 * Markdown clean-up for AI replies.
 *
 * Maths: normalizeMath() at the bottom rewrites the ways models write LaTeX
 * into the one form the renderer reads (see markdown-math.ts).
 *
 * The backend asks models to use **bold** for key terms. Two things made those
 * asterisks show up as literal "**" in the chat:
 *
 * 1. cleanResponseHeaders() turned every line starting with "# " into bold,
 *    including comment lines inside fenced code. Python and shell answers ended
 *    up with "**Install dependencies**" in their code. The clean-ups here now
 *    leave fenced code alone.
 * 2. CommonMark only accepts a ** pair when it sits against the text in a
 *    strict way, so replies like "**Note:**text", "** spaced **",
 *    "**Done ✅**next" or bold around `inline code` kept their asterisks.
 *    remarkLooseBold() pairs up those leftover markers after parsing.
 */

// ── Fenced code ───────────────────────────────────────────────────────────────

const FENCE_OPEN = /^\s*(`{3,}|~{3,})(.*)$/;
const FENCE_CLOSE = /^\s*(`{3,}|~{3,})\s*$/;

/**
 * Applies `transform` only to the parts of `text` outside fenced code blocks
 * (``` or ~~~). Code passes through untouched. An unclosed fence runs to the
 * end, as it does when the Markdown is rendered. `atEnd` tells the transform
 * that its part is the end of the text.
 */
export function mapOutsideCodeFences(
  text: string,
  transform: (prose: string, atEnd: boolean) => string,
): string {
  const parts: string[] = [];
  let prose: string[] = [];
  let fence: string | null = null; // the opening fence, e.g. "```"

  const flushProse = (atEnd: boolean) => {
    if (prose.length > 0) {
      parts.push(transform(prose.join('\n'), atEnd));
      prose = [];
    }
  };

  for (const line of text.split('\n')) {
    if (fence) {
      parts.push(line);
      const close = FENCE_CLOSE.exec(line);
      if (close && close[1][0] === fence[0] && close[1].length >= fence.length) fence = null;
      continue;
    }
    const open = FENCE_OPEN.exec(line);
    // A backtick fence can't have backticks after it: "```x```" is inline code.
    if (open && !(open[1][0] === '`' && open[2].includes('`'))) {
      flushProse(false);
      parts.push(line);
      fence = open[1];
      continue;
    }
    prose.push(line);
  }
  flushProse(true);
  return parts.join('\n');
}

/** Runs `transform` on the text outside `inline code` spans. */
function mapOutsideInlineCode(text: string, transform: (prose: string) => string): string {
  return text
    .split(/(`+[^`]*`+)/)
    .map((part, i) => (i % 2 === 0 ? transform(part) : part))
    .join('');
}

// ── Clean-ups applied to the reply text ──────────────────────────────────────

/**
 * Shows Markdown headings as bold lines, which is how the chat is styled
 * (models are asked not to use headings). Fenced code is left alone, so
 * "# comment" lines stay as they are. Any ** already in a heading is dropped
 * so the result is one clean bold line.
 */
export function cleanResponseHeaders(text: string): string {
  return mapOutsideCodeFences(text, (prose) =>
    prose
      .replace(/^#{1,6}[ \t]+(.+)$/gm, (line, title: string) => {
        const plain = mapOutsideInlineCode(
          title.replace(/[ \t]+#+[ \t]*$/, ''), // closing hashes: "## Title ##"
          (part) => part.replace(/\*\*/g, ''),
        ).trim();
        return plain ? `**${plain}**` : line;
      })
      .replace(/\n{3,}/g, '\n\n'),
  ).trim();
}

/**
 * Removes artefacts some models emit: heading lines that only say "Loading",
 * "Thinking" and the like, and bare "#" lines. Fenced code is left alone.
 */
export function sanitizeAIContent(content: string): string {
  return mapOutsideCodeFences(content, (prose) =>
    prose
      .replace(/^#{1,6}[ \t]*(loading|please wait|generating|thinking|processing)\.{0,3}[ \t]*$/gim, '')
      .replace(/^#{1,6}[ \t]*$/gm, '')
      .replace(/\n{3,}/g, '\n\n'),
  ).trim();
}

/** Languages whose comments start with "#". */
const HASH_COMMENT_LANGUAGES = new Set([
  'python', 'py', 'bash', 'sh', 'shell', 'zsh', 'fish', 'console', 'powershell', 'ps1',
  'ruby', 'rb', 'r', 'perl', 'pl', 'yaml', 'yml', 'toml', 'dockerfile', 'docker', 'makefile',
  'make', 'cmake', 'nginx', 'gitignore', 'env', 'dotenv', 'elixir', 'ex', 'exs', 'julia', 'jl',
  'nim', 'tcl', 'awk', 'hcl', 'terraform', 'tf', 'gdscript', 'coffeescript', 'coffee',
]);

/**
 * Replies saved before this fix had their "# comment" code lines turned into
 * "**comment**". In languages whose comments start with "#", a line like that
 * is never valid code, so show it as the comment it was. A "## comment" can't
 * be told apart and comes back as "# comment".
 */
export function restoreHashComments(code: string, language?: string): string {
  if (!language || !HASH_COMMENT_LANGUAGES.has(language)) return code;
  return code.replace(/^\*\*(.+?)\*\*[ \t]*$/gm, '# $1');
}

// ── Bold markers that CommonMark didn't accept ───────────────────────────────

type MdPoint = {offset?: number};
type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  position?: {start: MdPoint; end: MdPoint};
};

/** A leftover "**" found in a text node. */
interface Marker {
  marker: true;
  line: number;
  /** Text follows it directly ("**word"). */
  canOpen: boolean;
  /** Text comes directly before it ("word**"). */
  canClose: boolean;
}

type Segment = MdNode | Marker;

const isMarker = (segment: Segment): segment is Marker => (segment as Marker).marker === true;

/** The author escaped an asterisk or wrote it as a character reference, so it is meant literally. */
const LITERAL_STAR_IN_SOURCE = /\\\*|&#0*42;|&#x0*2a;|&ast;/i;

/** Blocks that hold text directly. */
const TEXT_BLOCKS = new Set(['paragraph', 'heading', 'tableCell']);

export interface LooseBoldOptions {
  /**
   * The reply is still arriving: show an unclosed "**" at the end as bold in
   * progress, and hide a trailing "*" or "**" that is still being completed.
   */
  streaming?: boolean;
}

/**
 * remark plugin. Runs after parsing, so it only ever sees asterisks that the
 * parser left as plain text; code, inline code and HTML are never touched.
 * Leftover "**" on the same line are paired up and turned into bold:
 *
 *   **Note:**text   **"Quoted"**next   ** spaced **   **Use `npm ci`:**then
 *
 * A single "**" with no partner stays as it is (for example "2**3"), and so do
 * escaped asterisks such as "\*\*word\*\*".
 */
export function remarkLooseBold(options: LooseBoldOptions = {}) {
  const streaming = options.streaming === true;

  return (tree: MdNode, file?: {value?: unknown}) => {
    const source = typeof file?.value === 'string' ? file.value : '';
    const lastBlock = streaming ? findLastTextBlock(tree) : null;

    const visit = (node: MdNode) => {
      if (!node.children) return;
      for (const child of node.children) visit(child);
      fixLooseBold(node, source, node === lastBlock);
    };
    visit(tree);
  };
}

/** The block where streamed text is currently arriving, if the reply ends in text. */
function findLastTextBlock(tree: MdNode): MdNode | null {
  let node: MdNode | undefined = tree;
  while (node) {
    if (TEXT_BLOCKS.has(node.type)) return node;
    const children: MdNode[] | undefined = node.children;
    node = children && children.length > 0 ? children[children.length - 1] : undefined;
  }
  return null;
}

function hasLiteralStars(node: MdNode, source: string): boolean {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (!source || start === undefined || end === undefined) return false;
  return LITERAL_STAR_IN_SOURCE.test(source.slice(start, end));
}

/** Splits text children at every run of exactly two asterisks. */
function splitAtMarkers(children: MdNode[], source: string): Segment[] {
  const segments: Segment[] = [];
  for (const child of children) {
    const value = child.type === 'text' ? child.value ?? '' : '';
    if (!value.includes('**') || hasLiteralStars(child, source)) {
      segments.push(child);
      continue;
    }
    let textStart = 0;
    let i = 0;
    while (i < value.length) {
      if (value[i] !== '*') {
        i++;
        continue;
      }
      let runEnd = i;
      while (runEnd < value.length && value[runEnd] === '*') runEnd++;
      if (runEnd - i === 2) {
        if (i > textStart) segments.push({type: 'text', value: value.slice(textStart, i)});
        segments.push({marker: true, line: 0, canOpen: false, canClose: false});
        textStart = runEnd;
      }
      i = runEnd;
    }
    if (textStart < value.length) segments.push({type: 'text', value: value.slice(textStart)});
  }
  return segments;
}

/** The character next to segment `k` on one side; a block edge or line break counts as a space. */
function neighbourChar(segments: Segment[], k: number, side: -1 | 1): string {
  const next = segments[k + side];
  if (!next) return ' ';
  if (isMarker(next)) return '*';
  if (next.type === 'text') {
    const value = next.value ?? '';
    return (side === -1 ? value.slice(-1) : value.slice(0, 1)) || ' ';
  }
  return next.type === 'break' ? ' ' : 'x';
}

function crossesPair(partner: Map<number, number>, a: number, b: number): boolean {
  for (const [k, other] of partner) {
    if (k > a && k < b && (other < a || other > b)) return true;
  }
  return false;
}

function hasContentBetween(segments: Segment[], a: number, b: number): boolean {
  for (let k = a + 1; k < b; k++) {
    const segment = segments[k];
    if (isMarker(segment)) continue;
    if (segment.type === 'text' ? /\S/.test(segment.value ?? '') : segment.type !== 'break') return true;
  }
  return false;
}

function fixLooseBold(parent: MdNode, source: string, isStreamingBlock: boolean): void {
  const children = parent.children;
  if (!children || !children.some((child) => child.type === 'text' && child.value?.includes('*'))) return;

  const segments = splitAtMarkers(children, source);

  // Line numbers and which side of each marker touches text
  let line = 0;
  segments.forEach((segment, k) => {
    if (isMarker(segment)) {
      segment.line = line;
      segment.canOpen = !/\s/.test(neighbourChar(segments, k, 1));
      segment.canClose = !/\s/.test(neighbourChar(segments, k, -1));
    } else if (segment.type === 'break') {
      line++;
    } else if (segment.type === 'text') {
      line += (segment.value ?? '').split('\n').length - 1;
    }
  });

  const markers = segments.flatMap((segment, k) => (isMarker(segment) ? [k] : []));
  const partner = new Map<number, number>();
  const pair = (a: number, b: number) => {
    partner.set(a, b);
    partner.set(b, a);
  };

  // Pass 1: markers that touch the text they wrap, e.g. **Note:**text
  const openers: number[] = [];
  for (const k of markers) {
    const marker = segments[k] as Marker;
    const top = openers[openers.length - 1];
    if (top !== undefined && (segments[top] as Marker).line !== marker.line) openers.length = 0;
    if (marker.canClose && openers.length > 0) {
      pair(openers.pop() as number, k);
    } else if (marker.canOpen) {
      openers.push(k);
    }
  }

  // Pass 2: what is left, in order on the same line, e.g. ** spaced words **
  const unpaired = markers.filter((k) => !partner.has(k));
  for (let u = 0; u + 1 < unpaired.length; ) {
    const a = unpaired[u];
    const b = unpaired[u + 1];
    if (
      (segments[a] as Marker).line === (segments[b] as Marker).line &&
      hasContentBetween(segments, a, b) &&
      !crossesPair(partner, a, b)
    ) {
      pair(a, b);
      u += 2;
    } else {
      u += 1;
    }
  }

  // While streaming, the end of the reply may hold a marker that is only half there.
  const dropped = new Set<number>();
  let trimmedTail = false;
  if (isStreamingBlock) {
    const last = [...markers].reverse().find((k) => !partner.has(k));
    if (last !== undefined) {
      const onlySpaceAfter = segments
        .slice(last + 1)
        .every((segment) => !isMarker(segment) && segment.type === 'text' && !/\S/.test(segment.value ?? ''));
      const marker = segments[last] as Marker;
      // "**word" or a spaced "** word", but not a closing "word** "
      const opens = marker.canOpen || !marker.canClose;
      if (onlySpaceAfter) {
        dropped.add(last);
      } else if (opens && marker.line === line && !crossesPair(partner, last, segments.length)) {
        partner.set(last, segments.length); // bold runs to the end for now
      }
    }
    const tail = segments[segments.length - 1];
    if (tail && !isMarker(tail) && tail.type === 'text' && /\*+$/.test(tail.value ?? '')) {
      segments[segments.length - 1] = {type: 'text', value: (tail.value ?? '').replace(/\*+$/, '')};
      trimmedTail = true;
    }
  }

  if (partner.size === 0 && dropped.size === 0 && !trimmedTail) return;
  parent.children = build(segments, partner, dropped, 0, segments.length);
}

function build(
  segments: Segment[],
  partner: Map<number, number>,
  dropped: Set<number>,
  from: number,
  to: number,
): MdNode[] {
  const out: MdNode[] = [];
  for (let k = from; k < to; k++) {
    const segment = segments[k];
    if (!isMarker(segment)) {
      out.push(segment);
      continue;
    }
    if (dropped.has(k)) continue;
    const end = partner.get(k);
    if (end === undefined || end < k) {
      out.push({type: 'text', value: '**'});
      continue;
    }
    out.push(...strong(build(segments, partner, dropped, k + 1, Math.min(end, to))));
    k = end;
  }
  return mergeText(out);
}

/** Wraps nodes in bold, moving spaces just inside the markers to the outside. */
function strong(children: MdNode[]): MdNode[] {
  const before: MdNode[] = [];
  const after: MdNode[] = [];
  const first = children[0];
  if (first?.type === 'text') {
    const value = first.value ?? '';
    const trimmed = value.replace(/^\s+/, '');
    if (trimmed !== value) {
      before.push({type: 'text', value: value.slice(0, value.length - trimmed.length)});
      children[0] = {type: 'text', value: trimmed};
    }
  }
  const last = children[children.length - 1];
  if (last?.type === 'text') {
    const value = last.value ?? '';
    const trimmed = value.replace(/\s+$/, '');
    if (trimmed !== value) {
      after.push({type: 'text', value: value.slice(trimmed.length)});
      children[children.length - 1] = {type: 'text', value: trimmed};
    }
  }
  const inner = children.filter((child) => child.type !== 'text' || child.value !== '');
  return [...before, {type: 'strong', children: inner}, ...after];
}

/** Joins neighbouring text nodes, without doubling the spaces moved out of bold. */
function mergeText(nodes: MdNode[]): MdNode[] {
  const out: MdNode[] = [];
  for (const node of nodes) {
    const previous = out[out.length - 1];
    if (node.type === 'text' && previous?.type === 'text') {
      const left = previous.value ?? '';
      let right = node.value ?? '';
      if (/\s$/.test(left)) right = right.replace(/^[ \t]+/, '');
      out[out.length - 1] = {type: 'text', value: left + right};
    } else if (node.type !== 'text' || node.value) {
      out.push(node);
    }
  }
  return out;
}

// ── Maths ─────────────────────────────────────────────────────────────────────
//
// Models write maths four ways: \( … \) and \[ … \] (gpt-oss and other
// OpenAI-style models), $ … $ and $$ … $$ (Gemini), and some double every
// backslash. The renderer (remark-math, see markdown-math.ts) only reads $$,
// with single-dollar maths switched off so prices like "$5 and $10" stay text.
// Markdown also reads "\[" and "\(" as escaped brackets, which is why replies
// showed raw LaTeX. normalizeMath() rewrites every form into $$ first.

/** Longest formula looked for; also caps what is held back while streaming. */
const MAX_DISPLAY_MATH = 4000;
const MAX_INLINE_MATH = 1000;

/** LaTeX environments that work as a display formula without $$ around them. */
const MATH_ENVIRONMENTS = new Set([
  'equation', 'equation*', 'align', 'align*', 'aligned', 'alignat', 'alignat*', 'alignedat',
  'gather', 'gather*', 'gathered', 'multline', 'multline*', 'split', 'cases', 'dcases', 'rcases',
  'matrix', 'pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix', 'smallmatrix', 'array', 'darray', 'CD',
]);

/** Indentation, ">" quote markers and a list marker at the start of a line. */
const LINE_PREFIX = /^([ \t]*(?:>[ \t]?)*[ \t]*)((?:[-*+]|\d{1,9}[.)])[ \t]+)?/;
const ONLY_LINE_PREFIX = /^[ \t]*(?:>[ \t]?)*[ \t]*(?:(?:[-*+]|\d{1,9}[.)])[ \t]+)?$/;

/** Something only maths would contain. Keeps "\[1\]" and "\[optional\]" as brackets. */
const LOOKS_LIKE_MATH = /\\[A-Za-z]+|[\^_=+\-*/<>{}|]|\d[A-Za-z]|[A-Za-z]\d/;

export interface MathOptions {
  /**
   * The reply is still arriving: hold back a formula until its closing
   * delimiter is in, so half a formula never shows up as raw LaTeX.
   */
  streaming?: boolean;
}

/**
 * Rewrites maths into the $$ form remark-math reads:
 *
 *   \[ … \], $$ … $$ or a bare \begin{aligned} … on lines of their own
 *       → a display formula: $$ fences on their own lines
 *   \( … \), $ … $, and \[ … \] or $$ … $$ inside a sentence
 *       → inline $$ … $$
 *
 * Doubled backslashes (\\( … \\) with \\frac inside) are undone. Code, inline
 * code and escaped \$ are left alone. A single $ only counts as maths by
 * Pandoc's rules: no space just inside the dollars and no digit right after
 * the closing one, so "$20,000 and $30,000" stays text.
 */
export function normalizeMath(markdown: string, options: MathOptions = {}): string {
  const streaming = options.streaming === true;
  return mapOutsideCodeFences(markdown, (prose, atEnd) => convertMath(prose, streaming && atEnd));
}

function convertMath(text: string, streamingTail: boolean): string {
  let out = '';
  let i = 0;

  const lineStart = (pos: number) => text.lastIndexOf('\n', pos - 1) + 1;
  const lineEnd = (pos: number) => {
    const end = text.indexOf('\n', pos);
    return end === -1 ? text.length : end;
  };
  /** Only list or quote markers come before `pos` on its line. */
  const startsLine = (pos: number) => ONLY_LINE_PREFIX.test(text.slice(lineStart(pos), pos));
  /** Only spaces come after `pos` on its line. */
  const endsLine = (pos: number) => text.slice(pos, lineEnd(pos)).trim() === '';

  /**
   * Writes `content`, found between `start` and `end`, as a display formula
   * and returns where to carry on. Inside a list item or quote the fences
   * keep its indentation, so the formula stays inside it.
   */
  const block = (start: number, end: number, content: string): number => {
    const prefix = LINE_PREFIX.exec(text.slice(lineStart(start))) as RegExpExecArray;
    const indent = prefix[1] + ' '.repeat(prefix[2]?.length ?? 0);
    const quoted = prefix[1].includes('>');
    const lines = content
      .split('\n')
      .map((line) => (quoted ? line.replace(/^[ \t]*(?:>[ \t]?)+/, '') : line).trim())
      .filter((line) => line !== '');
    if (!startsLine(start)) out = out.replace(/[ \t]+$/, '') + '\n' + indent;
    out += '$$\n' + lines.map((line) => indent + line + '\n').join('') + indent + '$$';
    if (endsLine(end)) return end;
    // Text after the formula goes on a line of its own
    out += '\n' + indent;
    let next = end;
    while (text[next] === ' ' || text[next] === '\t') next++;
    return next;
  };

  /** While streaming, an unclosed formula at the end is held back until it closes. */
  const holdBack = (start: number, display: boolean, allowBlankLines: boolean): boolean => {
    if (!streamingTail || text.length - start > (display ? MAX_DISPLAY_MATH : MAX_INLINE_MATH)) return false;
    return allowBlankLines || !/\n[ \t]*\n/.test(text.slice(start));
  };

  while (i < text.length) {
    const c = text[i];

    if (c === '`') {
      const end = inlineCodeEnd(text, i);
      out += text.slice(i, end);
      i = end;
      continue;
    }

    if (c === '\\') {
      let run = 1;
      while (text[i + run] === '\\') run++;
      const next = text[i + run];

      // \[ … \] and \( … \), or \\[ … \\] and \\( … \\) with every backslash doubled
      if ((run === 1 || run === 2) && (next === '[' || next === '(')) {
        const display = next === '[';
        const doubled = run === 2;
        const from = i + run + 1;
        const alone = display && startsLine(i) && endsLine(from);
        const close = findBackslashClose(
          text, from, display ? ']' : ')', doubled, display ? MAX_DISPLAY_MATH : MAX_INLINE_MATH, alone,
        );
        if (close) {
          let content = text.slice(from, close.start);
          if (doubled) content = content.replace(/\\\\/g, '\\');
          if (content.trim()) {
            if (display && (content.includes('\n') || (startsLine(i) && endsLine(close.end)))) {
              i = block(i, close.end, content);
              continue;
            }
            if (!display || LOOKS_LIKE_MATH.test(content)) {
              out += inlineMath(content);
              i = close.end;
              continue;
            }
          }
        } else if (holdBack(i, display, alone)) {
          return out;
        }
        out += text.slice(i, from); // not maths: leave it as written
        i = from;
        continue;
      }

      // A bare \begin{aligned} … \end{aligned} on lines of its own
      if (run === 1 && next === 'b' && startsLine(i)) {
        const env = /^\\begin\{([A-Za-z]+\*?)\}/.exec(text.slice(i, i + 40));
        if (env && MATH_ENVIRONMENTS.has(env[1])) {
          const endTag = `\\end{${env[1]}}`;
          const at = text.indexOf(endTag, i + env[0].length);
          if (at !== -1 && at - i <= MAX_DISPLAY_MATH && endsLine(at + endTag.length)) {
            i = block(i, at + endTag.length, text.slice(i, at + endTag.length));
            continue;
          }
          if (at === -1 && holdBack(i, true, true)) return out;
        }
      }

      // Any other escape: keep the backslash with the character it escapes,
      // so "\$" stays a dollar sign and "\`" doesn't start inline code.
      const take = run % 2 === 1 && next !== undefined && next !== '\n' ? run + 1 : run;
      // While streaming, a "\" at the very end may be the start of "\(" or "\["
      if (!(streamingTail && next === undefined)) out += text.slice(i, i + take);
      i += take;
      continue;
    }

    if (c === '$') {
      let run = 1;
      while (text[i + run] === '$') run++;

      if (run === 2) {
        const from = i + 2;
        const alone = startsLine(i) && endsLine(from);
        const close = findDollarClose(text, from, alone);
        const content = close === -1 ? '' : text.slice(from, close);
        if (content.trim()) {
          if (content.includes('\n') || (startsLine(i) && endsLine(close + 2))) {
            i = block(i, close + 2, content);
          } else {
            out += inlineMath(content);
            i = close + 2;
          }
          continue;
        }
        if (close === -1 && holdBack(i, true, alone)) return out;
      }

      if (run === 1 && !/\d/.test(text[i - 1] ?? '')) {
        const close = findSingleDollarClose(text, i);
        if (close !== -1) {
          out += inlineMath(text.slice(i + 1, close));
          i = close + 1;
          continue;
        }
        // While streaming, "$x = \frac{1" at the end is a formula still arriving;
        // a price like "$5 to" has no LaTeX in it and shows straight away.
        const rest = streamingTail && text.length - i <= MAX_INLINE_MATH ? text.slice(i + 1) : '';
        if (
          rest &&
          !/[\n$`]/.test(rest) &&
          /^[^\s,.;:!?)]/.test(rest) &&
          /\\[A-Za-z]|[\^_{}]/.test(rest)
        ) {
          return out;
        }
      }

      // Plain dollar signs. Two or more are escaped, or the parser would
      // read "$$" at the start of a line as the start of a formula. While
      // streaming, dollars at the very end may be the start of one.
      if (!(streamingTail && i + run === text.length)) out += run === 1 ? '$' : '\\$'.repeat(run);
      i += run;
      continue;
    }

    out += c;
    i++;
  }

  return out;
}

/** Inline maths in the one form remark-math reads with single dollars off. */
function inlineMath(content: string): string {
  return `$$${content.replace(/[ \t]*\n[ \t]*/g, ' ').trim()}$$`;
}

/** Whether the line after the line break at `newline` is empty. */
function isBlankLineAfter(text: string, newline: number): boolean {
  let k = newline + 1;
  while (text[k] === ' ' || text[k] === '\t') k++;
  return k < text.length && text[k] === '\n';
}

/** End of the inline code span starting at `start`, or just past its backticks if it never closes. */
function inlineCodeEnd(text: string, start: number): number {
  let ticks = 0;
  while (text[start + ticks] === '`') ticks++;
  const limit = Math.min(text.length, start + 20000);
  for (let j = start + ticks; j < limit; j++) {
    if (text[j] === '\n' && isBlankLineAfter(text, j)) break;
    if (text[j] !== '`') continue;
    let run = 1;
    while (text[j + run] === '`') run++;
    if (run === ticks) return j + run;
    j += run - 1;
  }
  return start + ticks;
}

/**
 * Finds the "\]" or "\)" that closes a formula (or "\\]" / "\\)" when every
 * backslash is doubled). A row break "\\" right before it is part of the formula.
 */
function findBackslashClose(
  text: string,
  from: number,
  bracket: ']' | ')',
  doubled: boolean,
  max: number,
  allowBlankLines: boolean,
): {start: number; end: number} | null {
  const limit = Math.min(text.length, from + max);
  for (let j = from; j < limit; j++) {
    const c = text[j];
    if (c === '\n' && !allowBlankLines && isBlankLineAfter(text, j)) return null;
    if (c !== '\\') continue;
    let run = 1;
    while (text[j + run] === '\\') run++;
    if (text[j + run] === bracket && (doubled ? run % 4 === 2 : run % 2 === 1)) {
      return {start: j + run - (doubled ? 2 : 1), end: j + run + 1};
    }
    j += run - 1;
  }
  return null;
}

/** Finds the "$$" that closes a formula opened just before `from`, or -1. */
function findDollarClose(text: string, from: number, allowBlankLines: boolean): number {
  const limit = Math.min(text.length, from + MAX_DISPLAY_MATH);
  for (let j = from; j < limit; j++) {
    const c = text[j];
    if (c === '\n' && !allowBlankLines && isBlankLineAfter(text, j)) return -1;
    if (c === '\\') {
      j++; // an escaped character such as \$
      continue;
    }
    if (c !== '$') continue;
    let run = 1;
    while (text[j + run] === '$') run++;
    if (run === 2) return j;
    j += run - 1;
  }
  return -1;
}

/**
 * Pandoc's rule for $ … $ on one line: text right after the opening $, no
 * space before the closing $ and no digit after it. Returns the closing $, or -1.
 */
function findSingleDollarClose(text: string, open: number): number {
  const first = text[open + 1];
  if (first === undefined || /[\s,.;:!?)]/.test(first)) return -1;
  const limit = Math.min(text.length, open + 1 + MAX_INLINE_MATH);
  for (let j = open + 1; j < limit; j++) {
    const c = text[j];
    if (c === '\n' || c === '`') return -1;
    if (c === '\\') {
      j++;
      continue;
    }
    if (c === '$') return /\s/.test(text[j - 1]) || /[\d$]/.test(text[j + 1] ?? '') ? -1 : j;
  }
  return -1;
}
