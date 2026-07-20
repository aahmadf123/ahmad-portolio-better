---
name: Ahmad Firas Portfolio
description: Cinematic, scroll-driven dark portfolio — a documentary-style journey for an agentic AI engineer. Tokens live in src/styles/theme.css; this doc mirrors them.
colors:
  # ── Structural palette ──
  background: "#0d0e12"
  foreground: "#f4f4f2"
  surface-1: "#13151b"
  surface-2: "#1a1d25"
  text-secondary: "#a3a8b0"
  text-tertiary: "#6b7078"
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
    backgroundColor: "{colors.amber}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.amber}"
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
    backgroundColor: "{colors.amber}14"
    textColor: "{colors.amber}"
    rounded: "{rounded.xs}"
    padding: "4px 9px"
    typography: "{typography.label}"
  chip:
    backgroundColor: "rgba(242,237,216,0.03)"
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

## 1. Overview

**Creative North Star: "The Mission Debrief"**

This system is built for an engineer reviewing a candidate portfolio at 9pm on a 27-inch monitor in a dim office. Dark is the only correct answer. The visual language comes from someone who writes precise technical reports and also deploys them under real constraints — structured, numbered, evidence-first. Every surface element exists to carry signal: the ghost section numbers are audit trail markers, not decoration; the amber dot-grid is a measurement substrate, not texture. The typeface (Chakra Petch, exclusively) reads as engineered without being cold. The color system is a taxonomy, not a mood board.

What this system explicitly rejects: gradient mesh heroes, glassmorphism as default decoration, animated skills bars, SaaS stat dashboards (big number in a colored box), dark portfolio templates that look like everyone else's dark portfolio template, and any element that would survive unchanged if dropped into a competing portfolio. The interface must feel like it was made by the same person who wrote the research papers and shipped the production systems.

Color strategy: Full Palette. Nine named colors, each with a fixed role. Amber is the sole structural accent; it governs every system-level affordance (scroll progress bar, section labels, primary CTAs, magnetic cursor, ambient body texture). The six project-aesthetic accents (blue, teal, orange, purple, pink, plus three project-specific extensions) assign visual identity to individual projects and sections, creating a taxonomic color map without requiring a legend.

**Key Characteristics:**
- Single typeface, no italic, weights 300-700 only
- Dark background with a deliberate blue-purple tint (not neutral grey, not pure black)
- Warm cream foreground bridged to cold background by amber
- Flat-by-default elevation: depth via tonal background opacity, never shadows
- Numbered sections with ghost numerals at 5% opacity
- All borders at low opacity (8-15%); accent borders at 20-26% on interactive state
- Motion: scroll-driven reveals via CSS `animation-timeline: view()`, GSAP for Three.js scene, Framer Motion for portal expand/collapse

## 2. Colors: The Amber-Bridged Palette

Warm cream on cold-tinted dark, unified by amber as the bridge. Accent colors are taxonomic assignments, not aesthetic choices.

### Primary
- **Structural Amber** (`#F0B429`): The only color that touches system chrome. Scroll progress bar, section header labels, primary CTA background, magnetic cursor, body dot-grid texture, active nav underline, text selection tint (`rgba(240,180,41,0.22)`). Never used for decorative purposes. Its scarcity is the point.

### Neutral
- **Blue-Purple Night** (`#0B0D14`): Page background. The blue-purple tint (`oklch(~0.10 0.02 270)`) prevents the "black screen" read of pure dark backgrounds. All solid section backgrounds use slight opacity variants of this value.
- **Warm Cream** (`#F2EDD8`): Primary foreground text. The amber tint (`oklch(~0.95 0.02 90)`) creates warmth contrast against the cold background.
- **Deep Surface** (`#131520`): Card/surface tier 1. Component interiors, nav bar background.
- **Muted Surface** (`#1A1D2C`): Surface tier 2. Input areas, alternate section backgrounds.
- **Secondary Text** (`#B8B4A4`): Body copy, descriptions, secondary labels.
- **Tertiary Text** (`#6E6B60`): Metadata, dates, disabled states, "Scroll to explore" copy.
- **Default Border** (`rgba(242,237,216,0.08)`): All component borders at rest.
- **Elevated Border** (`rgba(242,237,216,0.15)`): Borders on hover or open state for non-accent components.

