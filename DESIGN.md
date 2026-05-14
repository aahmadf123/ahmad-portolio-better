# Design

## Overview

Dark technical portfolio. Deep navy background tinted slightly blue-purple, warm cream foreground, single typeface (Chakra Petch) used across all roles. Six named accent colors with domain associations. Minimalist dot-grid texture on the body background. Amber is the primary accent and structural color (scroll bar, section headers, CTA).

## Theme

**Dark.** `#0B0D14` — a blue-purple-tinted near-black, not neutral grey. The tint matters: it creates warmth contrast with the cream text and prevents the "black screen" feel of generic dark portfolios. Foreground is `#F2EDD8` — a very warm off-white (slight amber tint) that reads as cream, not white. The combination is deliberate: warm cream on cold-tinted dark, unified by amber as the bridge color.

Scene: an engineer reviewing a candidate portfolio at 9pm on a 27-inch monitor in a dim office. Dark is correct.

## Color

**Strategy: Full palette.** Six named accent colors, each used with purpose across domain-mapped UI elements. Not decoration.

| Token | Value | Domain / Use |
|---|---|---|
| `--background` | `#0B0D14` | Page background (blue-purple tint) |
| `--foreground` | `#F2EDD8` | Primary text (warm cream) |
| `--surf` | `#131520` | Card / surface 1 |
| `--surf2` | `#1A1D2C` | Surface 2 / muted areas |
| `--text2` | `#B8B4A4` | Secondary text |
| `--text3` | `#6E6B60` | Tertiary text / labels |
| `--bd` | `rgba(242,237,216,0.08)` | Default border |
| `--bd2` | `rgba(242,237,216,0.15)` | Elevated border |
| `--amber` | `#F0B429` | Primary accent, section headers, CTAs |
| `--blue` | `#4B7BF5` | AI / ML domain, research |
| `--teal` | `#2DD4C8` | Robotics / systems, IEEE affiliation |
| `--orange` | `#F07832` | MLOps / data, industry work |
| `--purple` | `#A78BFA` | Robotics subcategory, Pi Sigma Epsilon |
| `--pink` | `#F472B6` | Microsoft stack category |

**Background texture:** Subtle amber dot grid at 2–3% opacity, 28px × 48px (offset at 14px/24px for hex pattern). Structural, not decorative.

**Selection color:** `rgba(240,180,41,0.22)` — amber tint.

**Scroll bar:** 2px horizontal top bar, amber, scales with scroll position.

## Typography

**Single typeface: Chakra Petch** — loaded via `next/font/google`, weights 300–700, normal only (no italic). A geometric-technical sans-serif with slight sci-fi character. Chosen because it reads as precise and engineered without being cold.

| Role | Size | Weight | Usage |
|---|---|---|---|
| Mega display | `clamp(7rem,15vw,12rem)` | 400 | Ghost numbers behind section headers |
| Section title | `clamp(72px,11vw,160px)` | 400 (ghost, 5% opacity) | Decorative section numbering |
| Hero name | `clamp(52px,7.5vw,112px)` | 400 | Above-the-fold name |
| Card heading | 20px | 400 | Experience job titles, project names |
| Body / description | 14–15px | 400 | Work descriptions, section subtitles |
| Mono label | 10–11px | 400 | Section header labels, skill chips, tags (ALL CAPS, 0.1em tracking) |
| Small metadata | 12px | 400 | Dates, locations, secondary info |

**Letter spacing:** 0.1–0.13em on ALL CAPS mono labels. Tight (-0.01 to -0.03em) on large display. Normal on body.

**Line height:** 1.65 body, 1.3–1.4 on headings, 1.75 on long descriptions.

**No italic anywhere.** Font style is always `normal`.

## Spacing & Layout

**Section padding:** `clamp(64px,8vw,100px)` vertical, `clamp(20px,4vw,52px)` horizontal.

**Section gap:** 52px between the section header (`SH`) and section content.

**Grid:** `repeat(3,1fr)` for skill groups (collapses to 2-col at 860px, 1-col at 560px). `repeat(2,1fr)` for awards and affiliations (collapses to 1-col at 860px). `repeat(auto-fit,minmax(340px,1fr))` for project cards.

**Card padding:** 22–24px. Inner gap between content blocks: 14–18px.

**Section separator:** No horizontal rules. Background color shift (`rgba(15,17,25,0.92)` on alternate sections) provides rhythm.

## Components

### Section Header (SH)
Ghost number in background (5% opacity, `clamp(72px,11vw,160px)`, color-coded per section), accent line (22×1.5px) + uppercase mono label in foreground. Optional subtitle at 15px. `marginBottom: 52px`.

### ExpandableCard (Projects)
- Thumbnail with `borderTop: 2px solid accentColor`, remaining 3 sides at 1px `--bd`
- On hover: 3 non-top sides shift to `accentColor 44` (26% opacity)
- Click expands to full-screen portal modal (z-index 9998/9999)
- Tags rendered as colored chips below description

### Skill Chip
11px mono, `padding: 4px 9px`, background `rgba(242,237,216,0.03)`, border `rgba(242,237,216,0.08)`. On hover: background shifts to `color18` (9% opacity), text brightens.

### Tag (domain/stack labels)
11px mono, `padding: 4px 9px`, background `color14` (8% opacity), border `color33` (20% opacity), text = color itself.

### Expandable Award / Affiliation Card
Header row always visible: title + year badge + `+` icon (rotates 45° when open). On open: photo row (h:140px, borderRadius:6px) revealed below a `1px rgba(242,237,216,0.06)` separator. Affiliations also show a description paragraph below photos.

### NeonButton
CTA button with amber glow. Used for primary actions (resume download, email).

### Hover Peek (HoverPeek)
Link preview on hover over featured-in URLs — mini card with site thumbnail.

## Motion

**Ease function:** `cubic-bezier(0.16,1,0.3,1)` — fast out, exponential deceleration. Used everywhere.

**Reveal on scroll:** `IntersectionObserver` at 0.1 threshold. Elements start at `opacity: 0, transform: translateY(24px)`, reveal to `opacity: 1, transform: none`. CSS transition 0.7s with 0.1s delay.

**Framer Motion layoutId:** Used for project card expand/collapse — shared layout animation between thumbnail and modal.

**3D Cube:** `NebulaCube` (Three.js) — hero decorative element, async-loaded (no SSR). Non-critical; hidden on small screens.

**`prefers-reduced-motion`:** Reveal animations should degrade to immediate visibility. The scroll-based progress bar does not animate layout properties (transform only).

## Iconography

Minimal. `lucide-react` (`FlaskConical` for research section). No icon sets for navigation or skills — replaced by color-coded dots and monospaced labels.

## Elevation Model

Three levels:
1. **Page surface:** `#0B0D14`
2. **Card surface:** `#131520` (`--surf`) with `1px rgba(242,237,216,0.08)` border
3. **Elevated card / modal:** `#1A1D2C` (`--surf2`) or portal overlay at `rgba(11,13,20,0.96)`

No shadows. Elevation communicated via background color delta and border opacity, not drop shadows.
