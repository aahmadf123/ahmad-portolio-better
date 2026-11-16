import { insights } from '@/lib/data/insights';
import { sectionById } from '@/lib/data/sections';
import { highlightInsight } from '@/lib/insights-highlight';
import { InsightsGrid } from './CodeCard';

/**
 * Technical insights - server component: shiki tokenizes every snippet at
 * render time (zero highlighter JS in the client bundle); the client grid
 * animates the pre-tokenized lines in one by one.
 */
export async function InsightsSection() {
  const def = sectionById('insights')!;
  const cards = await Promise.all(insights.map(async (insight) => ({ insight, lines: await highlightInsight(insight) })));
  return <InsightsGrid def={def} cards={cards} />;
}