### Secondary (project-aesthetic accents)
These six colors are not interchangeable. Each is assigned to a specific project or section and used consistently within that context. Do not reuse an accent in a section where it was not assigned.

- **Research Blue** (`#4B7BF5`): Research section, DeepFlyer project, AI/ML domain signals.
- **Systems Teal** (`#2DD4C8`): UToledo Athletics internship, Security Discovery Tool, infrastructure signals.
- **Engineering Orange** (`#F07832`): Park Place Technologies, Camel Car, embedded/hardware signals.
- **Academic Purple** (`#A78BFA`): Grange Insurance senior design, educational/institutional signals.
- **Civic Pink** (`#F472B6`): Batting Cleanup, civic tech signals.

### Tertiary (project-specific extension accents)
Added for newer projects. Not part of the original system; do not use for structural purposes.

- **Athletics Red** (`#EF4444`): Toledo Football IQ project only.
- **Platform Green** (`#22C55E`): Toledo Athletics Onboarding Portal project only.
- **Campaign Sky** (`#0EA5E9`): Champions Complex Digital Campaign project only.

### Named Rules

**The Amber Lock Rule.** Amber (`#F0B429`) is reserved for system chrome and structural affordances. It must never appear as a project-aesthetic accent on a non-amber-assigned card, section, or component. If a new project needs an accent color, assign one of the existing nine or extend the system explicitly.

**The Tint Rule.** Accent colors appear on component backgrounds at 3-10% opacity (`color03` to `color0a` hex suffixes), on borders at 20-33% opacity. Never full-saturation accent fills on large surfaces.

**The Pure-Black Ban.** `#000` and `#fff` are not used anywhere. The darkest value is `#0B0D14`; the lightest is `#F2EDD8`.

## 3. Typography: The Single Voice

**Display / Body / Label Font:** Chakra Petch (`var(--font-chakra)`) — loaded via `next/font/google`, weights 300-700, `font-style: normal` only. No italic anywhere; the font has no italic in the loaded set.

A geometric-technical sans-serif with a slight sci-fi angle. Reads as engineered without being cold — unusual in technical sans choices. The single-typeface decision signals precision (no expressive/body pairing needed) and keeps the cognitive register consistent across UI labels, body prose, and display headings.

### Hierarchy

- **Display** (400, `clamp(7rem, 15vw, 12rem)`, lh 1, ls -0.03em): Ghost numerals only. Rendered at 5% opacity behind section headers. Never used for readable content.
- **Hero Name** (400, `clamp(56px, 10vw, 132px)`, lh 0.95, ls -0.025em): Above-the-fold name display. The only instance of sub-1.0 line-height in the system.
- **Section Ghost** (400, `clamp(72px, 11vw, 160px)`, lh 1, ls -0.03em): Section numbering ghost in `SH` component.
- **Title** (400, 20px, lh 1.25, ls -0.01em): Job titles, project card headings, card-level h2/h3. Weight contrast from body is achieved through size, not weight (both 400).
- **Body** (400, 14-16px, lh 1.65-1.75): All prose — project descriptions, about paragraphs, case study body. Keep lines at 65-75ch maximum. 16px on section-level descriptions; 14-15px inside cards.
- **Label** (400, 11px, lh 1.4, ls 0.1em, UPPERCASE): Section header tags, nav links, button text, skill tags. Always all-caps. The 0.1em tracking is mandatory.
- **Label-SM** (400, 10px, lh 1.4, ls 0.12em, UPPERCASE): Metadata inside components, date strings, tag categories. Slightly tighter size, slightly wider tracking than Label.
- **Metadata** (400, 12px, lh 1.5, ls 0.06em): Timestamps, locations, secondary identifiers. Not all-caps.

### Named Rules

**The One Voice Rule.** Every typographic role uses Chakra Petch. No system serif, no fallback sans for body, no monospaced import. If a new surface needs a different feel, vary size, weight, case, and spacing — not the family.

**The No-Italic Rule.** `font-style: italic` is never set. The font set does not include italic weights; using it would trigger browser synthesis (oblique), which breaks the precision signal.

**The Weight Paradox.** Most roles use weight 400. Hierarchy comes from size contrast (0.95 lh hero name vs 1.65 lh body is a 10:1 visible size difference at viewport scale), not weight stacking. Weight 600-700 is used only inside card expand panels for sub-heading labels that need to stand out from adjacent body prose.

## 4. Elevation

