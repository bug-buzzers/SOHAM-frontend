/**
 * Markdown clean-up for AI replies.
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
 * end, as it does when the Markdown is rendered.
 */
export function mapOutsideCodeFences(text: string, transform: (prose: string) => string): string {
  const parts: string[] = [];
  let prose: string[] = [];
  let fence: string | null = null; // the opening fence, e.g. "```"

  const flushProse = () => {
    if (prose.length > 0) {
      parts.push(transform(prose.join('\n')));
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
      flushProse();
      parts.push(line);
      fence = open[1];
      continue;
    }
    prose.push(line);
  }
  flushProse();
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
