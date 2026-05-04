/**
 * /docs → /documentation redirect (catch-all)
 *
 * Maps:
 *   /docs                    → /documentation
 *   /docs/quick-start        → /documentation/quick-start
 *   /docs/api-reference      → /documentation/api-reference
 *   /docs/[any-sub-page]     → /documentation/[any-sub-page]
 *
 * Uses a permanent (308) redirect so search engines transfer link equity
 * to the canonical /documentation URLs.
 */

import { redirect } from 'next/navigation';

interface Props {
  params: { slug?: string[] };
}

export default function DocsRedirect({ params }: Props) {
  const slug = params.slug?.join('/') ?? '';
  const target = slug ? `/documentation/${slug}` : '/documentation';
  redirect(target);
}

// Tell Next.js this page has no static params — always redirect at request time
export const dynamic = 'force-dynamic';
