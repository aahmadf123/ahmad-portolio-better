import React from 'react';
import { insights } from '@/lib/data/insights';
import { worlds, opening, closing, worldForInsight, journeyPhoto, type PhotoId, type World } from '@/lib/data/worlds';
import { highlightInsight } from '@/lib/insights-highlight';
import { CodeCard } from '@/components/sections/insights/CodeCard';
import { ResearchPaper } from '@/components/sections/research/ResearchPaper';
import { JourneyPhoto } from '@/components/journey/JourneyPhoto';
import { Pic } from '@/components/ui/pic';
import { EXPERIENCE } from '@/lib/data/sections';

/**
 * "Experience and background": where it started (Toledo), the five worlds in order,
 * and the next chapter, as plain chapters. Each opens on its photograph of a real place;
 * Ahmad's own photos sit beside the words; insights and the research paper follow.
 */
export async function Background() {
  const cards = await Promise.all(insights.map(async (insight) => ({ insight, lines: await highlightInsight(insight) })));
  return (
    <section id="experience" aria-labelledby="experience-title" className="bg">
      <div className="wrap">
        <h2 id="experience-title" className="bg-title">{EXPERIENCE}</h2>
        <span id="story" aria-hidden className="bg-anchor" />
        <span id="insights" aria-hidden className="bg-anchor" />
        <Chapter
          id="prologue"
          mark={`Prologue · ${opening.kicker}`}
          title={opening.title}
          paragraphs={[opening.body]}
          stat={opening.stat}
          photo="opening"
        />
        {worlds.map((w) => (
          <WorldBlock key={w.id} world={w} cards={cards.filter((c) => worldForInsight(c.insight) === w.id)} />
        ))}
        <Chapter
          id="next-chapter"
          mark={closing.kicker}
          title={closing.title}
          paragraphs={[closing.body]}
          stat={closing.stat}
        />
      </div>
      <style>{`
        .bg { padding: clamp(56px, 8vw, 112px) 0; border-top: 1px solid var(--bd); position: relative; }
        .bg-anchor { position: absolute; top: 0; left: 0; width: 1px; height: 1px; }
        .bg-title { font-size: clamp(40px, 5vw, 72px); font-weight: 400; letter-spacing: -0.03em; line-height: 1; }
        .ch { padding: clamp(48px, 6vw, 88px) 0; border-bottom: 1px solid var(--bd); scroll-margin-top: 72px; }
        .ch-photo { position: relative; aspect-ratio: 21 / 8; overflow: hidden; border-radius: 3px; background: var(--surface); margin-bottom: clamp(24px, 3vw, 40px); }
        .ch-credit { font-size: 13px; color: var(--text3); margin: -28px 0 28px; }
        .ch-grid { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 20px clamp(24px, 5vw, 80px); }
        .ch-mark { font-size: 14px; color: var(--text2); }
        .ch-title { font-size: clamp(28px, 3vw, 44px); font-weight: 400; letter-spacing: -0.025em; line-height: 1.05; margin-top: 8px; }
        .ch-body p { margin-bottom: 12px; max-width: 38em; }
        .ch-stat { display: flex; flex-direction: column; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--bd); max-width: 38em; }
        .ch-stat dd { font-size: 26px; letter-spacing: -0.02em; order: 1; }
        .ch-stat dt { font-size: 14px; color: var(--text2); order: 2; }
        .ch-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); gap: 12px; margin-top: 28px; }
        .ch-gallery figure { margin: 0; }
        .ch-gallery .pic { aspect-ratio: 4 / 3; overflow: hidden; border-radius: 3px; background: var(--surface); }
        .ch-gallery img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ch-gallery figcaption, .ch-caption { font-size: 13px; color: var(--text3); margin-top: 6px; }
        .ch-extras { margin-top: clamp(40px, 5vw, 64px); display: flex; flex-direction: column; gap: clamp(32px, 4vw, 56px); }
        .ch-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(420px, 100%), 1fr)); gap: 32px; }
        @media (max-width: 860px) { .ch-grid { grid-template-columns: minmax(0, 1fr); } .ch-photo { aspect-ratio: 16 / 9; } }
      `}</style>
    </section>
  );
}

function Credit({ id }: { id: PhotoId }) {
  const c = journeyPhoto(id).credit;
  if (!c) return null;
  return (
    <p className="ch-credit">
      Photo: <a href={c.page} target="_blank" rel="noopener" className="text-link">{c.photographer}</a> (<a href={c.licenceUrl} target="_blank" rel="noopener" className="text-link">{c.licence}</a>)
    </p>
  );
}

function Chapter({ id, mark, title, paragraphs, stat, photo, children, gallery, caption }: {
  id: string; mark: string; title: string; paragraphs: string[]; stat: { value: string; label: string };
  photo?: PhotoId; children?: React.ReactNode; gallery?: World['gallery']; caption?: string;
}) {
  return (
    <article id={id} aria-labelledby={`${id}-title`} className="ch">
      {photo && (
        <>
          <div className="ch-photo"><JourneyPhoto id={photo} sizes="(max-width: 1240px) 100vw, 1140px" /></div>
          <Credit id={photo} />
        </>
      )}
      <div className="ch-grid">
        <div>
          <p className="ch-mark">{mark}</p>
          <h3 id={`${id}-title`} className="ch-title">{title}</h3>
        </div>
        <div className="ch-body">
          {paragraphs.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
          <dl className="ch-stat"><dt>{stat.label}</dt><dd>{stat.value}</dd></dl>
          {caption && <p className="ch-caption">{caption}</p>}
          {gallery && gallery.length > 0 && (
            <div className="ch-gallery">
              {gallery.map((g) => (
                <figure key={g.src}>
                  <div className="pic"><Pic src={g.src} alt={g.alt} sizes="(max-width: 860px) 46vw, 260px" /></div>
                  <figcaption>{g.alt}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
      {children && <div className="ch-extras">{children}</div>}
    </article>
  );
}

function WorldBlock({ world: w, cards }: { world: World; cards: { insight: (typeof insights)[number]; lines: Awaited<ReturnType<typeof highlightInsight>> }[] }) {
  return (
    <Chapter
      id={w.id}
      mark={`${w.n} · ${w.label} · ${w.years}`}
      title={w.title}
      paragraphs={w.paragraphs}
      stat={w.stat}
      photo={w.photo}
      gallery={w.gallery}
      caption={w.artCaption}
    >
      {w.id === 'research' && <ResearchPaper />}
      {cards.length > 0 && (
        <div className="ch-cards">
          {cards.map(({ insight, lines }) => <CodeCard key={insight.id} insight={insight} lines={lines} />)}
        </div>
      )}
    </Chapter>
  );
}
