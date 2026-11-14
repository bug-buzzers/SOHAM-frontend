'use client';

import ReactMarkdown, {type Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {normalizeMath, remarkLooseBold} from '@/lib/chat-markdown';
import {MATH_TAG, rehypeMath, remarkMathPlugin} from '@/lib/markdown-math';

/**
 * A formula typeset by rehypeMath. The HTML comes from KaTeX with `trust`
 * off, so it holds only KaTeX's own markup and the escaped formula text.
 */
function MathHtml({html, display}: {html?: string; display?: string}) {
  const Tag = display === 'block' ? 'div' : 'span';
  return <Tag dangerouslySetInnerHTML={{__html: html ?? ''}} />;
}

/** Add to a ReactMarkdown `components` prop that uses rehypeMath. */
export const mathComponents = {[MATH_TAG]: MathHtml} as unknown as Components;

interface MathMarkdownProps {
  children: string;
  /** Show single line breaks as line breaks, as the chat does. */
  breaks?: boolean;
}

/** AI-written Markdown with maths, for pages outside the chat. */
export function MathMarkdown({children, breaks = false}: MathMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={
        breaks
          ? [remarkGfm, remarkMathPlugin, remarkLooseBold, remarkBreaks]
          : [remarkGfm, remarkMathPlugin, remarkLooseBold]
      }
      rehypePlugins={[rehypeMath]}
      components={mathComponents}
    >
      {normalizeMath(children)}
    </ReactMarkdown>
  );
}
