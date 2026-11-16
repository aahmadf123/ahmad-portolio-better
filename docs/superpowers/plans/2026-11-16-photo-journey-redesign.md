# Photo Journey Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's look and flow with a scroll journey through real photographs, one per side of Ahmad: the AIChE Chem-E Car team, data science, sports analytics, research, AI engineering. The journey uses a "fly-in" camera push between photos, and every piece of information on the current site is kept.

**Architecture:**
- **World registry.** A typed registry (`src/lib/data/worlds.ts`) groups existing content into five worlds by *referencing* the current data files. Story text, projects and insights are never copied or reworded.
- **Photo pipeline.** An offline step makes responsive photos plus a depth map per photo.
- **`FlyInScene`.** On every device, `FlyInScene` drives CSS photo layers from framer-motion `useScroll`.
- **Depth on desktop.** A single fixed three.js canvas (`JourneyCanvas`) adds real depth parallax on desktop only, and the CSS layers stay as the fallback.
- **Content tests.** A Playwright content test captured *before* any change guards against information loss.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2, framer-motion 12 (`useScroll`/`useTransform`, LazyMotion `m`), three.js 0.184, sharp, `@huggingface/transformers` (dev, depth maps), `@playwright/test` + `@axe-core/playwright` (dev).

**Spec:** `docs/superpowers/specs/2026-11-16-photo-journey-redesign-design.md`

## Global Constraints

- **Next.js rules.** Read `node_modules/next/dist/docs/` before writing Next-specific code; this Next version has breaking changes (AGENTS.md).
- **No information loss.** Every string leaf in `src/lib/data/*.ts` and every rendered text unit on every route at baseline must still exist. The only exceptions are entries in `tests/content/allowed-removals.json`. Each entry has a `reason`, and any entry containing a digit must also name `preservedAs`, a string that must still render.
- **Data files are append-only.** `src/lib/data/*.ts` may gain fields and files. No existing string is edited or deleted. New grouping lives in `worlds.ts`.
- **Hex colours in JS.** Accent colours passed through JS stay hex literals (they are alpha-concatenated and read by canvas). Never use `var()` strings in JS colour props.
- **Fonts and theme.** Dark theme only. Fonts are `--font-display` (Instrument Serif), `--font-body` (Figtree) and `--font-code` (JetBrains Mono).
- **Photos.**
  - Unsplash or Pexels licence only.
  - Self-hosted in `public/Images/journey/`, never hot-linked.
  - Each photo is credited in the footer.
  - No AI-generated images. No people's faces as the subject.
  - The sports photo must not be a football close-up.
- **Equal weighting.** Sports analytics is never first or last in the journey, and the opening photo belongs to no world.
- **Don't regress.**
  - Lighthouse median of 3: mobile `/` perf ≥ 73, desktop `/` perf ≥ 99.
  - Zero horizontal overflow at 320, 375, 430, 768, 1024, 1280, 1920 and 2560 px on every route.
  - axe: no serious or critical issues.
  - Skip link to `#main`, `:focus-visible` ring, SubpageHeader, CaseStudyPager, and safe-area insets all stay.
- **Reduced motion.** `prefers-reduced-motion: reduce` gives still photos with crossfades: no scale, no parallax, no canvas.
- **Branch and merge.** Work on branch `redesign/photo-journey`. Nothing merges to `main` without Ahmad's explicit OK.
- **Windows.** Before every `next start`, free port 3200 by killing its PID (`Get-NetTCPConnection -LocalPort 3200` → `Stop-Process`). TaskStop leaves `next start` alive.

## Review Focus

1. **Back, refresh or deep-link into the middle of the journey.** Returning from a case study (SmartBackLink or browser back) lands on the same world, with photo layers in the right state rather than stuck at opacity 0. Test: Task 9, `back from case study restores world`.
2. **Old anchors from shared links.** `/#projects`, `/#story`, `/#research`, `/#skills`, `/#timeline`, `/#credentials`, `/#signals`, `/#insights`, `/#now`, `/#about`, `/#contact` and `/#field-notes` all still land somewhere sensible. Test: Task 6, `legacy anchors resolve`.
3. **Depth assets or WebGL fail.** A blocked depth map, no WebGL, or a lost context leaves the CSS photo layers visible with no console errors. Test: Task 8, `canvas failure falls back to css photos`.
4. **Rotating a phone or resizing mid-scroll.** The tier switches cleanly, with no horizontal overflow and no frozen transforms. Test: Task 8, `resize desktop to phone mid-journey`.
5. **Keyboard users tabbing into a world.** A focused project card is visible: no ancestor below opacity 1, and it is inside the viewport. Test: Task 6, `keyboard focus inside a world is visible`.

---

## File map

