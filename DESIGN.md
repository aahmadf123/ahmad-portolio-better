---
name: Ahmad Firas Portfolio
description: Personal portfolio for an AI researcher and engineer; dark, precise, instrument-panel discipline.
colors:
  system-active-green: "#4ADE80"
  telemetry-blue: "#38BDF8"
  thermal-orange: "#FB923C"
  deep-field-violet: "#A78BFA"
  sensor-teal: "#2DD4BF"
  capability-pink: "#F472B6"
  void-black: "#04040A"
  deep-signal: "#080814"
  near-surface: "#0C0C1C"
  signal-white: "#D0D0E0"
  muted-readout: "#9090A8"
  dim-channel: "#4A4A62"
  border-default: "#FFFFFF12"
typography:
  display:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(68px, 9.5vw, 124px)"
    fontWeight: 700
    lineHeight: 0.88
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "'Sora', sans-serif"
    fontSize: "clamp(28px, 3.5vw, 34px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Sora', sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Sora', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.10em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "12px"
  md: "22px"
  lg: "48px"
  section: "100px"
components:
  button-primary:
    backgroundColor: "{colors.system-active-green}"
    textColor: "#050A06"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.system-active-green}"
    textColor: "#000000"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-readout}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.telemetry-blue}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
  button-credential:
    backgroundColor: "transparent"
    textColor: "{colors.sensor-teal}"
    rounded: "{rounded.sm}"
    padding: "7px 14px"
    typography: "{typography.label}"
  tag:
    backgroundColor: "rgba(56,189,248,0.07)"
    textColor: "{colors.telemetry-blue}"
    rounded: "{rounded.xs}"
    padding: "3px 9px"
    typography: "{typography.label}"
  card-default:
    backgroundColor: "rgba(255,255,255,0.02)"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.md}"
    padding: "22px"
  card-default-hover:
    backgroundColor: "rgba(255,255,255,0.035)"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.md}"
    padding: "22px"
  eyebrow-label:
    backgroundColor: "transparent"
    textColor: "{colors.system-active-green}"
    padding: "0"
    typography: "{typography.label}"
---

# Design System: Ahmad Firas Portfolio

## 1. Overview

**Creative North Star: "The Signal in the Noise"**

This system is built around one idea: engineering precision pulling clarity from deep complexity. The visual language earns its cosmos scale through domain; Ahmad's work spans autonomous UAV systems operating in uncertain environments, agentic AI navigating enterprise workflows, and ML infrastructure running in production under real pressure. The dark field is not aesthetic theater. It is the physical scene: a researcher reading sensor telemetry, an engineer reviewing deployment logs, a hiring manager looking for someone who has shipped in conditions where failure is costly.

Density is controlled but not sparse. Information arrives in a deliberate order: identification first (who, what role), then evidence (metrics, outcomes, specifics), then invitation (projects, research, contact). Every element competes for space against a background that absorbs noise; only signal survives. This system rejects interchangeable dark-tech SaaS aesthetics, neon-on-gradient glass compositions, and any layout where the name could be swapped out and the design would still make sense.

The system is precise, confident, and curious. Confidence comes from demonstrated outcomes expressed in specific numbers, not from font weight or decoration. Curiosity is visible in the breadth of domain: the same person who built a PostgreSQL security database also designed a MAML-based UAV deployment system. The design does not flatten this into a generic skill list; it lets the range read as connected, methodical thinking.

**Key Characteristics:**
- Full-palette color strategy: six named accent roles, each tied to a domain or content type, used deliberately
- Dark theme mandated by the physical scene (screen-based, focused work, dim ambient context)
- Sora (editorial weight, tight tracking) paired with JetBrains Mono (instrument readout, metadata)
- Tonal elevation rather than shadows: depth through layered rgba overlays on a near-black base
- Motion is reveal-based and directional: content enters; it does not perform
- Three.js GLSL star field canvas as the deepest surface layer; all UI floats above it

## 2. Colors: The Signal Palette

Six precision-named accent roles against a void base. Each accent maps to a specific domain or section; color functions as a wayfinding signal, not decoration.

