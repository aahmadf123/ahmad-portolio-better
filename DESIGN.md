---
name: Ahmad Firas Portfolio
description: Cinematic, scroll-driven dark portfolio - a documentary-style journey for an agentic AI engineer. Tokens live in src/styles/theme.css; this doc mirrors them.
colors:
  # ── Structural palette ──
  background: "#0d0e12"
  foreground: "#f4f4f2"
  surface-1: "#13151b"
  surface-2: "#1a1d25"
  text-secondary: "#a3a8b0"
  text-tertiary: "#80858e"
  border-default: "rgba(244,244,242,0.08)"
  border-elevated: "rgba(244,244,242,0.16)"
  # ── Primary identity accent (teal) + gold for milestones ──
  primary: "#2dd4bf"
  gold: "#e5c453"
  # ── Project-aesthetic accents (original six) ──
  blue: "#5b8af5"
  teal: "#2dd4bf"
  rose: "#fb7185"
  purple: "#A78BFA"
  pink: "#F472B6"
  # ── Project-specific extension accents ──
  red: "#EF4444"
  green: "#22C55E"
  sky: "#38bdf8"
typography:
  display:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "clamp(7rem, 15vw, 12rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  hero-name:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "clamp(56px, 10vw, 132px)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  section-ghost:
    fontFamily: "var(--font-display), Georgia, serif"
    fontSize: "clamp(72px, 11vw, 160px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "var(--font-body), system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-body), system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "var(--font-code), monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  label-legacy:
    fontFamily: "var(--font-code), monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  label-sm:
    fontFamily: "var(--font-code), monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.12em"
  metadata:
    fontFamily: "var(--font-code), monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.06em"
rounded:
  xs: "4px"
  sm: "5px"
  md: "6px"
  lg: "8px"
  xl: "10px"
spacing:
  card-pad: "22px 26px"
  inner-gap: "16px"
  section-gap: "52px"
  section-v: "clamp(64px, 8vw, 100px)"
  section-h: "clamp(20px, 4vw, 52px)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "11px 22px"
    typography: "{typography.label}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-tertiary}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
    typography: "{typography.label-sm}"
  tag:
    backgroundColor: "{colors.primary}14"
    textColor: "{colors.primary}"
    rounded: "{rounded.xs}"
    padding: "4px 9px"
    typography: "{typography.label}"
  chip:
    backgroundColor: "rgba(244,244,242,0.03)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.xs}"
    padding: "4px 9px"
    typography: "{typography.label}"
  card-expandable:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
---

# Design System: Ahmad Firas Portfolio

Tokens live in `src/styles/theme.css` (exposed to Tailwind through `@theme inline` in `src/app/globals.css`). This document describes how they are used. When the two disagree, `theme.css` wins and this file gets fixed.

## 1. Overview

**Creative north star: "A journey through real places."** Built so a recruiter, an engineer or someone clicking through from a post thinks *this is unlike any portfolio I've seen, and I want to know this person*. What they should leave with is range. The homepage is a scroll journey through real photographs, one per side of Ahmad, in equal measure: the Chem-E Car team, data science, sports analytics (college football, Toledo), research, AI engineering. Dark is the only theme. Everything stays evidence-first: chapters are numbered, case studies are numbered case files, and decoration has to carry signal.

**What makes it this site and not a template:**
- The fly-in: each world is a full-screen real photo; scrolling pushes the camera toward a point in it and out the other side into the next world (`src/components/journey/FlyInScene.tsx`).
- Real depth on desktop: a depth map per photo drives parallax on a single WebGL2 canvas (`JourneyCanvas`), with the CSS photo as the fallback everywhere.
- The world registry (`src/lib/data/worlds.ts`) groups the existing content by world *by reference*, and the chapter registry (`sections.ts`) drives header colours and the left chapter rail.
- **Page order:** the hero, then the two featured projects (Toledo Football IQ, Homeowner Loss Prediction; `FeaturedWork`), then **Experience and background**: the Toledo prologue, the five worlds and "The next chapter", then the calmer sections. The hero and the prologue are ordinary blocks in the page flow, never pinned or layered over each other.
- The Football IQ play diagram, the skills constellation, the kinetic timeline.
- Letterbox "film-strip" page transitions; the handwritten sign-off.

**What it rejects:** anything that looks fake (CGI depth, AI-generated images, illustrations standing in for places), one world dominating (football is one fifth of the story and never the opener), gradient text, glassmorphism as decoration, boxed "big number" stat dashboards, gradient-mesh glows, macOS window dots, anything that would survive unchanged in someone else's dark portfolio.

## 1b. Photos