| File | Responsibility |
|---|---|
| `playwright.config.ts` | Test runner: prod server on :3200, projects `desktop` (1440×900), `phone` (390×844, hasTouch, isMobile), `reduced` (desktop + reducedMotion) |
| `tests/content/collect.ts` | `collectDataStrings()`, `collectRenderedUnits(page)`, `normalize()` |
| `tests/content/capture.spec.ts` | Writes baselines when `CAPTURE=1` (run once, Task 1) |
| `tests/content/no-loss.spec.ts` | Asserts baselines survive |
| `tests/content/baseline/*.json` | Committed baselines (data strings plus one file per route) |
| `tests/content/allowed-removals.json` | Explicit label-only removals with reasons |
| `scripts/journey-photos.json` | Chosen photos: id, source URL, page URL, photographer, focal point, alt |
| `scripts/journey-photos.mjs` | Download, grade, resize to AVIF/WebP, write manifest |
| `scripts/depth-maps.mjs` | Depth map per photo → `public/Images/journey/<id>-depth.webp` |
| `src/lib/journey-manifest.json` | Generated photo manifest |
| `src/lib/data/worlds.ts` | World registry, opening and closing, mapping helpers |
| `src/lib/journey/tier.ts` | `useJourneyTier()` |
| `src/lib/journey/store.ts` | Tiny external store linking scenes to `JourneyCanvas` |
| `src/components/journey/JourneyPhoto.tsx` | Responsive `<picture>` for a manifest photo |
| `src/components/journey/FlyInScene.tsx` | Sticky scene: CSS photo layers plus copy, driven by scroll |
| `src/components/journey/JourneyCanvas.tsx` | Desktop-only three.js depth renderer (dynamic import) |
| `src/components/journey/OpeningScene.tsx` | Replaces HeroSection |
| `src/components/journey/WorldChapter.tsx` | One world: scene, projects, extras, insights |
| `src/components/journey/ClosingScene.tsx` | "The next chapter" (AI engineering → back to the opening photo) |
| `src/components/journey/PhotoBackdrop.tsx` | Photo header and fly-in for inside pages |
| `src/components/sections/projects/ProjectModalProvider.tsx` | One shared project modal for all worlds |
| `src/components/sections/research/ResearchPaper.tsx` | Research block without its section header |
| `src/lib/insights-highlight.ts` | Shiki highlighting extracted from InsightsSection |

---

### Task 1: Test harness and content baselines (before any visual change)

**Files:**
- Create: `playwright.config.ts`, `tests/content/collect.ts`, `tests/content/capture.spec.ts`, `tests/content/no-loss.spec.ts`, `tests/content/allowed-removals.json` (`[]`)
- Modify: `package.json` (devDependencies `@playwright/test`, `@axe-core/playwright`; scripts `"test:e2e": "playwright test"`)

**Interfaces:**
- Produces:
  - `normalize(s: string): string`: collapses whitespace, removes the space before `,.;:!?)`, and trims.
  - `collectDataStrings(): Promise<string[]>`: dynamically imports every `src/lib/data/*.ts` (tsconfig `@/` paths) and every exported value, then recursively collects string leaves of length ≥ 2 that aren't URLs or paths starting with `/` or `#`, de-duplicated and normalized.
  - `collectRenderedUnits(page): Promise<string[]>`: scrolls the page to the bottom in 600px steps (150 ms each) so lazy and IntersectionObserver content mounts, then walks text nodes under `main` and `footer`. It skips `script`, `style`, `[aria-hidden="true"]` and `canvas`. Each trimmed node text with ≥ 3 words, or containing a digit, becomes one normalized unit.
  - `ROUTES: string[]`: `/`, `/field-notes`, `/docs`, each `/field-notes/<slug>` from `fieldNotes` where published, and each `/case-study/<slug>` from `caseStudySlugs`.
  - Allowed-removal entry type: `{ text: string; reason: string; preservedAs?: string }`.

- [ ] **Step 1:** Install `@playwright/test` and `@axe-core/playwright` as devDependencies. Write `playwright.config.ts`:
  - `webServer: { command: 'npm run build && npm run start -- -p 3200', url: 'http://localhost:3200', reuseExistingServer: true, timeout: 600_000 }`
  - `use.channel: 'chrome'`
  - the three projects from the file map
  - `testDir: 'tests'`
- [ ] **Step 2:** Write `capture.spec.ts`. When `process.env.CAPTURE === '1'` (otherwise `test.skip`) it:
  - writes `tests/content/baseline/data.json` from `collectDataStrings()`;
  - for each route, using the desktop project only, writes `tests/content/baseline/<route-slug>.json` from `collectRenderedUnits`. The route slug is `/` → `home`, and `/a/b` → `a__b`.
