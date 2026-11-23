import React from 'react';
import Link from 'next/link';
import { insights } from '@/lib/data/insights';
import { worlds, opening, openingAthletics, closing, worldForInsight, journeyPhoto, featuredProjectSlugs, type PhotoId, type World } from '@/lib/data/worlds';
import { projects } from '@/lib/data/projects';
import { ProjectCard } from '@/components/home/ProjectCard';
import { SpecRow } from '@/components/shared/SpecRow';
import { highlightInsight } from '@/lib/insights-highlight';
import { CodeCard } from '@/components/sections/insights/CodeCard';
import { ResearchPaper } from '@/components/sections/research/ResearchPaper';
import { JourneyPhoto } from '@/components/journey/JourneyPhoto';
import { ZoomPic } from '@/components/ui/zoom-pic';
import { showInStoryGallery } from '@/lib/data/image-places';
import { EXPERIENCE } from '@/lib/data/sections';
import { CountUp } from '@/components/ui/count-up';

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
        <h2 id="experience-title" className="bg-title rv draw-rule">{EXPERIENCE}</h2>
        <span id="story" aria-hidden className="bg-anchor" />
        <span id="insights" aria-hidden className="bg-anchor" />
        <Chapter
          id="prologue"
          mark={`Prologue · ${opening.kicker}`}
          title={opening.title}
          paragraphs={[opening.body, openingAthletics]}
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
        /* Every chapter uses the same column, so every edge lines up down the page. */
        .ch { max-width: 1080px; margin: 0 auto; padding: clamp(48px, 6vw, 88px) 0; border-bottom: 1px solid var(--bd); scroll-margin-top: 72px; }
        .ch-photo { position: relative; aspect-ratio: 21 / 8; overflow: hidden; border-radius: 3px; background: var(--surface); }
        .ch-credit { font-size: 13px; color: var(--text3); margin-top: 8px; }
        .ch-head { margin-top: clamp(24px, 3vw, 40px); padding-bottom: 18px; border-bottom: 2px solid var(--area); display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 8px 24px; }
        .ch-mark { font-size: 14px; display: inline-flex; align-items: center; gap: 8px; color: color-mix(in oklab, var(--area) var(--accent-mix), var(--foreground)); }
        .ch-mark::before { content: ''; width: 9px; height: 9px; border-radius: 50%; background: var(--area); }
        .ch-title { font-size: clamp(30px, 3.4vw, 48px); font-weight: 400; letter-spacing: -0.025em; line-height: 1.05; }
        .ch-main { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 28px clamp(28px, 5vw, 72px); margin-top: 24px; align-items: start; }
        .ch-body p { margin-bottom: 14px; font-size: 18px; line-height: 1.6; }
        .ch-side { display: flex; flex-direction: column; gap: 18px; }
        .ch-side dl { border-top: 1px solid var(--foreground); }
        .ch-caption { font-size: 14px; color: var(--text3); }
        .ch-links { display: flex; flex-direction: column; gap: 6px; font-size: 15px; }
        .ch-links span { color: var(--text3); font-size: 14px; }
        .ch-side-photo { margin: 10px 0 0; max-width: 560px; }
        .ch-side-photo figcaption { font-size: 13px; color: var(--text3); margin-top: 6px; }
        .ch-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 16px; margin-top: clamp(28px, 3vw, 40px); align-items: start; }
        .ch-gallery figure { margin: 0; }
        .ch-gallery figcaption { font-size: 13px; color: var(--text3); margin-top: 6px; }
        .ch-photo.own img { object-fit: contain !important; }
        .zoom-pic { display: block; width: 100%; padding: 0; border: 0; border-radius: 3px; overflow: hidden; background: var(--surface); cursor: zoom-in; }
        .ch-projects { margin-top: clamp(36px, 4vw, 56px); scroll-margin-top: 80px; }
        .ch-sub { font-size: 15px; font-weight: 400; color: var(--text2); padding-bottom: 12px; margin-bottom: 20px; border-bottom: 1px solid var(--bd); }
        .ch-project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 36px 28px; align-items: start; }
        .ch-extras { margin-top: clamp(40px, 5vw, 64px); display: flex; flex-direction: column; gap: clamp(32px, 4vw, 56px); }
        .ch-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(460px, 100%), 1fr)); gap: 32px; align-items: start; }
        @media (max-width: 860px) { .ch-main { grid-template-columns: minmax(0, 1fr); } .ch-photo:not(.own) { aspect-ratio: 16 / 9; } }

        /* Project cards inside a chapter */
        .pc { display: flex; flex-direction: column; gap: 8px; color: inherit; }
        /* One project in a chapter: picture and words side by side. */
        .ch-project-grid.single .pc { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); column-gap: clamp(24px, 4vw, 48px); row-gap: 8px; align-content: start; }
        .ch-project-grid.single .pc > :first-child { grid-column: 1; grid-row: 1 / span 8; align-self: start; }
        .ch-project-grid.single .pc > :not(:first-child) { grid-column: 2; }
        .ch-project-grid.single .pc-meta { margin-top: 0; }
        @media (max-width: 760px) { .ch-project-grid.single .pc { display: flex; } }
        .pc-media { display: block; border-radius: 3px; overflow: hidden; background: var(--surface); border-bottom: 3px solid var(--area); }
        .pc-meta { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; font-size: 14px; color: var(--text3); }
        .pc-status { display: inline-flex; align-items: center; gap: 8px; color: var(--text2); }
        .pc-status i { width: 7px; height: 7px; border-radius: 50%; background: var(--area); }
        .pc-title { font-size: 24px; letter-spacing: -0.015em; line-height: 1.2; background: linear-gradient(var(--area), var(--area)) 0 100% / 0 2px no-repeat; transition: background-size .4s cubic-bezier(.2,.7,.2,1); align-self: flex-start; }
        .pc:is(:hover, :focus-visible) .pc-title { background-size: 100% 2px; }
        .pc-arrow { display: inline-block; transition: transform .25s; color: color-mix(in oklab, var(--area) var(--accent-mix), var(--foreground)); }
        .pc:is(:hover, :focus-visible) .pc-arrow { transform: translateX(5px); }
        .pc-tag { font-size: 14px; color: var(--text3); }
        .pc-headline { font-size: 16px; color: color-mix(in oklab, var(--area) var(--accent-mix), var(--foreground)); }
        .pc-story { font-size: 15px; color: var(--text2); }
        .pc-tools { font-size: 14px; color: var(--text3); }
        .pc-more { font-size: 15px; margin-top: 4px; }
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