### Primary
- **System Active Green** (`#4ADE80`): The primary signal. Used for active status indicators, the hero name mark, primary CTA buttons, scroll progress bar, and the reveal cursor dot. When this color appears, something is live, confirmed, or actionable. Used in approximately 15-20% of any screen; its presence means something.

### Secondary
- **Telemetry Blue** (`#38BDF8`): Research, academic, and data-context signals. Used for the secondary ghost button hover state, research section accents, education and degree metadata, and skill tags. Cooler than the green; connotes analysis over action.

### Tertiary
- **Thermal Orange** (`#FB923C`): Focus areas and autonomous systems work. Used as the color role for UAV/autonomy focus metadata in the hero panel and ML-related content. The warmest accent; implies computation under load.
- **Deep Field Violet** (`#A78BFA`): Academic depth and long-form work. Used in the experience timeline for the Senior Design and MLOps project. Connotes sustained, systematic effort.
- **Sensor Teal** (`#2DD4BF`): Current role and applied work in production. Used for the current internship role in the experience timeline and certifications section. Distinct from the blue; reads as real-time and operational.
- **Capability Pink** (`#F472B6`): Skills and capabilities inventory. Used exclusively in the capabilities/skills section eyebrow label. The most visually distinct accent; marks the breadth dimension of the profile.

### Neutral
- **Void Black** (`#04040A`): The root background and deepest surface. Barely tinted toward cool violet; never pure black.
- **Deep Signal** (`#080814`): Second background layer. Used in the hero right panel and card backgrounds. Adds depth without a hard edge.
- **Near Surface** (`#0C0C1C`): Tertiary surface, rarely used directly; implied by section wash overlays.
- **Signal White** (`#D0D0E0`): Primary body text and all high-importance prose. Cool-tinted; reads cleanly against the void.
- **Muted Readout** (`#9090A8`): Secondary body text, descriptions, subtext. Readable but recedes behind Signal White.
- **Dim Channel** (`#4A4A62`): Metadata labels, timestamps, divider text. Minimum viable readability; used where information should be present but not compete.
- **Border Default** (`rgba(255,255,255,0.07)` / `#FFFFFF12`): Dividers, card edges, section rules. Near-invisible; adds structure without weight.

### Named Rules
**The Role Signal Rule.** Each of the six accent colors maps to a specific domain role and section. System Active Green is not "the brand color used everywhere." It is the signal for active, confirmed, actionable states. Telemetry Blue is not "a blue." It is the research and data-context color. Using any accent outside its mapped role breaks the wayfinding system.

**The Rarity Doctrine.** System Active Green appears at active indicators, hero name mark, primary CTA, and scroll bar. That is its complete list. Adding it to decorative elements, hover states it does not own, or any element not in that list dilutes it into noise.

## 3. Typography

**Display Font:** Sora (Google Fonts, weights 300-800)
**Body Font:** Sora (same family; weight and size carry all hierarchy)
**Label/Mono Font:** JetBrains Mono (Google Fonts, weights 400-700)

**Character:** Sora is a clean geometric sans with slightly more warmth than a pure grotesque; it carries weight contrast well enough to build a full hierarchy within a single family. JetBrains Mono provides the instrument-readout register: monospaced, uppercase, spaced out. The pairing is editorial above and technical below; the same split a field notebook makes between the scientist's prose and their data annotations.

### Hierarchy
- **Display** (700, `clamp(68px, 9.5vw, 124px)`, line-height 0.88, letter-spacing -0.04em): Hero name only. Compressed leading creates mass. The tracked-in spacing is intentional at this scale.
- **Headline** (700, `clamp(28px, 3.5vw, 34px)`, line-height 1.15, letter-spacing -0.03em): Section-level statements. Used for the origin section pull quote and the contact section heading. Copy at this size is always a specific claim, not a category label.
- **Title** (600, 15-17px, line-height 1.3, letter-spacing -0.01em): Card headings, project names, job titles within timeline cards. The 1.25+ ratio between Title and Body is maintained through weight contrast (600 vs 400), not size alone.
- **Body** (400, 16-17px, line-height 1.75-1.8): All prose. Maximum line length held at 440px (approximately 65ch at 16px). Never justified; always left-aligned.
- **Label** (JetBrains Mono 400, 9-11px, letter-spacing 0.07-0.10em, uppercase): All metadata: dates, section numbers, role tags, technology names, nav links, button text. Monospaced so columns of numbers align naturally. The uppercase + tracking treatment marks these as annotations, not running prose.

