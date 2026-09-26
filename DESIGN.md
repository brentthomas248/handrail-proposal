---
version: alpha
name: Handrail — Revenue first
description: A scroll-directed tour through a real proposal flyer, using Handrail's warm editorial identity.
colors:
  primary: '#C8502A'
  secondary: '#6B6258'
  neutral: '#EBE4D8'
  surface: '#FBFAF7'
  on-surface: '#1A1816'
  on-primary: '#FFFFFF'
  on-muted: '#6B6258'
  border: '#B6AA99'
  focus: '#1A1816'
typography:
  headline-lg:
    fontFamily: Inter Variable
    fontSize: 190px
    fontWeight: 760
    lineHeight: 0.84
    letterSpacing: -14.25px
  headline-md:
    fontFamily: Inter Variable
    fontSize: 64px
    fontWeight: 550
    lineHeight: 1.02
    letterSpacing: -3.328px
  body-md:
    fontFamily: Inter Variable
    fontSize: 31px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.682px
  label-md:
    fontFamily: Inter Variable
    fontSize: 23px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0px
  introduction:
    fontFamily: Playfair Display
    fontSize: 31px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 64px
  page: 90px
rounded:
  none: 0px
  control: 30px
  full: 9999px
components:
  page-background:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.on-surface}'
  proposal-sheet:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.none}'
  cash-flow-panel:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
  focus-ring:
    backgroundColor: '{colors.focus}'
    textColor: '{colors.surface}'
---

# Revenue first

## Direction and acceptance

On September 26, 2026, the user approved Telescope's zoom transitions, Igloo's continuous camera journey, Exat's typographic confidence and Stripe Press's document/reading quality. The user then requested the visual identity shared by Handrail's careers page, sample MOU and supplied pricing material. These are approvals of the references and direction. The implementation still requires the user's visual acceptance; functional tests do not supply it.

This specification replaces the rejected paper sculpture and clip, and the interim cobalt/Archivo treatment. They are historical work, not current design sources. Source provenance is recorded in [brand sources](docs/brand-sources.md) and [redesign research](docs/redesign-research.md).

## One document, multiple viewpoints

The flyer itself is the scene. Every headline, rate and diagram is HTML or CSS in one semantic document. Native scrolling drives a reversible GSAP ScrollTrigger timeline that changes the sheet's scale, translation and slight opening rotation. A measured fit-to-content camera gives each section a reading hold. There is no WebGL sculpture or separate decorative animated object.

The desktop composition is a 2200px landscape sheet with a twelve-column grid: headline at upper left, customer-payment diagram at upper right, two rate columns below, then the 90-day window and shared responsibilities. Hairline rules, one subtle fold and a restrained shadow provide the physical treatment. The opening presents the whole composition, then moves into the idea, cash flow, rate comparison, window and partnership.

Below 760px, the same content becomes a 760px-wide vertical sheet. Mobile camera stops separate the two rates and their rationale to make each stop legible. The native sheet sizes are artboard dimensions, not fixed viewport widths: the camera scales the document to fit. Reading mode restores natural page flow and responsive text instead of preserving the camera artboard.

## Handrail identity

Use warm cream `#fbfaf7`, near-black ink `#1a1816`, rust `#c8502a`, warm ground `#ebe4d8` and muted brown `#6b6258`. The rust field highlights the customer-payment sequence and the client-first rate. These are implementation values adapted from the supplied materials and official site, not a claim that Handrail publishes this exact token set as a formal brand standard.

The official Handrail logo is the unchanged PNG in `public/handrail-logo.png`. Preserve its proportions, artwork and tagline; scale it using CSS. Use it in the header, flyer masthead and proposal notes. Do not redraw it as text or add a fabricated brand symbol.

Inter Variable provides the strong sans-serif headline and readable body. Playfair Display regular italic appears in the short introduction, echoing the serif/sans-serif contrast in the supplied one-pager. Both fonts are served locally from installed OFL packages. The frontmatter typography tokens describe the native desktop artboard, while `src/styles/global.css` owns responsive and reading-mode sizes. They are documentation/export values; the runtime does not import the DTCG file.

Avoid neon, glow, ornamental particles, generic cards, invented technical labels and dramatic effects unrelated to the proposal. Visual interest comes from typography, composition and movement across the actual content.

## Commercial story

Lead with **No base salary. Commission paid from collected revenue.** Handrail receives customer money before the corresponding commission is paid. If the customer pays over twelve months, commission follows those installments. Benefits are requested and remain a separate company cost.

Hire first proposes 15% of collected build fees plus 5% recurring. Client first proposes 20% plus 5%, rewarding the business that makes hiring possible and applying to the triggering client and all future credited sales. The higher rate must not read as a one-client bonus. The 90-day window limits the proposed hiring commitment, and the responsibilities section explains the support needed to make the arrangement work.

The $10,000 / $2,000 / $8,000 collection example is an illustration. The retained balance is before delivery costs, benefits and other expenses, not profit or guaranteed positive cash flow. Public copy excludes private company finances, pipeline figures and client names.

This is a starting point for review and negotiation. Handrail prepares the final contract after the business terms are aligned. The direct notes route and PDF explain the proposal without legal boilerplate, statutory caveats or a signature flow.

## Motion and reading controls

The tour begins with an overview and uses one scroll owner. GSAP transforms the document; it does not independently smooth all browser scrolling. Chapter buttons navigate to the matching scroll positions. A persistent “Read normally” / “Take the tour” control changes mode. System reduced motion, no JavaScript or unavailable storage defaults to readable content without a required animation.

Preserve keyboard navigation, a skip link that opens reading mode, visible focus, direct notes access and PDF download. Do not hide essential text in canvas, images or hover states. The same proposal remains readable at narrow widths and when printed.

## Verification boundary

Acceptance evidence must include actual wheel-driven scale and translation, reversal, readable holds, mobile stop framing, chapter navigation and the plain reading path. Browser and accessibility receipts are maintained separately from this design specification. Source approval, implemented behavior, visual inspection and final user acceptance are separate claims. The social preview and PDF must be regenerated and inspected before publication whenever their source design changes.
