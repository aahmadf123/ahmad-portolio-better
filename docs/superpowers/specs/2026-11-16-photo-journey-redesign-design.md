# Photo Journey Redesign: Design

**Site:** ahmadfx.xyz (Next.js 16 App Router, this repo)
**Date:** 2026-11-16
**Status:** awaiting Ahmad's approval

## 1. Intent

A visitor (a recruiter, an engineer, someone clicking through from a Twitter or LinkedIn post) should land on the site and think *"this is unlike any portfolio I've seen, and I want to know more about this person."* The one thing they should leave with is **range**: Ahmad knows a lot, is creative, and adapts across very different fields.

Today the site is well built but reads as a polished dark portfolio. This redesign replaces the homepage's look and flow with a **scroll journey through real photographs**, one world per side of Ahmad, while keeping every piece of information already on the site.

## 2. What Ahmad asked for (his decisions)

- **Real photographs, not illustrations, AI images, or 3D built in code.** The previous redesign (stash@{0}, three.js scenes) "looked so fake". That is the main thing this design must avoid.
- **Free professional stock photos of real places are fine**, and preferred. Ahmad has no personal photos that fit the role of a scene.
- **Depth:** each photo should feel like you could reach into it, with foreground, middle and background separated.
- **"Fly in" transition (mockup A, chosen over the framed "step through" B):** the photo fills the screen; scrolling pushes the camera toward a point in the photo, Ahmad's name and copy drift past at a closer depth, and you come out the other side into the next photo, which is the next chapter.
- **Five worlds, equally weighted:** AI engineering, data science, chemical engineering, research, sports analytics. **Football and sports must not dominate.** It's one fifth of the journey, and nothing about the opening or ending should read as "the sports guy".
- **Homepage structure:** opening photo with his name → five world chapters, each holding that world's projects → field notes, about, contact.
- **Inside pages** (case studies, field notes, docs) open with a real photo from their world and the same fly-in. The reading part below stays calm and readable.
- **Headshot goes in About**, not the opening scene.
- **Chem-E Car, kept modest (Ahmad, 2026-11-16):** his degree is Computer Engineering; he was part of the AIChE Chem-E Car team (built its Arduino control system). The world is labelled "Chem-E Car (AIChE)", framed as that control-system work, and is the shortest chapter.
- **Sports photo is the Glass Bowl (Toledo Rockets)** and all football imagery is American college football, never soccer.
- **Must keep:** the Football IQ play diagram and the skills constellation.
- **No information loss.** "I have a lot of info about my life there." Every fact, number, date, project, job, award, cert, affiliation, testimonial, press item, insight and link on the current site must exist somewhere in the new one.
- **Whole site may look different.** Not limited to small polish.

## 3. Goals, non-goals, anti-goals

**Goals**
- A homepage that is memorable within the first 3 seconds, and makes people scroll.
- Five worlds of equal presence; the visitor comes away with range.
- Every current piece of content preserved (see §6, Content map).
- Feels smooth on a mid-range phone and a desktop alike.

**Non-goals**
- New content or rewriting Ahmad's copy. Text is moved and regrouped, not reworded, except for short headings and labels the new structure needs.
- Changing the field note MDX content, the chat assistant, analytics, or the case-study body text.
- A light theme.

**Anti-goals (failure even if it "works")**
- Anything that looks fake: CGI-looking depth, obvious AI imagery, effects that are clearly there to show off rather than to carry the story.
- One world dominating: sports-first photo order, a football as the opening image, more space for one world's projects than its content justifies.
- Lost content: a visitor who knew the old site can't find something.
- Motion sickness or jank: stutter while scrolling, a phone that heats up, no way to opt out of motion.
- Text placed over busy, moving photos where it becomes hard to read.

## 4. Constraints