### Named Rules
**The Mono-for-Data Rule.** JetBrains Mono is used for everything that functions as a data label: dates, metrics, technology tags, nav links, button text, eyebrow labels, issuer badges, timestamps. Sora handles all prose. Never mix them within a single semantic unit.

**The Compression Rule.** Display type compresses to line-height 0.88. Headline type lands at 1.15. Body opens to 1.75. Spacing is not uniform; it reflects the density of information at each level.

## 4. Elevation

This system is flat by default. Surfaces are differentiated by tonal value (rgba overlay depth), not by shadow. There are no ambient box-shadows on resting components. The approach is appropriate for a UI where the background is a moving three-dimensional star field; box-shadows would fight the canvas, not complement it.

Depth is established in two ways: (1) The section wash overlays (`rgba(4,4,10,0.45)` through `rgba(18,8,4,0.68)`) create tonal separation between sections without discrete layer edges. Each section has a unique wash value, so the page reads as a sequence of environments rather than a flat scroll. (2) Card backgrounds use `rgba(255,255,255,0.02-0.025)`, which is perceptible against the void but disappears if a stronger background is placed behind the content.

### Shadow Vocabulary
- **Hover lift** (`0 20px 48px rgba(0,0,0,0.5)`): Applied only on `.tilt` interactive cards during the 3D perspective transform hover. The shadow grounds the tilted element. It appears as a response to interaction; it does not exist at rest.

### Named Rules
**The Flat-at-Rest Rule.** No component carries a box-shadow in its resting state. Shadows appear only as a consequence of the hover tilt transform. Adding a resting shadow to any new component breaks the system's elevation logic and conflicts with the star-field canvas.

## 5. Components

### Buttons
Minimal instrument panel: the button is a state indicator, not a focal decoration.

- **Shape:** 6px radius (rounded.sm) — rounded enough to feel intentional, square enough to read as a control.
- **Primary:** System Active Green background (`#4ADE80`), black text (`#000000`), 11px uppercase Space Mono, padding 11px 24px. Opacity drops to 0.82 on hover; no transform, no shadow. The button does not leap; it confirms.
- **Ghost:** Transparent background, `border: 1px solid rgba(255,255,255,0.07)`, Muted Readout text. Hover shifts border and text to Telemetry Blue (`#38BDF8`). Transition is 0.2s on color/border-color.
- **Credential link ghost:** Same construction as ghost, but border and text use the relevant accent color at 27% opacity for the border. Used only in expandable certification cards.

### Tags / Chips
- **Style:** `rgba(accent, 0.07)` background, `1px solid rgba(accent, 0.13)` border, 4px radius, 9px uppercase Space Mono, accent color text. Size is fixed; text never wraps.
- **State:** Tags are display-only. No selected/unselected variants; filtering is not a current pattern.
- **Accent inheritance:** Each tag inherits the accent color of its parent context (green for active work, blue for research, teal for current role, etc.).

### Cards / Containers
- **Corner Style:** 8px (md) for standard cards; 10px (lg) for certification and affiliation cards.
- **Background:** `rgba(255,255,255,0.02)` resting; `rgba(255,255,255,0.035)` on hover. The delta is subtle by design.
- **Shadow Strategy:** None at rest. See Elevation section.
- **Border:** `1px solid rgba(255,255,255,0.07)` at rest. On expanded or active state, border shifts to `rgba(accent, 0.27)`. This is the primary state indicator for expandable cards; no other visual affordance is needed.
- **Internal Padding:** 18-22px for standard cards; 20-28px for featured or larger surface cards.
- **3D Tilt:** Interactive cards use `perspective(900px) rotateX/rotateY` on mouse move, bounded at 5-6 degrees. Transition is 0.25s ease. Touch devices (`@media (hover: none)`) receive no tilt effect.

### Eyebrow Labels (EL component)
The primary section wayfinding element. Not a standard component type, but used on every section.