- [ ] **Step 3:** Write `no-loss.spec.ts` with these tests:
  - `data strings survive`: every baseline data string ∈ the current `collectDataStrings()`.
  - `rendered text survives on <route>`, one per route: `normalize(all text of main+footer joined by ' ')` contains every baseline unit not listed in `allowed-removals.json`.
  - `allowed removals are honest`: every entry has a non-empty `reason`. Every entry whose `text` matches `/\d/` has `preservedAs`, and that `preservedAs` text is present on `/`.
  - Failures must list the missing strings, not just a count.
- [ ] **Step 4:** Capture against the unchanged site. Free port 3200, then run `CAPTURE=1 npx playwright test tests/content/capture.spec.ts --project=desktop`. Expected: `tests/content/baseline/` contains `data.json` plus 1 + 1 + 1 + 4 + 10 = 17 route files. The `home.json` unit count should be > 200; if it isn't, the scroll-to-mount step is not working.
- [ ] **Step 5:** Run `npx playwright test tests/content/no-loss.spec.ts --project=desktop`. Expected: all PASS against the unchanged site. Run it twice to prove it's stable; if typed or animated text makes it flaky, exclude that node by adding `data-content-volatile` to the element and skipping it in `collectRenderedUnits`.
- [ ] **Step 6:** Commit with the message `test: content baselines and no-loss suite before photo journey redesign`.

### Task 2: Pick the photos (Ahmad checkpoint)

**Files:**
- Create: `scripts/journey-photos.json`
- Uses the brainstorm companion at `.superpowers/brainstorm/` (gitignored).

**Interfaces:**
- Produces `scripts/journey-photos.json`: an array of `{ id: PhotoId; source: string; page: string; photographer: string; licence: 'Unsplash' | 'Pexels'; focal: { x: number; y: number }; alt: string }`.
  - `PhotoId = 'opening' | 'chem-e-car' | 'data-science' | 'sports-analytics' | 'research' | 'ai-engineering'`.
  - `focal` is in 0–1 image coordinates, pointing at the thing the camera flies into.

- [ ] **Step 1:** For each of the 6 slots, find 3 candidates that follow spec §7. `curl -s -o /dev/null -w "%{http_code}"` each `images.unsplash.com/photo-…?w=400` URL and keep only 200s. Read the photographer from the photo page's `og:title`.
- [ ] **Step 2:** Push one screen per slot set (`photos-1.html`, with all 6 slots, 3 cards each) to the brainstorm server. Ask Ahmad to pick, and **wait for his answer**.
- [ ] **Step 3:** Write `scripts/journey-photos.json` with his picks, focal points (eyeballed on the full image) and alt text. Commit with the message `chore: journey photo picks`.

### Task 3: Photo pipeline and depth maps

**Files:**
- Create: `scripts/journey-photos.mjs`, `scripts/depth-maps.mjs`, `src/lib/journey-manifest.json` (generated), `public/Images/journey/*` (generated)
- Modify: `package.json` (devDependency `@huggingface/transformers`; scripts `"journey:photos"`, `"journey:depth"`)

**Interfaces:**
- Produces `src/lib/journey-manifest.json`: `Record<PhotoId, { width: number; height: number; webp: Record<'640'|'1280'|'1920'|'2560', string>; avif: Record<same, string>; depth: string; focal: {x,y}; alt: string; credit: { photographer: string; page: string; licence: string } }>`.

- [ ] **Step 1:** `journey-photos.mjs` downloads each `source` at `w=2560` into `scripts/.cache/` (gitignored). It applies one shared grade, starting at `modulate({ saturation: 0.88, brightness: 0.94 }).linear(1.04, -6)`, then emits WebP (q 78) and AVIF (q 55) at 640/1280/1920/2560 (`withoutEnlargement`) and writes the manifest. Run `npm run journey:photos`. Expected: 6 × 8 files, and `opening-1280.webp` ≤ 180 KB. Lower the quality if it's over.
- [ ] **Step 2:** `depth-maps.mjs` uses `pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small')` on each 1280 WebP. It normalizes to 0–255 (near = white), resizes to 1024 wide, applies `blur(1.5)`, writes `public/Images/journey/<id>-depth.webp` (q 85) and sets `depth` in the manifest. Run `npm run journey:depth`. Expected: 6 files, each ≤ 120 KB.
- [ ] **Step 3:** Open the 6 depth maps (Read tool) and confirm the focal subject reads as nearer than the background. Re-pick focal points in `journey-photos.json` if a focal point sits on a depth edge.
- [ ] **Step 4:** Commit with the message `feat: journey photo pipeline, graded photos and depth maps`.

### Task 4: World registry

**Files:**
- Create: `src/lib/data/worlds.ts`, `tests/unit/worlds.spec.ts` (no `page` fixture; runs in the `desktop` project)
- Modify: `src/lib/data/story.ts`, append-only. Export `sentences(body: string): string[]`, which splits on `/(?<=[.!?])\s+(?=[A-Z0-9$"'])/`.

