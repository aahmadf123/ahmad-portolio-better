---
name: Ahmad Firas Portfolio
description: "Uncertain Paths" - a quiet, typographic portfolio on warm paper (with a night theme), introduced by one looping flight path that links the three kinds of work. Tokens live in src/styles/theme.css; this doc mirrors them.
colors:
  # Paper (light, default)
  background: "#f3f2ee"
  surface-1: "#eae8e3"
  surface-2: "#e1dfd9"
  foreground: "#1c1d1f"
  text-secondary: "#4b4e53"
  text-tertiary: "#63666b"
  border-default: "rgba(28,29,31,0.12)"
  border-elevated: "rgba(28,29,31,0.22)"
  path: "rgba(28,29,31,0.24)"
  primary: "#0f766e"       # teal as text (links, focus ring)
  primary-fill: "#14b8a6"  # teal as a marker (the travelling dot, active nodes)
  # Night ([data-theme="dark"])
  night-background: "#121314"
  night-foreground: "#ecebe6"
  night-primary: "#2dd4bf"
typography:
  family: "DM Sans (variable) for everything a reader reads; JetBrains Mono for code only; Caveat for the sign-off only"
  hero: "clamp(40px, 4.6vw, 88px) / 1.08, weight 400, -0.03em"
  section-title: "clamp(40px, 5vw, 72px) / 1, weight 400, -0.03em"
  row-title: "20-24px, weight 400, -0.015em"
  body: "17px / 1.6"
  label: "14-15px, sentence case, --text2 or --text3, normal tracking"
rounded:
  default: "3px"
---

# Design System: Ahmad Firas Portfolio

Tokens live in `src/styles/theme.css` (exposed to Tailwind through `@theme inline` in `src/app/globals.css`). When the two disagree, `theme.css` wins and this file gets fixed.

## 1. Overview

**Concept: "Uncertain Paths."** A quiet introduction traced by a looping flight path, connecting Ahmad's AI, UAV research and sports analytics work without crowding the page. The site should read like a well-set document, not a template: one typeface, lots of paper, hairlines instead of boxes, real evidence (screens, photos, numbers) instead of decoration.

**Page structure**
- **Home (`/`)** holds everything, in order: `FlightPathHero` → `AboutBrief` (name, role, facts, now building) → `FeaturedWork` → `WorkIndex` (all ten projects, grouped by path) → `Background` ("Experience and background": Toledo prologue, the five worlds with their photographs, galleries, research paper and code insights, the next chapter) → `FieldNotesSection` → `AboutSection` → Capabilities, Timeline, Credentials, Signals, Now → `ContactSection`.
- Details are shown, not hidden: every job's description, achievements and stack, award and affiliation photos, coursework.
- `/about` redirects to `/#about`. Old anchors (`/#research`, `/#timeline`, …) resolve on the homepage.
- **Inside pages** (`/projects`, case studies, field notes, docs) share `SiteHeader` (sticky, with a back link) and `SiteFooter`.

**The flight path** (`src/components/home/FlightPathHero.tsx`): one hand-authored SVG path in a 1440×900 box, stretched to the viewport with `preserveAspectRatio="none"` and a 1px non-scaling stroke. The three nodes (Agentic AI, UAV Research, Sports Analytics) are vertices of the path; their labels are real links to the matching group in the work index. The line draws itself once (1.6s), then a small teal dash travels the path (28s per pass) and lights the node it passes. Paused off-screen and in background tabs; static under reduced motion. On narrow screens the line stays as background and the nodes become a short list under the words.

**What it rejects:** gradients, glows, glassmorphism, drop shadows on content, boxed stat cards, pill-tag clouds, ghost numerals, uppercase tracked mono labels, typing effects, flip cards, 3D, custom cursors, scroll-jacking or smooth-scroll libraries, emoji as icons. Motion is allowed where it reveals content or responds to the reader (§5), never as ambient decoration.

## 2. Colour

| Token | Paper | Night | Use |
|---|---|---|---|
| `--background` | `#f3f2ee` | `#121314` | Page. |
| `--surface` / `--surface-2` | `#eae8e3` / `#e1dfd9` | `#1a1b1d` / `#232427` | Image wells, rare panels. |
| `--foreground` | `#1c1d1f` | `#ecebe6` | Headings, primary text, the strong rule under group headings. |
| `--text2` | `#4b4e53` | `#b0b1ad` | Body copy, labels. |
| `--text3` | `#63666b` | `#94958f` | Metadata. ≥4.5:1 on every surface. |
| `--bd` / `--bd2` | ink at 12% / 22% | 10% / 20% | Hairlines at rest / emphasis. |
| `--path` | ink at 24% | 26% | The flight path. |
| `--primary` | `#0f766e` | `#2dd4bf` | Teal as text, focus ring. |
| `--primary-fill` | `#14b8a6` | `#2dd4bf` | Teal as a marker (dot, active node). |