- **Structure:** An 18px horizontal rule (accent color, 50% opacity) followed by 10px uppercase Space Mono text in the accent color.
- **Purpose:** Marks section entry. Each section uses a distinct accent color for its eyebrow label, reinforcing the Role Signal Rule.
- **Scan animation:** A CSS sweep gradient (`rgba(accent, 0.07)`) passes left-to-right on a 4s infinite loop. Subtle; adds liveliness without distracting.

### Navigation
- **Resting:** Transparent background, no border. Height 60px.
- **Scrolled (>80px):** `rgba(4,4,10,0.9)` background, `backdrop-filter: blur(20px)`, `1px solid rgba(255,255,255,0.07)` bottom border. Transition 0.4s cubic-bezier(0.16,1,0.3,1).
- **Links:** 11px uppercase Space Mono, Dim Channel color, hover shifts to System Active Green. Letter-spacing 0.06em.
- **Mobile:** Hamburger (three 1.5px bars, 22px wide) reveals a full-width dropdown. Links are 13px, separated by 1px rgba(255,255,255,0.05) borders.

### Timeline (Experience)
- **Structure:** Vertical spine — 1px line, `linear-gradient(to bottom, rgba(accent, 0.4), rgba(255,255,255,0.06))`. Circle nodes are 12px diameter, `border: 2px solid accent`, background fills to accent color for the active role.
- **Cards:** Flat, no border, left-padded at 36px from the spine. Role title at 16px Space Grotesk 600, company at 12px Muted Readout, date and location at 10px Dim Channel Space Mono.
- **Active state:** Solid node fill + glow box-shadow (`0 0 12px accent`). One active node at a time.

### Animated Metrics
- **Display:** 30px Space Grotesk 700, Signal White. Label at 9px uppercase Space Mono, Dim Channel.
- **Behavior:** Counts up from 0 on scroll entry using a cubic ease-out curve (1400ms duration). Supports decimal precision and unit suffixes parsed from the value string.
- **Usage:** Research and projects sections only. Not a general decorative element.

## 6. Do's and Don'ts

**Do:** Lead with specific outcomes. "72.8% zero-shot UAV deployment via MAML across 1,000+ simulated environments" earns credibility. "AI/ML engineer with experience in autonomous systems" does not. Every piece of copy that can hold a number should hold a number.

**Do:** Use Space Mono for all metadata, annotations, dates, and technology labels. The mono register signals that this is a data point, not prose.

**Do:** Allow section spacing to vary. The section wash overlays create environmental transitions; the spacing variation (80px vs 100px padding) reinforces those transitions. Uniform padding collapses the page into a flat scroll.

**Do:** Use border state changes (from `rgba(255,255,255,0.07)` to `rgba(accent,0.27)`) as the primary expanded/active indicator on cards. No icons, no color fills, no background overhaul needed.

**Do:** Respect `prefers-reduced-motion`. All transitions and reveals are already wrapped in the media query. New additions must follow the same pattern: disable transition, set opacity to 1, remove transforms.

**Don't:** Add gradient text (`background-clip: text`). The palette has six distinct accent colors; use one solid color for emphasis. Weight or size should carry any additional hierarchy.

**Don't:** Use `border-left` or `border-right` greater than 1px as a decorative accent stripe on any card, callout, or list item. The existing timeline uses a full vertical spine, not a side stripe. Maintain that distinction.

**Don't:** Apply glassmorphism (`backdrop-filter: blur`) to cards or content panels. It is used in one place: the scrolled nav bar. It functions there because the nav must separate from content below it during scroll. Applying blur to cards competes with the Three.js star field and reads as decorative rather than structural.

**Don't:** Introduce a new accent color. The six accent roles are a closed set. Adding a seventh breaks the Role Signal Rule and makes the wayfinding system ambiguous.

**Don't:** Use `border-left` or `border-right` as accent decoration anywhere. Use background tint, full border activation, leading number/icon, or nothing.

**Don't:** Flatten the type scale. Body (16px/1.75) and Label (10px uppercase/0.12em tracking) need to coexist on cards. If those two roles look similar, the hierarchy has been compressed and the instrument-panel readability is gone.