**Interfaces:**
- Consumes `journey-manifest.json`, `storyChapters`, `projects`, `insights`, `fieldNotes`.
- Produces:
```ts
export type WorldId = 'chem-e-car' | 'data-science' | 'sports-analytics' | 'research' | 'ai-engineering';
export type PhotoId = WorldId | 'opening';
export interface World {
  id: WorldId; n: string; label: string; years: string; accent: string; // hex
  title: string; paragraphs: string[]; stat: { value: string; label: string };
  projectSlugs: string[]; photo: PhotoId;
}
export const worlds: World[];                       // journey order
export const opening: { photo: 'opening'; kicker: string; title: string; body: string; stat: { value: string; label: string } };
export const closing: { photo: 'opening'; kicker: string; title: string; body: string; stat: { value: string; label: string } };
export function worldForProject(slug: string): WorldId;          // throws on unknown slug
export function worldForInsight(i: Insight): WorldId;            // via i.source.href slug
export function photoForFieldNote(n: FieldNote): PhotoId;        // category map below
export type ManifestEntry = (typeof manifest)[PhotoId];        // manifest = journey-manifest.json import
export function journeyPhoto(id: PhotoId): ManifestEntry;
```

Exact values, in journey order:

| id | n | label | years | accent | title | paragraphs | stat | projectSlugs |
|---|---|---|---|---|---|---|---|---|
| chem-e-car | 01 | Chem-E Car (AIChE) | 2023–2024 | `#f0823c` | `Chemistry, wired.` | [`sentences(engineering-foundation.body)[1]`] | `{ value: 'Worldwide', label: 'Most Innovative Car Design · AIChE Chem-E Car' }` | camel-car-cheme-car-control-system |
| data-science | 02 | Data Science | 2023–2024 | `#a78bfa` | engineering-foundation `.title` | [`sentences(..)[0]`, `sentences(..)[2]`] | engineering-foundation `.stat` | homeowner-loss-prediction |
| sports-analytics | 03 | Sports Analytics | Now | `#22c55e` | `The game, measured.` | [football-iq `.body`] | football-iq `.stat` | toledo-football-iq-computer-vision-analytics, toledo-athletics-onboarding-portal, champions-complex-digital-campaign |
| research | 04 | Research | 2025 | `#5b8af5` | research-pivot `.title` | [research-pivot `.body`] | research-pivot `.stat` | graph-based-rl-uav-autonomy, deepflyer-drone-reinforcement-learning |
| ai-engineering | 05 | AI Engineering | 2026 | `#38bdf8` | first-solar `.title` | [first-solar `.body`] | first-solar `.stat` | deeptruth-ai-fact-checking, security-discovery-tool, batting-cleanup-smart-city-waste-reporting |

- `opening` uses toledo-origins (`kicker: '2021'` plus its title, body and stat).
- `closing` uses whats-next (its kicker, title, body and stat).
- `photoForFieldNote`: 'Sports Analytics' → sports-analytics, 'AI & Machine Learning' → ai-engineering, 'Career, Research & Learnings' → research, anything else → opening.
- All text comes *by reference* from `storyChapters`, except the two new titles and the chemical stat above.

- [ ] **Step 1:** Write `tests/unit/worlds.spec.ts`:
  - `every project maps to exactly one world`: the union of `projectSlugs` equals `caseStudySlugs` as a set, with no duplicates.
  - `confirmed mapping`: assert the table above.
  - `sports is neither first nor last`: `worlds.findIndex(w => w.id === 'sports-analytics')` ∉ {0, 4}.
  - `every story sentence lands exactly once`: for each chapter, every `sentences(body)` item appears exactly once across `opening.body`, `closing.body` and all `paragraphs`, and `sentences(engineering-foundation.body).length === 3`.
  - `every story stat is shown`: each `storyChapters[].stat` appears as some world, opening or closing stat.
  - `every photo has a credit`: each PhotoId has manifest `credit.photographer` set and a `depth` path.
  - `insights map to the world of their source project`.
- [ ] **Step 2:** Run `npx playwright test tests/unit --project=desktop`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `worlds.ts` and `sentences()` per the interfaces.
- [ ] **Step 4:** Run the same command. Expected: PASS. Also run `npx playwright test tests/content/no-loss.spec.ts -g "data strings"`. Expected: PASS.
- [ ] **Step 5:** Commit with the message `feat: world registry grouping existing content`.

### Task 5: Opening scene and FlyInScene (CSS tier)

**Files:**
- Create: `src/lib/journey/tier.ts`, `src/components/journey/JourneyPhoto.tsx`, `src/components/journey/FlyInScene.tsx`, `src/components/journey/OpeningScene.tsx`, `src/components/sections/about/Headshot.tsx` (HeroPhoto moved out of HeroSection, unchanged), `tests/journey/opening.spec.ts`
- Modify: `src/app/page.tsx` (`HeroSection` → `OpeningScene`), `src/components/sections/about/AboutSection.tsx` (render `<Headshot/>` in the intro column)