This system is flat-by-default. No `box-shadow` values appear on cards, section containers, or navigation. Depth is created through three techniques: tonal background layering, border opacity stepping, and relative z-index with background opacity.

**Tonal layering (primary technique):** Surface components use background colors at low opacity against the page background. The perceived depth order is: page (`#0B0D14`) < section background (`rgba(15,17,25,0.92)`) < surface-1 (`#131520`) < surface-2 (`#1A1D2C`).

**Border opacity stepping:** Components at rest use `rgba(242,237,216,0.08)` borders. Interactive states (hover, open) step up to `rgba(accentColor, 0.26-0.33)`. This creates a perceived "lift" without a shadow value.

**Exception: MotionFooter glass pills.** The footer contact buttons use `backdrop-filter: blur(16px)` with a multi-layer box-shadow (`0 10px 30px -10px ...`). This is the single sanctioned use of blur and shadow in the system. It is isolated to the footer and uses CSS custom properties, not hardcoded values.

**Named Rule:**

**The Flat-By-Default Rule.** New components start with no shadow. If depth is needed, use tonal background stepping first, then border opacity stepping. Reach for `box-shadow` only when both alternatives are insufficient, and only in the footer context. Never add `box-shadow` to card components, section headers, or navigation.

## 5. Components

### Section Header (SH)
The system's primary structural signal — every section opens with one.

- **Ghost number:** Absolutely positioned, `clamp(72px, 11vw, 160px)`, weight 400, `opacity: 0.05`, `color: accentColor`. Top -32px, left -8px. `user-select: none; pointer-events: none`.
- **Accent line:** `22px × 1.5px`, `background: accentColor`, `opacity: 0.6`.
- **Label:** 11px Chakra Petch mono, `letter-spacing: 0.1em`, `text-transform: uppercase`, `color: accentColor`.
- **Optional subtitle:** 15px body, `color: #B8B4A4`, `max-width: 460px`, `line-height: 1.65`. Only when context is non-obvious.
- **Bottom margin:** Always 52px between SH and section content.
- **Scroll animation:** Ghost number animates from `opacity: 0, translateX(-16px)` to `opacity: 0.05, none` via CSS scroll-driven animation (`animation-timeline: view()`).

### ExpandableCard (project grid)
- **Thumbnail at rest:** `borderTop: 2px solid accentColor`, remaining 3 sides `1px solid rgba(242,237,216,0.08)`. Image fills aspect ratio (16:7 for span-2, 4:3 for span-1).
- **Thumbnail hover:** Border on 3 non-top sides shifts to `accentColor` at 26% opacity (`accentColor44`). Cursor: pointer.
- **No expand affordance text on the thumbnail itself** — the section subtitle provides the instruction. Note: this is a discoverability gap flagged in critique (P2).
- **Expanded state:** Full-screen portal (via React `createPortal`, `z-index: 9999`). Framer Motion `AnimatePresence` handles enter/exit. Scrim: `rgba(0,0,0,0.75)` with `backdrop-filter: blur(10px)`. Card: `max-width: 800px`, centered, scrollable if content exceeds viewport.
- **Close:** Escape key, click-outside, or an ×-style icon button. `overflow: hidden` on body while open.

### Experience Accordion
- **At rest:** `1px solid rgba(242,237,216,0.07)`, background `rgba(242,237,216,0.02)`, padding `22px 26px`, borderRadius 8px.
- **Open state:** Border shifts to `accentColor55` (33% opacity). Background shifts to `accentColor0a` (4% opacity). Expand icon (`+`) rotates 45° with `transition: transform 0.3s`.
- **Expand/collapse trigger:** Full row is clickable. Inner content area has `onClick: stopPropagation` to allow text selection and link clicks without toggling.
- **Active indicator:** Teal pulse dot (6×6px, `border-radius: 50%`, `animation: pulse-a 2.4s ease-out infinite`) for current role.

### Buttons

**Primary (amber fill):**
- Background: `#F0B429`. Text: `#0B0D14`. Padding: `11px 24px`. Border-radius: 5px.
- Font: 11px Chakra Petch mono, weight 700, all-caps, `letter-spacing: 0.06em`.
- No hover state defined in code (inherits cursor pointer from `data-magnetic` attribute). Magnetic cursor provides interaction feedback.

