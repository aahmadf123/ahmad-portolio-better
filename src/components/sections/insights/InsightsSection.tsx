import { codeToTokensBase, type ThemedToken } from 'shiki';
import { insights } from '@/lib/data/insights';
import { sections } from '@/lib/data/sections';
import { InsightsGrid, type TokenLine } from './CodeCard';

/**
 * Technical insights - server component: shiki tokenizes every snippet at
 * render time (zero highlighter JS in the client bundle); the client grid
 * animates the pre-tokenized lines in one by one.
 */
export async function InsightsSection() {
  const def = sections.find((s) => s.id === 'insights')!;

  const cards = await Promise.all(
    insights.map(async (insight) => {
      const tokens = await codeToTokensBase(insight.code, {
        lang: insight.lang === 'ts' ? 'typescript' : insight.lang,
        theme: 'vitesse-dark',
      });
      const lines: TokenLine[] = tokens.map((line: ThemedToken[]) =>
        line.map((t) => ({ content: t.content, color: t.color ?? '#a3a8b0' }))
      );
      return { insight, lines };
    })
  );

  return <InsightsGrid def={def} cards={cards} />;
}
