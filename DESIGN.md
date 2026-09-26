---
version: alpha
name: Handrail — An agreement brought to life
description: A sculptural, readable proposal whose folded paper becomes its deal structure.
colors:
  primary: "#21364B"
  secondary: "#627B8D"
  tertiary: "#A2ADB6"
  neutral: "#EDF0F2"
  surface: "#FFFFFF"
  surface-muted: "#E3E8EC"
  on-surface: "#20272D"
  on-muted: "#53606B"
  border: "#C7CED4"
  focus: "#21568C"
  success: "#305D4B"
  warning: "#79560D"
  error: "#A53131"
typography:
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 104px
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: -3px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: -1px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  page: 64px
rounded:
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 16px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: 16px
  page-background:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
  focus-ring:
    backgroundColor: "{colors.focus}"
    textColor: "{colors.surface}"
---

# An agreement brought to life

## Subject and audience

This is Brent Showalter's unsigned Handrail compensation and employment proposal. Josh should understand the structure in a minute and be able to inspect every clause immediately. Engineering reviewers should see an original, well-tested implementation. No claim of acceptance, actual employment, or proven business results is implied.

## Concept

One folded paper object supplies the entire visual language. Its three creases create natural areas of light and shadow; their changing angles express commitment and conditionality. It opens into the two compensation paths, stretches into the activation timeline and settles into the readable contract. The object is purpose-built procedural geometry, not a borrowed hero asset or animated background decoration.

## Composition

Desktop opens with left-aligned display typography occupying roughly half the viewport and a large folded paper sculpture balanced at the right. The object can cross the invisible column boundary but never obscure essential text or controls. A quiet header names Brent and Handrail; a persistent direct contract link remains available. Under the opening, compare the two pathways at equal visual weight. Use broad full-width sections with generous breathing room, not a repeated card grid.

Mobile stacks headline, a shorter sculptural stage, then immediate deal summary. Core facts are fully rendered before animation loads. No horizontal scroll section. No forced wait or loader before reading.

## Material and color

Cool white paper (#FFFFFF), cool gray environment (#EDF0F2), graphite text (#20272D), deep navy (#21364B), brushed-silver reference (#A2ADB6) and muted blue-gray (#627B8D). Natural light supplies depth. No emissive/bloom material, neon, rainbow chromatic effects or generic gradients. Brushed silver appears sparingly in the physical scene, not as decoration on every control.

## Typography

IBM Plex Sans is locally hosted. Headings use regular weight and carefully chosen line breaks; body text stays within 68 characters. Display tracking is a project-specific exception to the global default, justified by the oversized composition. Contract text is 17–18px with 1.65 leading and clear numbered clauses for reference. No decorative all-caps eyebrows, fake technical metadata or gratuitous monospace labels.

## Motion storyboard

- Opening: a single short settle after content paints. No continuous idle spin or floating loop.
- Scroll 0–1: camera and folds respond to scroll position; paper opens from a compact zigzag into two readable planes. Path labels stay in HTML.
- Path comparison: 15/5 and 20/5 are present simultaneously. Hover may select emphasis, but does not hide contract differences.
- Timeline: the same folds flatten into a horizontal visual measurement on desktop; mobile uses a vertical timeline. Milestones are relative to execution, never a ticking expiry date.
- Collections: an understated flow shows payment received, applicable percentage and commission paid within 30 days. Examples are explicitly illustrative.
- Contract: the scene yields to normal document reading. No pinning inside the full agreement.

Use GSAP for one coordinated scene timeline and Lenis on desktop only. Native touch and reduced-motion scrolling remain available. Reduced-motion starts static, removes pinning and provides the exact same content. Provide a persistent motion toggle and static fallback if WebGL is unavailable. Pause rendering while offscreen or hidden, cap pixel ratio and avoid postprocessing.

## Accessibility and performance

Semantic headings, landmarks, ordered clause references, native anchors and real links. Essential information is never canvas-only. Focus visible, minimum 44px primary controls, text contrast AA, reflow at 320px and 200% zoom, high-contrast support, no hover-only behavior. JavaScript-disabled pages retain the entire proposal and agreement. Lazy-load the scene without shifting layout.

## Sources and originality

Lusion (https://lusion.co/) informs physical material/lighting craft. Exat (https://exat.hottype.co/) informs scale and pacing. Obys' design case study informs coherence across type, motion and structure. These are reference principles only; no site assets, logos, fonts or proprietary code are copied. GSAP uses its no-charge commercial license; open-source dependencies keep their own licenses.

## Design acceptance

Inspect desktop/mobile compositions and the opening-to-path transition before full implementation. Reject arbitrary particle effects, conventional SaaS cards, excessive pinned scrolling, illegible contract text or a disconnected gallery of effects. Record critiques against actual rendered screenshots, never solely a prose description.