- **Real photographs of real places only.** Free licences (Unsplash License, or Wikimedia Commons CC BY / BY-SA / public domain), self-hosted in `public/Images/journey/`, every one credited (photographer and licence link) in the footer. Sports imagery is American college football, never soccer; the sports world uses the Glass Bowl.
- **One set.** `scripts/journey-photos.mjs` grades every photo with the same tone curve and writes AVIF/WebP at up to four widths plus `src/lib/journey-manifest.json`; `scripts/depth-maps.mjs` adds a depth map (Depth Anything V2, near = white). Each photo has a focal point the camera flies into; copy sits on the opposite side over a photographic side shade, never over the focal point.
- **Panoramas** (wider than 2.2:1, e.g. the Glass Bowl) are shown whole over a blurred copy of themselves, never wider than their real pixel size and never zoomed.
- **Resolution:** stock photos ship up to 3840px; the depth canvas picks the texture that covers the screen at the 1.3× settle zoom (`textureWidth`). Ahmad's own photos (the Chem-E Car world) ship at their real size and are not credited in the footer.
- **Inside pages** open on their world's photo (`PhotoBackdrop`), which fades as the reader scrolls into the text.

## 2. Colour

### Structure
| Token | Value | Use |
|---|---|---|
| `--background` | `#0d0e12` | Page. The darkest value in the system; nothing uses `#000`. |
| `--surface` / `--surface-2` | `#13151b` / `#1a1d25` | Card interiors, panels, inputs. |
| `--foreground` | `#f4f4f2` | Headings, primary text. The lightest value; nothing uses `#fff`. |
| `--text2` | `#a3a8b0` | Body copy (8:1). |
| `--text3` | `#80858e` | Metadata, labels. At least 4.5:1 on background and both surfaces; don't dim readable text further with opacity. |
| `--bd` / `--bd2` | foreground at 8% / 16% | Borders at rest / on hover or emphasis. |