**Secondary (ghost with muted border):**
- Background: transparent. Border: `1px solid rgba(242,237,216,0.16)`. Text: `#B8B4A4`. Padding: `11px 24px`. Same font as primary.

**Tertiary (ghost with dimmer border):**
- Background: transparent. Border: `1px solid rgba(242,237,216,0.10)`. Text: `#6E6B60`. Padding: `9px 18px`. Font: 10px, weight 400.
- Used for Resume download link and low-hierarchy actions.

**Accent fill (project-specific):**
- Background: `accentColor`. Text: `#0B0D14` (or `#fff` for low-contrast accents like blue). Padding: `9px 18px`. Font: 10px mono, weight 700. Used inside expanded card panels.

**Accent ghost (project-specific):**
- Background: transparent. Border: `1px solid accentColor35` (21% opacity). Text: `accentColor`. Used for secondary actions inside expanded cards (report downloads, GitHub links).

### Tag (stack / domain labels)
11px Chakra Petch mono, padding `4px 9px`, border-radius 4px, background `accentColor14` (8% opacity), border `1px solid accentColor33` (20% opacity), text color = full accent. Used inside card expanded views and section details. Tags adopt the accent color of the containing card or section.

### Skill Chip
11px Chakra Petch mono, padding `4px 9px`, border-radius 4px, background `rgba(242,237,216,0.03)`, border `1px solid rgba(242,237,216,0.08)`, text `#B8B4A4`. Hover: background `accentColor12` (7% opacity), text brightens to foreground. Used in the Skills section where a shared amber accent applies to all chips.

### Navigation (Header)
- **Height:** 52px (sticky, `z-index: 50`).
- **Background at rest:** transparent. **Background scrolled (>10px):** `rgba(11,13,20,0.85)` with `backdrop-filter: blur(16px)`. This is sanctioned glassmorphism: functional readability over the Three.js canvas, not decorative.
- **Nav links:** 10px mono, all-caps, `letter-spacing: 0.12em`, `color: #B8B4A4`. Active section: amber underline dot (2px wide, `background: #F0B429`, absolute positioned).
- **Mobile menu:** Full-screen overlay with `opacity` + `transform` entrance animation.

### NebulaCube (Three.js hero background)
900 particles + 14 hub nodes in satellite clusters. Sapphire/teal/amber particle color scheme. Fixed full-screen, `z-index: 0`. GSAP ScrollTrigger drives scroll-based rotation. Mouse-following parallax. `opacity: 0.42` overlay prevents the scene from overpowering foreground text. Degrades gracefully if WebGL is unavailable. Do not replicate this effect with CSS alone (particle count requires canvas rendering).

### Scroll Progress Bar
2px horizontal bar at the very top of the viewport. Amber (`#F0B429`). `transform: scaleX(progress)`, `transform-origin: left`. Implemented inline via a scroll event listener in `_document`. Not a component — a layout-level system element.

### Ambient Body Texture
`::before` pseudo-element on `body`. Dual radial-gradient dot pattern: amber at 4.5% and 2.2% opacity, 28px × 48px hex grid (offset at 14px/24px). Structural signal, not decoration. Do not increase opacity.

## 6. Do's and Don'ts

### Do's

- **Use the SH component for every section header.** Ghost number + accent line + mono label is the system's primary structural pattern. Do not replace it with a plain `<h2>`.
- **Assign one accent color per project card and use it consistently** throughout that card's thumbnail, expanded panel, tags, and internal headings.
- **Use tonal background tints** (`accentColor` at 3-10% opacity) to signal component surfaces. This is the only elevation mechanism for cards.
- **Keep amber for structural affordances only.** CTAs, section labels, scroll bar, cursor, body texture. Not for project-card backgrounds unless the project is explicitly assigned amber.
- **Respect `prefers-reduced-motion`.** Reveal animations must degrade to immediate visibility (`animation: none`). The NebulaCube should stop rotating and be static at reduced motion.
- **Use the body dot-grid texture as inherited.** It is set on `body::before` and is visible through transparent section backgrounds. Solid section backgrounds (`rgba(11,13,20,0.88)`) intentionally mute it.
- **Set `font-style: normal` explicitly** on any new text elements. Never rely on browser italic synthesis.
- **Document new accent color assignments** in this file and in `globals.css` as a CSS custom property before using them in component code.

### Don'ts