**Interfaces:**
- `useJourneyTier(): 'full' | 'lite' | 'still'`. This is a `useSyncExternalStore` hook over media queries; the server returns `'lite'`.
  - `still` if `(prefers-reduced-motion: reduce)`.
  - `full` if `(pointer: fine) and (min-width: 1024px)` and a WebGL2 context can be created (probe once, cache).
  - `lite` otherwise.
- `JourneyPhoto({ id, priority?, className?, style? })`: a `<picture>` with AVIF and WebP `srcSet`s, `sizes="100vw"`, `object-fit: cover` and `object-position` set from `focal`. With `priority`, it adds `fetchPriority="high"` plus a `preload()` like the current headshot.
- `FlyInScene({ id, from?, to, length = 2.5, children, labelledBy })`:
  - Renders a `<div data-scene={id}>` of height `${length * 100}svh`, with a sticky `100svh` stage.
  - Exposes progress `p` ∈ [0, 1] from `useScroll({ target, offset: ['start start', 'end end'] })`.
  - CSS layers use `m.div` and `useTransform` with transform and opacity only:
    - `from` photo: `scale 1 → 3.2` with `transformOrigin` at `from.focal`, over p 0 → 0.55; opacity 1 → 0 over 0.45 → 0.6.
    - `to` photo: opacity 0 → 1 over 0.45 → 0.65; `scale 1.3 → 1` over 0.45 → 0.75. With no `from`, it is visible at p = 0 with scale 1.
    - copy: opacity 0 → 1 and `y 40 → 0` over 0.6 → 0.8. With no `from`, it is visible at 0. A local scrim sits behind the copy block only.
  - In the `still` tier: no sticky stage and height `auto`. It renders a `to` photo block (min-height 100svh) with the copy over it, and `from` is omitted.
  - In the `full` tier: the same, plus it publishes `{ from, to, p }` to the store (Task 8).
  - The photo layers have class `flyin-photo`.
  - Copy sits in a `max-width: 1280px` column with `clamp(20px, 4vw, 52px)` side padding. Copy never overlaps the focal point: it goes on the side of the frame away from `focal.x`.
- `OpeningScene()`: `<section id="hero">` → `FlyInScene({ id: 'opening', to: 'opening', length: 1.6 })`, which shows:
  - TypedTagline, an h1 with Ahmad in teal and Firas, `site.heroSub`, `heroFacts`, and the CTAs.
  - The CTAs are "Start the journey ↓" (`#chem-e-car`), "View Work" (`#chem-e-car`), Resume and Degree, with the existing hrefs and styles.
  - Then `opening.kicker`, `opening.title`, `opening.body` and `opening.stat` as the first scrolled copy block.
  - `JourneyPhoto` with `priority`.

- [ ] **Step 1:** Write `tests/journey/opening.spec.ts`:
  - `opening renders name, facts, ctas`: the h1 text is `Ahmad Firas`; every `heroFacts` value is visible; the links to `site.resumeUrl` and `site.degreeUrl` exist.
  - `opening photo is the LCP image`: `#hero picture img` has `fetchpriority="high"` and a non-empty `srcset`.
  - `headshot lives in About`: `#about button[aria-label="Enlarge photo of Ahmad Firas"]` is visible, and `#hero` has no headshot.
  - `fly-in moves on scroll` (desktop and phone): after scrolling 40% through `[data-scene=opening]`, the copy block's opacity is 1 and the Toledo text is visible.
  - `reduced motion is still` (reduced project): no element under `#hero` has a computed `transform` other than `none` on `.flyin-photo`.
