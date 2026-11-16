import React from 'react';
import { insights } from '@/lib/data/insights';
import { worlds, worldForInsight, type PhotoId, type World } from '@/lib/data/worlds';
import { highlightInsight } from '@/lib/insights-highlight';
import { CodeCard } from '@/components/sections/insights/CodeCard';
import { ResearchPaper } from '@/components/sections/research/ResearchPaper';
import { FlyInScene, SceneCopy } from './FlyInScene';
import { ChapterCopy } from './ChapterCopy';
import { WorldWork } from './WorldWork';

const hidden: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: 1, height: 1 };

/**
 * One world of the photo journey: fly in from the previous photo to this world's
 * photo with its part of the story, then its projects, extras and insights.
 * Server component so insight snippets are highlighted at render time.
 */
export async function WorldChapter({ world, prev }: { world: World; prev: PhotoId }) {
  const cards = await Promise.all(
    insights.filter((i) => worldForInsight(i) === world.id).map(async (insight) => ({ insight, lines: await highlightInsight(insight) }))
  );
  const first = world.id === worlds[0].id;
  const titleId = `${world.id}-title`;

  return (
    <section id={world.id} aria-labelledby={titleId} style={{ position: 'relative', zIndex: 20 }}>
      {/* Old links (/#story, /#projects, /#insights) from before the redesign land here. */}
      {first && (
        <>
          <span id="story" aria-hidden style={hidden} />
          <span id="projects" aria-hidden style={hidden} />
          <span id="insights" aria-hidden style={hidden} />
        </>
      )}
      <FlyInScene id={world.id} from={prev} to={world.photo} length={world.length} joinPrevious={first} labelledBy={titleId}>
        <SceneCopy photo={world.photo}>
          <ChapterCopy
            mark={`${world.n} · ${world.label} · ${world.years}`}
            title={world.title}
            titleId={titleId}
            paragraphs={world.paragraphs}
            stat={world.stat}
            accent={world.accent}
            testId={`world-copy-${world.id}`}
          />
        </SceneCopy>
      </FlyInScene>
      <WorldWork world={world}>
        {world.id === 'research' ? <ResearchPaper /> : null}
        {cards.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 16 }}>
            {cards.map(({ insight, lines }) => <CodeCard key={insight.id} insight={insight} lines={lines} />)}
          </div>
        ) : null}
      </WorldWork>
    </section>
  );
}