- **Don't use `border-left` or `border-right` greater than 1px** as a colored accent stripe on cards or list items. Use full 4-sided borders with accent opacity, or background tints, or nothing.
- **Don't use gradient text** (`background-clip: text` with a gradient `background`). The `.footer-text-glow` and `.footer-giant-bg-text` classes in `motion-footer.tsx` are legacy ghost/decorative elements at very low opacity. Do not propagate this pattern to content text or headings.
- **Don't use glassmorphism** (`backdrop-filter: blur`) as a default card style. The two sanctioned uses are: (1) the sticky nav bar after 10px scroll, (2) the footer glass-pill contact buttons. Nowhere else.
- **Don't add new colors without updating DESIGN.md.** The three extension accents (red, green, sky) were added without documentation — that is the failure mode this rule prevents.
- **Don't use `#000` or `#fff`.** The darkest value is `#0B0D14`; the lightest is `#F2EDD8`.
- **Don't use `font-style: italic`.** The loaded font set has no italic weights; browser synthesis produces oblique that breaks the precision signal.
- **Don't add `box-shadow` to project cards or section containers.** Depth is tonal, not shadow-based. The flat system is intentional.
- **Don't use the metric stat-grid pattern** (3-4 column grid of big number + small all-caps label in colored bordered boxes) as the primary content structure inside expanded project cards. This is the banned "hero-metric template." Integrate key numbers into prose or use a single prominent callout per project.
- **Don't nest cards.** The expanded ExpandableCard portal is a full-screen surface, not a card inside a card. Inner content uses prose, tags, and dividers — not additional card containers.
- **Don't add nav items beyond 5** (About, Work, Research, Field Notes, Contact) without removing an existing one. Nine nav items is the documented cognitive-load violation from the design critique.

## Elevation Model

Three levels:
1. **Page surface:** `#0B0D14`
2. **Card surface:** `#131520` (`--surf`) with `1px rgba(242,237,216,0.08)` border
3. **Elevated card / modal:** `#1A1D2C` (`--surf2`) or portal overlay at `rgba(11,13,20,0.96)`

No shadows. Elevation communicated via background color delta and border opacity, not drop shadows.

## Page Surfaces

### Home (single-page portfolio)
Seven sections on one scrolling page: Hero, About, Experience, Projects, Research, Skills, Awards/Affiliations. Each section uses the SH component for heading. Alternate sections use a subtle background tint for rhythm. Section anchors are tracked via `IntersectionObserver` to update the sticky nav's active link.

### Field Notes Hub (`/field-notes`)
- Sticky top bar showing "X of Y published" in mono label style
- Large hero with editorial headline ("Essays from the frontier") at `clamp(52px,7.5vw,112px)` — same weight as the home hero name
- Two-column split below: Published grid (FieldNoteCard components) + Coming Soon by category
- FieldNoteCard: small image, category chip, title, excerpt, read-time tag. No side borders. No identical grid of icon+text cards.
- Category taxonomy: Agentic AI, Production Engineering, MLOps, Robotics, Research Methods

### Field Notes Essay (`/field-notes/[slug]`)
- MDX content rendered via `@mdx-js/react` with custom component map
- Body text: 15px, line-height 1.75, max-width 65ch
- Section headings: 20px weight 600, amber underline 2px on scroll-into-view
- Custom diagram components: `AgentArchitectureLayers`, `MaturityLadder`, `AutonomyTradeoff`, `ProductionChecklist` — rendered inline within prose, not in separate sections
- No sidebar. No floating table of contents. Linear reading experience.
- Back-link to `/field-notes` at top in mono label style

### Case Study (`/case-study/[slug]`)
- Sticky section navigation (sidebar or top bar depending on viewport) tracking active section via `IntersectionObserver`
- Sections: Overview, Problem, Architecture, Stack, Results, Insights, and project-specific additions (e.g., Human-in-Loop, Future)
- Metric cards: small grid of key quantified outcomes, color-coded with the project's accent
- Architecture layer breakdown: numbered layers, title, tech chips per layer
- Full technical narrative — same voice and detail level as the project card expansion, but with full prose
- No hero image. Headline + accent + section nav is the above-the-fold.

## Notes on Exploratory Components

`apple-tahoe-liquid-glass-button.tsx` exists as an exploratory glassmorphism button. It should not be used as a default CTA or applied decoratively. If it ships, it is for a single highly purposeful context only. The anti-glassmorphism design law still holds for all other surfaces.