- [ ] **Step 2:** Run `npx playwright test tests/journey/opening.spec.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement `tier.ts`, `JourneyPhoto`, `FlyInScene`, `OpeningScene` and `Headshot`; swap them into `page.tsx`. Delete `HeroScanOverlay` along with HeroSection's use (the file is removed in Task 10).
- [ ] **Step 4:** Run the opening tests plus `tests/content/no-loss.spec.ts`. Expected: PASS. The only allowed removals added are `Scroll to explore` and `Enter the Story ↓`, each with a reason.
- [ ] **Step 5:** Commit with the message `feat: opening scene with fly-in photo, headshot moved to About`.

### Task 6: Five worlds and the closing scene

**Files:**
- Create: `src/components/sections/projects/ProjectModalProvider.tsx`, `src/components/sections/research/ResearchPaper.tsx`, `src/lib/insights-highlight.ts`, `src/components/journey/WorldChapter.tsx`, `src/components/journey/ClosingScene.tsx`, `tests/journey/worlds.spec.ts`
- Modify:
  - `src/app/page.tsx`: replace `StorySection`, `ProjectsSection`, `ResearchSection` and `InsightsSection` with `worlds.map(WorldChapter)` and `ClosingScene`. Wrap the page in `ProjectModalProvider`.
  - `src/lib/data/sections.ts`, append-only for data. The registry order becomes hero, the five world ids, `next-chapter`, field-notes, about, skills, timeline, credentials, signals, now, contact. Each world entry takes its `n`, `label` and `accent` from `worlds`. `nav: true` goes on `chem-e-car`, `field-notes`, `about` and `contact`.
  - `src/components/layout/SiteHeader.tsx`: add optional `navLabel` on `SectionDef`; the header shows `navLabel ?? label`, with `navLabel: 'Journey'` on chem-e-car.
  - `src/components/sections/insights/InsightsSection.tsx`: use `insights-highlight.ts` (the file is removed in Task 10).

**Interfaces:**
- `useProjectModal(): { open(p: Project): void }`. The provider renders one `ProjectDetailModal` with the existing props.
- `highlightInsight(i: Insight): Promise<TokenLine[]>`: the existing shiki logic, moved verbatim.
- `ResearchPaper()`: the ResearchSection body minus its `SH` header, with metrics, the four pillars, the paper button and every string unchanged.
- `WorldChapter({ world, prev }: { world: World; prev: PhotoId })` is an async server component. It renders `<section id={world.id} aria-labelledby={`${world.id}-title`}>`, which contains:
  - `FlyInScene({ id: world.id, from: prev, to: world.photo })` with the mark `` `${n} · ${label} · ${years}` ``, an h2 `title`, `paragraphs`, and `stat`;
  - then a calm content block on `var(--background)`, holding the world's projects as `ProjectPosterCard`s whose `onOpen` calls `useProjectModal().open`;
  - `<FootballIQFeature/>` when the world is sports-analytics;
  - `<ResearchPaper/>` when it is research;
  - the `CodeCard`s for `insights.filter(i => worldForInsight(i) === world.id)`.
  - The `prev` of the first world is `'opening'`.
- `ClosingScene()`: `<section id="next-chapter">` → `FlyInScene({ from: 'ai-engineering', to: 'opening' })` with the `closing` copy.
- Legacy anchors: zero-height `<span id="story">`, `<span id="projects">` and `<span id="insights">` at the top of the first WorldChapter. `research` is already a world id.

- [ ] **Step 1:** Write `tests/journey/worlds.spec.ts`:
  - `five worlds in order`: the `section[id]` order on `/` contains the five ids in registry order.
  - `every project card is reachable`: for each slug, a card is in the section `worldForProject(slug)`; clicking the DeepTruth card opens a dialog containing its title.
  - `play diagram survives`: `#sports-analytics` contains the FootballIQFeature play diagram SVG (add `data-testid="play-diagram"` to its root).
  - `insights land in their worlds`: count CodeCards per world, which must match `worldForInsight`.
  - `legacy anchors resolve`: for each anchor in Review Focus 2, `page.goto('/#'+id)` puts `#id` in the DOM, and after 800 ms its `getBoundingClientRect().top` is within ±120 px of 0.
  - `keyboard focus inside a world is visible`: Tab until the focused element is inside `#research`; every ancestor's computed opacity is 1, and the element's rect is inside the viewport.
  - `header nav has 4 items + Docs`, with labels Journey, Field Notes, About, Contact.
- [ ] **Step 2:** Run `npx playwright test tests/journey/worlds.spec.ts`. Expected: FAIL.
- [ ] **Step 3:** Implement per the interfaces.
- [ ] **Step 4:** Run the worlds and opening specs plus `no-loss`. Expected: PASS.
  - Allowed removals may only be section labels, filter chip labels, old story kickers and the `Football IQ.` story title.
  - Kickers contain years, so they need `preservedAs`: for example, `Chapter 02 · 2023–2024` → `02 · Data Science · 2023–2024`.
- [ ] **Step 5:** Commit with the message `feat: five photo worlds holding projects, research, insights; closing scene`.

### Task 7: About absorbs Capabilities, Timeline, Credentials, Signals

**Files:**
- Modify:
  - `src/components/shared/section-helpers.tsx`: `SH` gains `variant?: 'chapter' | 'sub'`. `sub` renders no ghost numeral and an `h3` label, with a 32 px gap.
  - `SkillsSection.tsx`, `TimelineSection.tsx`, `CredentialsSection.tsx` and `SignalsSection.tsx`: pass `variant="sub"`.
  - `src/app/page.tsx`: order after the closing scene becomes FieldNotes, About, Skills, Timeline, Credentials, Signals, Now, Contact.
  - `AboutSection.tsx`: its internal `#projects` link becomes `#chem-e-car`.
- Test: `tests/journey/about.spec.ts`

**Interfaces:** Section ids stay `about`, `skills`, `timeline`, `credentials` and `signals`.