- **Stack stays:** Next.js 16.2 (read `node_modules/next/dist/docs/` before writing code; this version has breaking changes), React 19, framer-motion, GSAP + ScrollTrigger, and three.js are already installed. No new heavyweight framework.
- **Repo rules in memory:** accent colours in JS stay hex (they're alpha-concatenated and read by canvas); Next 16 doesn't restore scroll on back(), so keep the manual RouteTracker/SmartBackLink restore working.
- **Recent work must not regress:** the 5-phase review merged today (PRs #13–#17): the perf budget (Lighthouse mobile home ≥ 73, desktop ≥ 99), zero horizontal overflow at 320–2560px, axe with no serious or critical issues, `:focus-visible` ring, skip link to `#main`, the safe-area insets, the SubpageHeader on every subpage, the CaseStudyPager, and the reduced-motion handling.
- **Photo licensing:** Unsplash (or Pexels) license only; record each photo's source URL and photographer in a credits file and a small "Photo credits" line in the footer. Self-host optimized copies (AVIF/WebP at several widths) in `public/Images/journey/`; never hot-link.
- **Ships on a branch** (`redesign/photo-journey`) with a Vercel preview. **Nothing merges to `main` without Ahmad's explicit OK.**

## 5. The experience

### 5.1 Homepage flow
1. **Opening scene:** a neutral, real photo that belongs to *no single world*. The proposed photo ties to his actual story ("Toledo, Ohio. Where it started."): Toledo at dusk, or a similar city or campus scene. Ahmad's name, the typed tagline, the hero intro text, the hero facts (role, location, availability) and the CTAs (Resume, Degree, start the journey) sit in front of it, at a closer depth.
2. **Five world chapters**, each one a full-screen photo with real depth. Each chapter has:
   - a chapter mark (number and world name), a heading, and the story text for that world (moved from the current Story chapters, §6);
   - that world's key stat;
   - its projects as cards (the current poster cards and modal behaviour, regrouped by world);
   - the world's special piece where one exists: the **Football IQ play diagram** in sports analytics, the research paper block (metrics plus the four-pillar taxonomy) in research.
   The fly-in carries you from the end of one chapter into the next photo.
3. **After the journey** (a calmer, standard-scroll zone): Field Notes → About (expanded, §6) → Now → Contact. The **skills constellation** lives in About as "Capabilities".

### 5.2 The fly-in (the signature effect)
- Photo fills the viewport. Scroll progress drives a camera push toward a **focal point chosen per photo** (e.g. stadium lights, a reactor valve, a server rack's LED), scaling roughly ×3 over the chapter's exit.
- Copy layers move faster than the photo (they're "closer"), drift up and out, then the next photo fades and settles in from slightly over-scaled to 1×.
- **Real depth:** each photo gets a depth map generated offline (Depth Anything V2 or similar, run once at build-prep time and committed as a greyscale PNG next to the photo). A single WebGL plane (three.js, already a dependency) displaces the photo by its depth map, giving true parallax on mouse move (desktop), on device tilt (only if it's cheap and permission-free; otherwise skip), and during the scroll push. Edges should not tear; keep displacement subtle. **If it looks fake, turn it down.**
- Copy readability: a local scrim behind text blocks (not a full-screen darkening), and text never sits over the focal point.

### 5.3 Device tiers
- **Desktop / laptop (fine pointer, ≥1024px):** full effect, with WebGL depth plus scroll-driven fly-in (GSAP ScrollTrigger scrub).
- **Tablets and phones:** the same fly-in, but with transform-only layers (photo, scrim, copy), no WebGL, and 1–2 depth layers at most. Chapters are not pinned for long; the cards scroll normally inside each world.
- **`prefers-reduced-motion`:** no camera push or parallax; each world is a still photo with a crossfade between chapters. All content is identical.
- **Ultrawide:** photos use `object-fit: cover` and focal points stay in frame; copy stays in the 1280px column.

### 5.4 Inside pages
- **Case studies:** a photo header from that study's world with a short fly-in into the content (≈1 screen of scroll). Below it, the existing case-study layout, debrief stats, sticky section nav and CaseStudyPager stay as they are.
- **Field notes:** the index and each note open with a photo from the note's world (the Battle of I-75 note gets sports; the agentic-AI note gets AI engineering). The article body stays the current readable layout.
- **Docs:** a neutral photo header (same family as the opening scene).
- SubpageHeader stays.

### 5.5 Look
- Dark theme and the three current type families (Instrument Serif display, Figtree body, JetBrains Mono labels) carry over. Each world gets one accent, reused for its chapter mark, cards and case-study pages.
- Photos are colour-graded consistently (a slight shared tone curve) so five stock photos feel like one set, not a collage.

## 6. Content map: nothing gets lost

Every current homepage section and data file, and where it goes. **The builder must produce a checklist from `src/lib/data/*.ts` plus any copy hard-coded in `src/components/sections/**` and tick every item off on the preview.**

| Today | New home |
|---|---|
| Hero (`site.ts`: name, tagline segments, hero intro, `heroFacts`, resume and degree links, headshot) | Opening scene; **headshot moves to About** (Ahmad confirmed; a cut-out portrait over a stock photo would read as fake) |
| Story (`story.ts`, 6 chapters, each with body and stat) | Bodies split across the opening (Toledo), the five worlds and the close ("The next chapter" → just before Now/Contact). Every sentence and stat is kept. |
| About (`about.ts` lenses, `education.ts`, sign-off) | About |
| Capabilities (`skills.ts`, constellation, legend, detail card, list fallback) | About → Capabilities, **constellation kept** |
| Timeline (`jobs.ts`, education, awards) | About → Timeline (all 7 jobs, education, awards) |
| Work (`projects.ts`: 10 case studies plus other kinds, modal, poster cards) | Split into the five worlds (mapping below) |
| Football IQ feature plus **play diagram** | Sports analytics world, **kept** |
| Research (`research.ts`: metrics, 4-pillar taxonomy, paper link) | Research world |
| Credentials (`certs.ts`, `awards.ts`, `affiliations.ts`, flip cards) | About → Credentials (awards may also appear as a chapter stat in their world) |
| Field Notes | Own section after the journey |
| Signals (`press.ts`, `testimonials.ts`) | About → "What others say" |
| Insights (`insights.ts`, 5 code cards, each sourced from a project) | Each insight moves into the world of its source project |
| Now (`now.ts`) | Own section after the journey |
| Contact | Contact |
| Easter egg, chat, chapter rail | Kept; the chapter rail lists the new chapters |

**Project → world mapping (confirmed by Ahmad):**
- **AI engineering:** DeepTruth, Security Discovery Tool, Batting Cleanup; First Solar (Developer I, Microsoft Solution Developer) from the story.
- **Data science:** Homeowner Loss Prediction (Grange, senior design); Park Place data governance (Database Engineer co-op).
- **Chemical engineering:** Camel Car (ChemE car control system); AIChE awards (Most Innovative Car Design, poster and presentation, regional).
- **Research:** Graph-Based RL for UAV Autonomy, DeepFlyer, the AI-failure taxonomy paper, the USRCAP fellowship.
- **Sports analytics:** Toledo Football IQ (plus play diagram), Toledo Athletics Onboarding Portal, Champions Complex Digital Campaign, the Battle of I-75 field note.

## 7. Photo brief (builder sources; Ahmad approves the set)

One photo per world plus the opening, with a focal point to fly into. Real places, no people's faces as the subject, nothing that reads as stock-cliché (no handshake, no "hacker in hoodie").
- **Opening:** Toledo (or a Midwest city or campus) at dusk.
- **AI engineering:** a data-centre aisle or server racks with indicator lights.
- **Data science:** a dense real-world pattern that reads as "data", e.g. a city grid at night from above, or an operations floor.
- **Chemical engineering:** a lab bench, glassware, or a pilot plant with pipes and valves.
- **Research:** a drone in flight or a lab or observatory scene (ties to the UAV work).
- **Sports analytics:** a stadium under lights, shot wide. It must not be a football close-up.

The builder presents 2–3 candidates per slot in the brainstorm browser for Ahmad to pick before any code depends on them.

## 8. Success checks
- Ahmad looks at the preview and says it feels real, not fake, and like him.
- Content checklist (§6) is 100% ticked.
- No regression against §4: Lighthouse mobile home ≥ 73 (target higher) and desktop ≥ 99; zero overflow; axe clean; works with reduced motion and keyboard only.
- Smooth: no long frames > 50 ms while scrolling the journey under 4× CPU throttle; WebGL is off on phones.

## 9. Left to the builder
- Exact chapter order, provided sports is neither first nor last. *Claude's call, adjustable:* chemical engineering → data science → sports analytics → research → AI engineering, then "the next chapter" closes. That roughly follows his path (the ChemE car and the Park Place co-op were early; First Solar is now) and keeps sports in the middle.
- Case studies and field notes reuse their world's photo, cropped or focused differently, rather than needing 10+ new photos. *(Claude's call.)*
- Projects that aren't case studies (PDF, GitHub, video and external kinds) go into whichever world their subject belongs to, using the same rule as the mapping above. *(Claude's call.)*
- The depth-map tool and shader details, focal points, scroll lengths, easing.
- How project cards sit within a world (grid vs. horizontal rail) as long as all projects are reachable and the modal still works.
- Card, typography and spacing details within the existing design tokens; DESIGN.md is updated to match.
- Whether Credentials, Timeline and Signals become tabs or stacked subsections inside About.