**Theme switching.** An inline script in `<head>` (`THEME_SCRIPT` in `src/components/ui/theme-toggle.tsx`) sets `data-theme` before first paint from `localStorage.theme`, else `prefers-color-scheme`. `ThemeToggle` in the header flips it and stores the choice.

**Project accents** stay hex in the data files (`projects.ts`, `worlds.ts`, …) and are used as **markers only**: a 6px dot, a 1px rule. When an accent must be text, use `accentInk(hex)` from `src/lib/accent.ts` (mixes toward the ink by `--accent-mix`: 40% on paper, 72% at night). Older pages that still set an accent hex as an inline `color`, or as a filled button behind paper-coloured text, are remapped to a darker ink of the same hue on paper by the block at the end of `globals.css` (each ≥4.6:1).

**Code** always sits on its own dark panel (`#16171a`) in both themes, because the highlighter palette is dark.

## 3. Typography

- **DM Sans** (`--font-body`, and `--font-display` points at it) for all reading text. Weights 400 and 500 only. Big type is 400 with negative tracking; never bold a headline.
- **JetBrains Mono** (`--font-code`) for `code`/`pre` only. Never for labels.
- **Caveat** (`--font-hand`) for the About sign-off only.
- Labels are sentence case, 14-15px, in `--text2`/`--text3`. Numbers in lists and stats use `.tnum` (tabular figures).
- The legacy `SERIF` and `MONO` constants in `section-helpers.tsx` resolve to DM Sans so older components follow; `CODE` is the real monospace.

## 4. Layout and components

- **`.wrap`**: max 1240px, side gutter `clamp(16px, 4vw, 56px)`.
- **Section heads**: a large 400-weight title on the left, a one-sentence lede and a text link on the right (`.wi-head`, `.fn-head`). Inside /about, `SH` renders a 6px dot and a sentence-case title.
- **Lists over cards**: projects, notes, jobs, awards, certifications and skills are rows separated by hairlines, with a 1px `--foreground` rule under each group heading.
- **Links**: plain text with an arrow (`→` stays on the site, `↗` leaves it, `↓` downloads). `.text-link` draws an underline on hover; `.is-underlined` shows a quiet one at rest.
- **Featured spreads** (`FeaturedWork`): words in 5 columns, real output in 7 (alternating). Drawings that are not real output carry the "Illustrative example" chip.
- **Header** (`SiteHeader`): logo + name left; Work, Notes, About, Contact, theme switch right; "Menu" disclosure under 720px. Sticky with a hairline on inside pages, in-flow on the homepage.
- **Chat**: "Ask Ahmad" is a small bordered text button bottom-right, hidden while the homepage hero is on screen.
- **Focus**: one 2px `--primary` `:focus-visible` ring, offset 3px.

## 5. Motion

- **Hero:** the path draws itself (1.6s), the headline and line rise in, a teal dash travels the path and lights each node; nodes nudge on hover; "Explore the work" leans toward the pointer.
- **Scroll reveals:** `RevealObserver` adds `.in` once per element. `.rv` rises 24px, `.rv-left`/`.rv-right` slide 32px, `.rv-fade` settles from 97%, `.rv-pop` pops; stagger with `style={{ '--i': n }}` (70ms steps). `.rv-photo` uncovers a photo with a curtain that retracts upward; `.draw-rule` draws a short rule under big section titles.
- **Numbers:** `CountUp` (`src/components/ui/count-up.tsx`) counts a stat up once when it enters view; the real value is server-rendered.
- **Timeline:** its vertical line fills as you scroll (CSS scroll-driven animation); the newest entry's dot is teal.
- **Parallax:** chapter photos drift ±24px against the scroll (`.parallax`, CSS `view()` timeline, compositor only).
- **Hover (mirrored on focus):** project and note rows tint and indent, titles get a drawn underline, arrows slide, images zoom 4% (`.lift-img`), skills nudge; the contact email is magnetic (`MagneticLink`, fine pointers only); the skills marquee drifts and pauses on hover.
- **Reduced motion** turns all of it off (global kill-switch in `globals.css`; reveals start visible; the hero dot sits still on "Agentic AI"; count-ups show the final value).
- Page transitions are a plain crossfade (React `ViewTransition`).

## 6. Do's and don'ts

**Do**
- Move content, never drop it: `tests/content/` snapshots every string and picture; everything that was on the homepage must render on it. Labels that genuinely go away are listed with reasons in `allowed-removals.json`.
- Check layouts at 320, 768, 1280 and 2560px, in both themes, with no horizontal overflow (`tests/site/matrix.spec.ts` runs axe on both themes).
- Keep accents as markers; use `accentInk()` for accent text.

**Don't**
- Add a second typeface, a gradient, a shadow on content, or a boxed stat grid.
- Use mono or uppercase for labels.
- Hide content behind hover without a touch equivalent.
- Add new colours without updating `theme.css` and this file.