function Chapter({ id, mark, title, paragraphs, stat, photo, children, gallery, caption, area = '#2dd4bf', side, after }: {
  id: string; mark: string; title: string; paragraphs: string[]; stat: { value: string; label: string };
  photo?: PhotoId; children?: React.ReactNode; gallery?: World['gallery']; caption?: string; area?: string;
  /** Extra items under the stat (links to the chapter's projects). */
  side?: React.ReactNode;
  /** Shown right after the gallery (the chapter's projects). */
  after?: React.ReactNode;
}) {
  return (
    <article id={id} aria-labelledby={`${id}-title`} className="ch" style={{ '--area': area } as React.CSSProperties}>
      {photo && (
        <>
          {journeyPhoto(photo).own ? (
            // Ahmad's own photo: shown whole, at its real shape.
            <div className="ch-photo own rv-photo" style={{ aspectRatio: `${journeyPhoto(photo).width} / ${journeyPhoto(photo).height}` }}>
              <JourneyPhoto id={photo} sizes="(max-width: 1120px) 100vw, 1080px" />
            </div>
          ) : (
            <div className="ch-photo rv-photo parallax"><JourneyPhoto id={photo} sizes="(max-width: 1120px) 100vw, 1080px" /></div>
          )}
          <Credit id={photo} />
        </>
      )}
      <header className="ch-head rv">
        <h3 id={`${id}-title`} className="ch-title">{title}</h3>
        <p className="ch-mark">{mark}</p>
      </header>
      <div className="ch-main">
        <div className="ch-body rv">
          {paragraphs.map((t) => <p key={t.slice(0, 24)}>{t}</p>)}
          {/* A single photo sits under the words instead of stretching across the page. */}
          {gallery && gallery.length === 1 && (
            <figure className="ch-side-photo rv-fade">
              <ZoomPic src={gallery[0].src} alt={gallery[0].alt} sizes="(max-width: 860px) 92vw, 600px" />
              <figcaption>{gallery[0].alt}</figcaption>
            </figure>
          )}
        </div>
        <aside className="ch-side rv" style={{ '--i': 2 } as React.CSSProperties}>
          <dl><SpecRow label={stat.label} value={<CountUp value={stat.value} />} color={area} /></dl>
          {caption && <p className="ch-caption">{caption}</p>}
          {side}
        </aside>
      </div>
      {gallery && gallery.length > 1 && (
        <div className="ch-gallery">
          {gallery.map((g, i) => (
            <figure key={g.src} className="rv-fade" style={{ '--i': i } as React.CSSProperties}>
              <ZoomPic src={g.src} alt={g.alt} sizes="(max-width: 860px) 92vw, 540px" />
              <figcaption>{g.alt}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {after}
      {children && <div className="ch-extras">{children}</div>}
    </article>
  );
}

/** Where each chapter's project list sits, so the hero's three nodes can jump to it. */
const PROJECT_ANCHOR: Record<World['id'], string> = {
  'ai-engineering': 'path-agentic-ai',
  research: 'path-uav-research',
  'sports-analytics': 'path-sports-analytics',
  'data-science': 'path-data-science',
  'chem-e-car': 'path-chem-e-car',
};
const FEATURED: readonly string[] = featuredProjectSlugs;
const FEATURED_ANCHOR: Record<string, string> = {
  'toledo-football-iq-computer-vision-analytics': '#toledo-football-iq',
  'homeowner-loss-prediction': '#homeowner-loss-prediction',
};

function WorldBlock({ world: w, cards }: { world: World; cards: { insight: (typeof insights)[number]; lines: Awaited<ReturnType<typeof highlightInsight>> }[] }) {
  const all = w.projectSlugs.map((slug) => projects.find((p) => p.slug === slug)!);
  const own = all.filter((p) => !FEATURED.includes(p.slug!));
  const featured = all.filter((p) => FEATURED.includes(p.slug!));
  return (
    <Chapter
      area={w.accent}
      id={w.id}
      mark={`${w.n} · ${w.label} · ${w.years}`}
      title={w.title}
      paragraphs={w.paragraphs}
      stat={w.stat}
      photo={w.photo}
      gallery={w.gallery.filter((g) => showInStoryGallery(g.src))}
      caption={w.artCaption}
      side={
        <p className="ch-links">
          <span>{all.length === 1 ? 'The project' : 'The projects'}</span>
          {all.map((p) => (
            <Link key={p.slug} href={FEATURED.includes(p.slug!) ? FEATURED_ANCHOR[p.slug!] : `/case-study/${p.slug}`} className="text-link is-underlined" style={{ alignSelf: 'flex-start' }}>
              {p.title} {FEATURED.includes(p.slug!) ? '↑' : '→'}
            </Link>
          ))}
        </p>
      }
      after={
        <div id={PROJECT_ANCHOR[w.id]} className="ch-projects">
          {own.length > 0 && (
            <>
              <h4 className="ch-sub">{own.length === 1 ? 'Project' : 'Projects'} from this chapter</h4>
              <div className={own.length === 1 ? 'ch-project-grid single' : 'ch-project-grid'}>
                {own.map((p, i) => <ProjectCard key={p.idx} p={p} i={i} />)}
              </div>
            </>
          )}
          {featured.length > 0 && own.length === 0 && (
            <p className="ch-sub">Featured at the top of the page: {featured.map((p) => p.title).join(', ')}.</p>
          )}
        </div>
      }
    >
      {w.id === 'research' && <ResearchPaper />}
      {cards.length > 0 && (
        <div className="ch-cards rv">
          {cards.map(({ insight, lines }) => <CodeCard key={insight.id} insight={insight} lines={lines} />)}
        </div>
      )}
    </Chapter>
  );
}