- [ ] **Step 1:** Write `about.spec.ts`:
  - `constellation survives`: `#skills canvas` is visible on desktop, and the list fallback is present when the canvas can't render (phone project).
  - `about group order`: `#about` comes before `#skills`, then `#timeline`, `#credentials`, `#signals`, `#now` and `#contact`, by `offsetTop`.
  - `every job, award, cert, testimonial is rendered`: each `jobs[].role`, `awards[].title`, `certs[].title` and `testimonials[].name` is found in `main` text.
- [ ] **Step 2:** Run it. Expected: FAIL on order and headings.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `about.spec.ts` plus `no-loss`. Expected: PASS.
- [ ] **Step 5:** Commit with the message `feat: About absorbs capabilities, timeline, credentials, signals`.

### Task 8: Depth canvas (desktop full tier)

**Files:**
- Create: `src/lib/journey/store.ts`, `src/components/journey/JourneyCanvas.tsx`, `tests/journey/depth.spec.ts`
- Modify: `src/app/page.tsx` (mount `<JourneyCanvasLoader/>`, a `dynamic(() => import(...), { ssr: false })` rendered only when `useJourneyTier() === 'full'`), `FlyInScene.tsx` (publish to the store in the full tier), `src/app/globals.css`

**Interfaces:**
- `store.ts`: `setActiveScene(s: { id: string; from?: PhotoId; to: PhotoId; p: number } | null)`, `subscribe(fn)`, `getActiveScene()`. A scene sets itself active while its stage intersects the viewport, and sets null on exit.
- `JourneyCanvas`:
  - Rendering:
    - one fixed full-viewport `<canvas data-journey-canvas aria-hidden>` at z-index 0, with `devicePixelRatio` capped at 1.5;
    - one plane with a `ShaderMaterial` and uniforms `uFrom`, `uTo`, `uFromDepth`, `uToDepth`, `uP`, `uFocalFrom`, `uFocalTo`, `uPointer`, `uCover` (cover-fit UV scale per texture);
    - it draws only when the store or pointer changed (dirty flag), and nothing at all while there is no active scene.
  - Lifecycle:
    - textures load lazily per PhotoId (1920 WebP plus depth) and are cached;
    - after the first frame renders, it sets `document.documentElement.dataset.depth = 'on'`;
    - on `webglcontextlost` or any texture error it removes `data-depth` and stops.
  - Fragment algorithm, which the interface doesn't determine:
```glsl
// zoom toward focal, then parallax by depth; displacement capped at 1.5% of width
vec2 zoomUv(vec2 uv, vec2 f, float z){ return f + (uv - f) / z; }
vec2 par(vec2 uv, float d){ return uv + uPointer * (d - 0.5) * 0.015; }
// from: z = mix(1.0, 3.2, smoothstep(0.0, 0.55, uP)); to: z = mix(1.3, 1.0, smoothstep(0.45, 0.75, uP))
// sample depth at the zoomed uv, apply par(), clamp uv to [0.001, 0.999]
// colour = mix(fromColour, toColour, smoothstep(0.45, 0.65, uP))
```
- CSS: `html[data-depth="on"] .flyin-photo { visibility: hidden; }`. The copy layers stay visible.

- [ ] **Step 1:** Write `depth.spec.ts`:
  - `desktop gets exactly one canvas`: there is 1 `[data-journey-canvas]` and `html[data-depth=on]` within 5 s.
  - `canvas draws the photo`: scroll into `#data-science`, read the canvas center pixel via `toDataURL`, and require it to be non-black. Use `preserveDrawingBuffer` only when `?testcanvas` is present.
  - `phone and reduced get no canvas`: 0 `[data-journey-canvas]`, and `.flyin-photo` is visible.
  - `canvas failure falls back to css photos`: `page.route('**/*-depth.webp', r => r.abort())`. Then `html` lacks `data-depth`, `.flyin-photo` is visible, and there are no `console.error`s.
  - `resize desktop to phone mid-journey`: start at 1440, scroll to `#research`, then resize to 390×844. After that, `document.documentElement.scrollWidth <= 390`, and the `#research` heading is visible.
  - `no console errors on full scroll`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `depth.spec.ts` and all `tests/journey`. Expected: PASS. Then take a Chrome Performance trace while scrolling `/` top to bottom with 4× CPU throttle (Playwright `CDP Emulation.setCPUThrottlingRate`, `tracing.start`). Expected: no task over 50 ms during scroll. Record the worst frame in the commit body.
- [ ] **Step 5:** Commit with the message `feat: desktop depth canvas for journey photos`.

### Task 9: Inside pages: photo backdrop, back links, credits

