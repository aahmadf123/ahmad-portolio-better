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
  gold: "#f59e0b"
  # ── Project-aesthetic accents (original six) ──
  blue: "#5b8af5"
  teal: "#2dd4bf"
  orange: "#f0823c"
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
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
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

**Creative north star: "The Mission Debrief."** Built for an engineer reviewing a candidate at 9pm on a big monitor, and for a recruiter opening a link on a phone. Dark is the only theme. The language is structured, numbered and evidence-first: every section is a numbered chapter, every case study is a numbered case file, and decoration has to carry signal.

**What makes it this site and not a template:**
- The chapter registry (`src/lib/data/sections.ts`) drives ghost numerals, header colours and the left chapter rail together.
- The pinned Story: six chapters wiped in by scroll, each with a code-drawn SVG scene.
- The one-time "classified dossier" scan-line reveal on the hero.
- The Football IQ play diagram, the skills constellation, the kinetic timeline.
- Letterbox "film-strip" page transitions; the handwritten sign-off.

**What it rejects:** gradient text, glassmorphism as decoration, boxed "big number" stat dashboards, gradient-mesh glows on every surface, macOS window dots, anything that would survive unchanged in someone else's dark portfolio.

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
- **Gold `#f59e0b`:** milestones and highlights (timeline bursts, the scroll bar's far end).
- **Project and section accents:** blue `#5b8af5`, orange `#f0823c`, purple `#a78bfa`, pink `#f472b6`, sky `#38bdf8`, red `#ef4444`, green `#22c55e`. Each project and section owns one and uses it consistently (tags, borders, its debrief stats, its pager card).

### Rules
- **Tints, not fills.** Accents sit on surfaces at 3-10% and on borders at 20-35%. Solid accent fills only on buttons, and buttons carry dark text (`--background`), never white: white on blue or red fails contrast.
- **Hex in JS.** Accent colours passed through JS stay hex literals. Many components derive alpha by appending (`${c}33`), and canvas/Three.js can't read `var()`. For derived opacity in CSS use `color-mix(in srgb, var(--x) N%, transparent)`.
- **New colours go into `theme.css` and this file first.**

## 3. Typography

| Role | Family | Notes |
|---|---|---|
| Display | Instrument Serif (`--font-display`), 400, italic available | Hero name, page and section titles, case-study h1/h2, field-note headings, ghost numerals, debrief stat numbers. Single weight: never bold it. |
| Body | Figtree (`--font-body`) | All prose, card text, descriptions. |
| Label / code | JetBrains Mono (`--font-code`) | Uppercase tracked labels (0.08-0.14em), nav, buttons, metadata, code. |
| Hand | Caveat (`--font-hand`) | The sign-off and the easter egg only. Not preloaded. |

**Ramp:** hero name `clamp(56px,10vw,132px)` lh 0.95; ghost numeral `clamp(72px,11vw,160px)` at 5% opacity; title 20px; body 15px lh 1.65 (17px in long-form articles); label 11px; small label 10px, the floor for any readable text; metadata 12px. Inputs on touch devices are 16px so iOS doesn't zoom.

## 4. Elevation and effects

- **Tonal first.** Depth comes from background tint steps and border opacity, not shadows.
- **Blur budget.** `backdrop-filter` only where content actually scrolls behind something: the sticky site header, the modal scrim, the chat panel, the lightbox. Never on cards or on fixed chrome over solid backgrounds: it costs a repaint every scroll frame on phones and is invisible there.
- **Shadows** only on floating layers (chat, modal, popovers), never on cards or sections.

## 5. Components

- **Section header (`SH`):** ghost numeral, 22px accent line, mono `h2` label in the section colour, optional 15px subtitle, 52px gap below. Every homepage section opens with one.
- **Site header:** 62px, transparent until scrolled. At most five nav items (Story, About, Work, Notes, Contact) plus Docs; the chapter rail reaches every section.
- **Subpage header (`SubpageHeader`):** every non-home page. 56px, same colours and logo, a smart back link (history-back when you came from inside the site), and a page-specific slot on the right that hides on phones.
- **Site footer:** on every page, including case studies, field notes and docs.
- **Case study frame:** `SubpageHeader`; hero (tags, display-serif title, lede); **debrief stats** (accent rule on top, display-serif number, mono label, no boxes); sticky section nav (sidebar on desktop, tab bar on smaller screens); then the prev/next **case-file pager** ("Case file 03 of 10").
- **Buttons:** primary is an accent fill with dark text; secondary is transparent with a `--bd2` border; mono 11px uppercase label. Minimum 44px tap target.
- **Tags and chips:** mono 10-11px, accent tint background, accent border.
- **Focus:** one 2px teal `:focus-visible` ring everywhere, offset 3px. Never `outline: none` without a replacement.

## 6. Motion

- **Compositor-only loops.** Ambient loops animate `transform` and `opacity` only, not `height`, `box-shadow` or `filter`.
- **Off-screen means paused.** `OffscreenAnimationPauser` pauses CSS animations in sections out of view; the Story pauses chapters that are wiped away; the play diagram pauses off-screen.
- **Pin only where it works.** The Story pins only on desktops (at least 1024 wide, 680 tall, fine pointer). Phones, tablets and short windows get the stacked layout.
- **Reduced motion** is honoured everywhere: a global CSS kill-switch plus `MotionConfig reducedMotion="user"` for Framer Motion.
- **Hover needs a touch equivalent.** Anything revealed on hover must be visible or one tap away on touch (`useCanHover`).

## 7. Do's and don'ts

**Do**
- Open every homepage section with `SH` and every subpage with `SubpageHeader`.
- Give each project one accent and use it consistently.
- Keep readable text at 10px or larger and at least 4.5:1.
- Check new layouts at 320, 768, 1280 and 2560 px with no horizontal overflow (use `minmax(min(Npx,100%),1fr)` for card grids).

**Don't**
- Gradient text, glassmorphism on cards, boxed stat grids, macOS window dots.
- Coloured side-stripe borders thicker than 1px.
- Hover-only content with no touch fallback.
- New colours, fonts or nav items without updating `theme.css` and this file.
