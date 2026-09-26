---
version: alpha
name: Handrail — A beginning together
description: A hinged HTML trifold introducing a partnership, with Handrail's warm editorial identity.
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
    fontSize: 132px
    fontWeight: 700
    lineHeight: 0.93
    letterSpacing: -9.9px
  headline-md:
    fontFamily: Inter Variable
    fontSize: 68px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -4.08px
  body-md:
    fontFamily: Inter Variable
    fontSize: 34px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.68px
  label-md:
    fontFamily: Inter Variable
    fontSize: 30px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0px
  introduction:
    fontFamily: Playfair Display
    fontSize: 37px
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

# A beginning together

## Direction and acceptance

The user approved Telescope's zoom transitions, Igloo's continuous camera journey, Exat's typographic confidence and Stripe Press's document presentation, then requested Handrail's actual branding. Those reference approvals persist. After reviewing the published flat flyer, the user described it as an improvement but wanted more dynamic movement on an actual trifold and removal of decorative symbols.

This revision uses three hinged HTML panels with front and back faces. Its finished visual treatment has not yet been reviewed by the user. Reference approval, implemented behavior, automated checks and final visual acceptance remain separate claims. Publication of this revision is pending; the live flat-flyer source `ad6fa8b` and its receipts are historical evidence for that edition.

The earlier sculpture, paperclip, neon and interim cobalt/Archivo treatments are not current design sources. See [brand sources](docs/brand-sources.md) and [redesign research](docs/redesign-research.md).

## One physical document

The actual proposal is a trifold built from semantic HTML. A center panel anchors two independently hinged wings, each with a readable front and a back face. CSS perspective, transform origins and backface visibility establish the document's depth; GSAP ScrollTrigger coordinates hinge opening and camera travel from native scrolling.

The opening presents a folded cover, then opens the wings in sequence. Travel between sections uses perspective and panel movement; each reading hold brings its target face flat to the viewer. The difference must be visible on the document itself. Transforming the entire sheet while its wings remain rigid does not satisfy this direction.

The desktop sheet uses three 900px panels; the mobile camera artboard uses 760px panels. Heights follow the measured face content. These are native artboard dimensions, not fixed viewport widths. The camera must fit each reading target between the persistent header and controls. Mobile separates the compensation paths and rationale when needed for legibility.

Ordinary reading removes the hinges and perspective and puts the same essential content into normal responsive flow. Decorative backs are excluded from the accessible reading content. No essential term may be available only on a back face, in an image or during a transition.

## Handrail identity

Keep warm paper `#fbfaf7`, near-black ink `#1a1816`, rust `#c8502a`, warm ground `#ebe4d8` and muted brown `#6b6258`. The rust panel gives the collections story visual emphasis. These implementation values reflect the supplied materials and official website; they are not represented as a formal published brand standard.

Use the unchanged official PNG at `public/handrail-logo.png`, preserving its proportions and artwork. Inter Variable supplies the strong sans-serif typography; locally served Playfair Display italic provides the short introduction's serif contrast. Typography tokens describe native artboard sizes, while `src/styles/global.css` controls actual responsive and reading-mode values.

Remove decorative Unicode arrows, emojis and standalone ornamental symbols. Navigation uses clear text and functional controls. No paperclip, glow, particles, generic card grid or invented technical labels. Physical interest comes from the printed composition, real hinges, front/back faces and camera movement.

## The beginning of a partnership

The headline is **Let's grow Handrail.** The cover presents a practical way to bring Brent on board, with room for his contribution to grow. New business is the starting point; the proposal must not define him as sales-only forever or promise a specific future role.

Keep the economic structure prominent: **No base salary. Commission follows collected revenue.** Handrail receives the customer payment before the corresponding commission. Customer installments produce matching commission installments. Benefits are requested and remain a separate company cost.

Hire first proposes 15% of collected build fees plus 5% recurring. Client first proposes 20% plus 5%, rewarding the business that enables bringing Brent on board. That rate applies to the triggering client and all future credited sales under the relationship. The 90-day window limits the proposed hiring commitment; no client and no hire ends that commitment.

The closing explains that the parties can shape Brent's contribution around what helps Handrail grow. It does not name specific future positions or expose private financial circumstances. The $10,000 / $2,000 / $8,000 receipt is an illustration; retained cash is before delivery, benefits and other costs, not profit or a guarantee of positive cash flow.

This remains a proposal for discussion. Handrail prepares the final contract after the business terms align. The notes and PDF preserve seven concise sections without legal boilerplate, statutory caveats or a signature flow.

## Motion and reading controls

Use one scroll owner and one coordinated timeline. Scrolling forward opens and traverses the trifold; reversing scroll reverses both camera and hinge movement. Chapter buttons target stable reading holds. A persistent Read normally / Take the tour control, system reduced motion and no-JavaScript viewing preserve access to the content.

The focused reading face must be flat, fully visible and readable at each hold. Neighboring wings may retain a shallow angle if they do not cover that face. Perspective and hinge activity belong to transitions, not a constant idle animation that interrupts reading.

Preserve keyboard navigation, visible focus, the skip link, notes access and PDF download. Focusing a link on an offscreen face must first restore a usable reading context. Returning from notes must restore a working tour rather than a stale transform.

## Verification boundary

New receipts must demonstrate independent left and right hinge movement under actual wheel input, front/back behavior, reversible opening, perspective travel and flat readable holds. Tests that inspect only the sheet's root scale/translation cannot establish those behaviors.

Render and inspect the folded cover, both opening stages and every reading hold at desktop and mobile widths. Verify text size, framing, native touch input, keyboard navigation, ordinary reading, reduced motion, JavaScript-disabled reading and PDF consistency. Regenerate and inspect the PDF and social image when their content or composition changes.

The preceding flat flyer's 19 browser passes and Lighthouse scores do not validate this trifold revision. Current checks, remaining issues and publication belong in IMPLEMENTATION.md and the evidence artifacts. Do not claim current performance or test success before those receipts exist.