**Files:**
- Create: `src/components/journey/PhotoBackdrop.tsx`, `src/components/journey/CaseStudyBackdrop.tsx`, `tests/journey/inside.spec.ts`
- Modify:
  - `src/app/case-study/layout.tsx`: render `<CaseStudyBackdrop/>`.
  - All 10 `src/app/case-study/*/page.tsx`: the root wrapper `background` becomes `transparent`. `backHref="/#projects"` becomes `` `/#${worldForProject('<slug>')}` ``, and `backLabel` becomes that world's `label`.
  - `src/app/field-notes/page.tsx`, `src/app/field-notes/[slug]/page.tsx` and `src/app/docs/page.tsx`: add `PhotoBackdrop` and use a transparent root background.
  - `src/components/layout/SiteFooter.tsx`: add a `Photos:` credit line listing each photographer with a link to the photo page, in mono 11 px `var(--text3)`.

**Interfaces:**
- `PhotoBackdrop({ id }: { id: PhotoId })` (client):
  - A fixed `JourneyPhoto` at z-index 0 with a scrim `linear-gradient(to bottom, rgba(13,14,18,.55), rgba(13,14,18,.86) 70%, #0d0e12)`.
  - Over the first 100svh of `window` scroll: scale 1 → 1.8 about focal and opacity 1 → 0, CSS only, in every tier. In the `still` tier it is static, with opacity 0.35.
  - Page content sits in `position: relative; z-index: 1`.
- `CaseStudyBackdrop()`: `usePathname()` → slug → `worldForProject` → `PhotoBackdrop`.
- Field notes: `photoForFieldNote(note)`. The field-notes index and docs use `'opening'`.

- [ ] **Step 1:** Write `inside.spec.ts`:
  - `case study opens on its world photo`: on `/case-study/camel-car-cheme-car-control-system`, the backdrop img `currentSrc` contains `chem-e-car`.
  - `field note photo by category`: `/field-notes/battle-of-i75-coin-toss` uses `sports-analytics`, and `/field-notes/agentic-ai-in-production` uses `ai-engineering`.
  - `back from case study restores world`: go to `/`, scroll to `#research`, click the DeepFlyer card's case-study link from the modal, then click SubpageHeader back. Expected: `#research` is in the viewport and its title is visible (opacity 1).
  - `reading text has contrast`: the axe color-contrast rule passes on the case study and field note hero areas.
  - `footer credits every photo`: the footer contains each manifest `credit.photographer`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run `inside.spec.ts` plus `no-loss`. Expected: PASS. Every case-study and field-note route baseline must hold, and the "Projects" back label is an allowed removal with `preservedAs` set to the world label.
- [ ] **Step 5:** Commit with the message `feat: photo backdrops on inside pages, world back links, photo credits`.

### Task 10: Clean-up, docs, full verification, preview

**Files:**
- Delete:
  - `src/components/sections/story/*`
  - `src/components/sections/hero/HeroSection.tsx` (keep `TypedTagline.tsx`)
  - `src/components/sections/projects/ProjectsSection.tsx`
  - `src/components/sections/research/ResearchSection.tsx`
  - `src/components/sections/insights/InsightsSection.tsx`
  - only after confirming nothing imports them (`npx tsc --noEmit`)
  - Data files stay untouched.
- Modify: `DESIGN.md`, covering the creative north star (a photo journey across five equal worlds), the photo rules, the fly-in and tier rules, and the removal of Story/scan-line references. Also `globals.css` (remove the now-unused story and scan rules).
- Create: `tests/journey/matrix.spec.ts`, `scripts/lighthouse-check.mjs`

- [ ] **Step 1:** Write `matrix.spec.ts`:
  - `no horizontal overflow`: every route in `ROUTES` × the 8 widths, after scrolling to the bottom, has `scrollWidth <= innerWidth`.
  - `axe clean`: on `/`, one case study, one field note, `/field-notes` and `/docs`, `AxeBuilder` finds no `serious` or `critical` violations. Decorative `aria-hidden` ghost numerals are excluded.
- [ ] **Step 2:** `lighthouse-check.mjs` runs `npx lighthouse@12.6.0` 3× on `http://localhost:3200/` for mobile (default) and desktop (`--preset=desktop`). It prints the medians and exits 1 if mobile perf < 73 or desktop perf < 99.
- [ ] **Step 3:** Delete the dead files and run `npx tsc --noEmit && npm run lint`. Expected: 0 errors.
- [ ] **Step 4:** Free port 3200 and run `npx playwright test` (all projects), then `node scripts/lighthouse-check.mjs`. Expected: everything PASSES and Lighthouse is at or above the thresholds. If mobile perf is under 73, check the opening photo bytes and the preload first.
- [ ] **Step 5:** Update DESIGN.md and commit with the message `chore: remove replaced sections, update DESIGN.md, verification suite`.
- [ ] **Step 6:** **Ask Ahmad before pushing.** On his OK, push `redesign/photo-journey` and open a **draft** PR titled `Photo journey redesign`. The body lists the allowed-removals file contents verbatim, so he can see that every removed string is a label, plus the Lighthouse medians and the Vercel preview URL. Do not merge.
