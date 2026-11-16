import { codeToTokensBase, type ThemedToken } from 'shiki';
import type { Insight } from '@/lib/data/insights';
import type { TokenLine } from '@/components/sections/insights/CodeCard';

/** Shiki-tokenize an insight's snippet on the server (zero highlighter JS on the client). */
export async function highlightInsight(insight: Insight): Promise<TokenLine[]> {
  const tokens = await codeToTokensBase(insight.code, {
    lang: insight.lang === 'ts' ? 'typescript' : insight.lang,
    theme: 'vitesse-dark',
  });
  return tokens.map((line: ThemedToken[]) => line.map((t) => ({ content: t.content, color: t.color ?? '#a3a8b0' })));
}