### Accents
- **Primary teal `#2dd4bf`:** system chrome: primary CTAs, focus ring, scroll bar, chapter rail, the logo dot.
- **Gold `#e5c453`:** milestones and highlights (timeline bursts, the scroll bar's far end). A soft gold, used sparingly.
- **No orange anywhere.** The one exception is Bowling Green's orange `#f0823c`, used only to label BG in the Battle of I-75 field note.
- **Project and section accents:** blue `#5b8af5`, rose `#fb7185`, purple `#a78bfa`, pink `#f472b6`, sky `#38bdf8`, red `#ef4444`, green `#22c55e`. Each project and section owns one and uses it consistently (tags, borders, its debrief stats, its pager card).

### Rules
- **Tints, not fills.** Accents sit on surfaces at 3-10% and on borders at 20-35%. Solid accent fills only on buttons, and buttons carry dark text (`--background`), never white: white on blue or red fails contrast.
- **Hex in JS.** Accent colours passed through JS stay hex literals. Many components derive alpha by appending (`${c}33`), and canvas/Three.js can't read `var()`. For derived opacity in CSS use `color-mix(in srgb, var(--x) N%, transparent)`.
- **New colours go into `theme.css` and this file first.**

## 3. Typography

| Role | Family | Notes |
|---|---|---|
| Display | Instrument Serif (`--font-display`), 400, italic available | Hero name, page and section titles, case-study h1/h2, field-note headings, ghost numerals, debrief stat numbers. Single weight: never bold it. |
| Body | Figtree (`--font-body`) | All prose, card text, descriptions. |
| Label / code | JetBrains Mono (`--font-code`) | Labels, buttons, metadata, code. Around the introduction, the chapters and the projects, labels render as written (sentence case, normal tracking) at 14px; older sections still use uppercase tracked labels. |
| Hand | Caveat (`--font-hand`) | The sign-off and the easter egg only. Not preloaded. |

**Ramp:** hero name `clamp(56px,10vw,132px)` lh 0.95 (`clamp(48px,13vw,64px)` on phones, 600px and under); ghost numeral `clamp(72px,11vw,160px)` at 5% opacity; title 20px; body 15px lh 1.65 (17px in long-form articles); label 14px (secondary labels and captions around the introduction, chapters and projects never go below it); legacy label 11px and small label 10px in older sections only; metadata 12px. Inputs on touch devices are 16px so iOS doesn't zoom.

## 4. Elevation and effects

- **Tonal first.** Depth comes from background tint steps and border opacity, not shadows.
- **Blur budget.** `backdrop-filter` only where content actually scrolls behind something: the sticky site header, the modal scrim, the chat panel, the lightbox. Never on cards or on fixed chrome over solid backgrounds: it costs a repaint every scroll frame on phones and is invisible there.
- **Shadows** only on floating layers (modal, popovers, the open chat panel), never on cards or sections. No coloured glows or halos: the logo dot is solid teal and the "Ask Ahmad" button has a crisp 1px teal border.
- **Words never sit on artwork directly.** Copy over a photo or a drawing is on an opaque `--background` panel (the hero panel, `.scene-copy`); a drawing's caption sits under it on its own opaque strip (`StageArt` `caption`), not inside the SVG.

## 5. Components

- **World chapter (`WorldChapter`):** a `FlyInScene` (mark `NN · World · years`, display-serif title, that world's story sentences, one stat), with `StageArt` filling the side opposite the words (the world's animated drawing from the old Story section, with Ahmad's own photos laid over it like prints; hidden under 900px), then the calm work area on `--background`: every project in the world as an equal-size `ProjectTile` with its picture at full brightness (one shared project modal), its extras (the research paper) and the insights traced to its projects. The featured projects are not repeated there. Chapter words are either fully shown or hidden, never half-faded.
- **Featured projects (`FeaturedWork`):** full-width panels: description, then its tools, then stats and links. Football IQ shows one real output from the build (the Clip Review screen) beside the pipeline explanation; drawings or concepts that are not real output (the play diagram, the concept dashboard image) carry an "Illustrative example" label.
- **Section header (`SH`):** ghost numeral, 22px accent line, mono `h2` label in the section colour, optional 15px subtitle, 52px gap below. Sections after the journey open with one; parts of About (Capabilities, Timeline, Credentials, Signals) use `variant="sub"`: no numeral, an `h3`, 32px gap.
- **Site header:** 62px, transparent until scrolled. Four nav items (Journey, Notes, About, Contact) plus Docs.
- **Chapter rail (`ChapterNav`, homepage, 1200px and up):** its own reserved left column (`--rail-w`; the page is padded by it), so it never covers text, artwork or links. Collapsed it shows a "Chapters" toggle and the current chapter; expanded it lists every chapter, with the prologue and worlds grouped under "Experience and background". Below 1200px it is not shown and the header nav takes over.
- **Subpage header (`SubpageHeader`):** every non-home page. 56px, same colours and logo, a smart back link (history-back when you came from inside the site), and a page-specific slot on the right that hides on phones.
- **Site footer:** on every page, including case studies, field notes and docs.
- **Case study frame:** `SubpageHeader`; hero (tags, display-serif title, lede); **debrief stats** (accent rule on top, display-serif number, mono label, no boxes); sticky section nav (sidebar on desktop, tab bar on smaller screens); then the prev/next **case-file pager** ("Case file 03 of 10").
- **Buttons:** primary is an accent fill with dark text; secondary is an opaque `--background` fill with `--foreground` text and a `--text2` border (8:1, clearly visible); mono 14px label as written. Minimum 44px tap target.
- **Tags and chips:** mono, accent tint background, accent border; 14px beside project descriptions (`Tag size={14}`), 10-11px in older sections.
- **Focus:** one 2px teal `:focus-visible` ring everywhere, offset 3px. Never `outline: none` without a replacement.

## 6. Motion

- **Compositor-only loops.** Ambient loops animate `transform` and `opacity` only, not `height`, `box-shadow` or `filter`.
- **Off-screen means paused.** `OffscreenAnimationPauser` pauses CSS animations in sections out of view; the play diagram pauses off-screen; the depth canvas draws only when a scene or the pointer changes, and nothing when no scene is on screen.
- **Three journey tiers** (`useJourneyTier`): *full* (fine pointer, ≥1024px, WebGL2) adds the depth canvas; *lite* (phones, tablets, no WebGL2) runs the same fly-in with CSS layers only; *still* (reduced motion) shows each photo still behind its copy and the page simply scrolls. Content is identical in all three.
- **Scenes are driven directly.** One rAF-throttled scroll handler per scene writes `transform`/`opacity` to its layers (not framer's `useScroll`, whose target ranges don't fit sticky scenes); hidden layers drop pointer events so they never swallow clicks.
- **Reduced motion** is honoured everywhere: a global CSS kill-switch, `MotionConfig reducedMotion="user"` for Framer Motion, and `@/lib/motion/use-reduced-motion` (hydration-safe) instead of framer's hook in render.
- **Hover needs a touch equivalent.** Anything revealed on hover must be visible or one tap away on touch (`useCanHover`).

## 7. Do's and don'ts

**Do**
- Open every post-journey homepage section with `SH` and every subpage with `SubpageHeader`.
- Move content, never drop it: `tests/content/` holds a snapshot of every string and the rendered text of every route, and `allowed-removals.json` lists (with reasons) the only labels that may disappear.
- Give each project one accent and use it consistently.
- Keep readable text at 10px or larger (14px for labels and captions around the introduction, chapters and projects) and at least 4.5:1.
- Check new layouts at 320, 768, 1280 and 2560 px with no horizontal overflow (use `minmax(min(Npx,100%),1fr)` for card grids).

**Don't**
- Gradient text, glassmorphism on cards, boxed stat grids, macOS window dots.
- Coloured side-stripe borders thicker than 1px.
- Hover-only content with no touch fallback.
- New colours, fonts or nav items without updating `theme.css` and this file.
