---
version: alpha
name: Handrail — A beginning together
description: A continuous Z-fold paper journey introducing a partnership, with Handrail's warm editorial identity.
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

## Current motion and material revision

The approved Telescope, Igloo, Exat and Stripe Press references and Handrail brand direction remain. The user reviewed the published trifold, found its motion choppy or stuck, and requested a true Z-fold plus realistic paper texture and lighting. This is a redesign of 3D geometry, choreography and material treatment; the business proposal and identity are unchanged.

The replacement motion and material implementation is complete and verified locally. The current 27-test browser suite exercises the whole scroll journey and its lifecycle, in addition to chapter endpoints. Final capture includes 24 chapter images, 15 opening samples, three full-journey videos and 1,143 frame records, with no console/network issues and a 13.48px minimum measured reading-text size. Independent rendered review and root’s native-window review support local closure of the selected findings. Supplementary WebKit geometry and native desktop review pass. The revision is published and all 27 hosted browser tests pass, including cold-load safeguards. The user’s visual acceptance remains separate. The durable plan, baseline findings and acceptance ledger are in [motion remediation](docs/motion-remediation.md).

The independent baseline found extended unchanged scene poses despite advancing progress, with a maximum stationary interval of 716.6ms, approximately 60fps and no long tasks. The revised probe measured a 50ms maximum and reduced same-pose samples during advancing rendered progress from 147/527 to 2/560. A baseline 390×844 to 390×780 resize rebuilt the journey and rebased scrollY from 3514 to 3232 while preserving the chapter; this was not evidence of a chapter change. The new six-height probe preserved scrollY at 2640 with zero rebuilds. These measurements isolate choreography and viewport-state handling from rendering throughput. Source approval, functional checks, rendered review and user acceptance remain separate claims.

## A true Z-fold

The actual proposal stays in semantic HTML with a center panel and two independently hinged wings, each with front and back faces. The wings rotate in the same signed direction around opposite hinge edges, placing them on opposite sides of the center sheet. This is accordion geometry, rather than two wings both folding inward.

The camera moves around the folded structure to face the reading panel. A reader sees an actual fold, a thin paper edge and correctly oriented text. Do not flatten the whole structure just to hide incorrect hinge geometry or show a mirrored back face. The selected panel faces the camera at exact chapter positions; neighboring geometry may retain its fold if it does not obscure the content.

Artboard measurements follow the panel content. They are not fixed viewport dimensions. The scene must frame relevant text between the header and controls at desktop and mobile widths. Narrow views can split the compensation paths and supporting copy into closer reading targets.

Ordinary reading removes perspective and hinges and puts the same essential content into responsive document flow. Decorative backs remain excluded from accessible content. No proposal term may be available only during a transition, in an image or on a decorative back face.

## Continuous choreography

Native scrolling is the input. A single GSAP ticker owns critically damped scene progress, including startup, so fast initial input cannot jump past a separate animation mapping. A pure sampled camera path coordinates position, orientation, hinges and logarithmic scale. Position and first derivative must be continuous at segment joins (C1 continuity); chapter navigation lands on exact readable poses.

The document responds throughout sustained scroll. Remove fixed blocks of dead scroll and stop/start easing at every chapter. Reading is paced by slower, gentle movement near important content and by the reader pausing, rather than spending scroll distance on a frozen frame. Reverse input traverses the same path smoothly.

After about 650ms of inactivity between reading regions, the scene may settle smoothly toward a readable position by animating native scroll. Wheel, touch or keyboard input immediately cancels that settling. It must never compete with sustained input or pull the reader back after they reverse direction. Verify pause, resume, rapid flick and cancellation through the whole journey.

Mobile address-bar height changes do not rebuild the journey or rebase the user's position; the stage keeps its initial stable height. Width/orientation changes remeasure the scene and preserve the same stop, falling back to its containing section across the mobile/desktop breakpoint. Both `touchend` and `touchcancel` release touch ownership, allowing settling and deferred resizing to resume. Height-only, breakpoint and canceled-touch scenarios have explicit browser regressions.

## Paper and light

The material should read as printed matte paper. Use subtle local grain at a believable physical scale, a thin visible edge, restrained crease shading and soft projected shadows. The surface stays quiet at normal reading distance; texture becomes apparent in closer views without turning into coarse noise or a patterned background.

Directional light responds coherently to face orientation. Folded and open panels receive different diffuse light, and crease/contact shadows change with the fold. Cast shadows belong to the surrounding surface and should soften with separation. Their purpose is to establish depth and weight, not add a dark halo around every panel.

Preserve sharp typography and contrast. Keep grain and illumination treatments from blurring, washing out or flickering over text. Use a matte finish: no glossy streak, metallic reflection, shiny card effect, bloom or continuously drifting decorative light. Verify front, back, edge and crease treatment across multiple orientations, not just the opening screenshot.

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

## Reading controls and access

Keep the Read normally / Take the tour control, chapter buttons, visible focus, skip link and direct notes/PDF access. Reduced motion and no-JavaScript viewing preserve complete content without the 3D journey. Keyboard focus on an offscreen link must restore a usable reading context; returning from notes must restore a functioning scene.

The selected reading face must be correctly oriented, framed and legible. A chapter button landing correctly is necessary but insufficient: the path into and out of it must remain coherent. User intent owns pause and reversal; neither fixed dwell regions nor idle settling may make the scene feel stuck.

## Verification boundary

The [remediation batch](docs/motion-remediation.md) defines the current findings and exact closeout expectations. Capture continuous wheel and touch-like input, rapid flicks, immediate reversal, pause/resume, idle-settle cancellation and resize sequences. Measure actual scene movement throughout active scrolling, both wing angles and logical progress before/after viewport changes.

Inspect material closeups and content-distinct transition frames or a video/replay, along with the whole forward/reverse journey. Verify Z geometry, correctly oriented faces, matte directional light, crease/edge depth, projected shadows and sharp text at normal reading distance. The independent browser reviewer must review current rendered motion; screenshots made only by an implementer or a passing endpoint suite do not settle these findings.

Re-run appropriate type/unit/build checks, canonical PDF consistency, current browser regressions, keyboard/accessibility paths and performance measurements. Preserve the documented WebKit screenshot-protocol limitation and use native-window evidence when that defect affects backface capture. No physical-device, manual VoiceOver or field-INP certification is inferred.

The user-approved local workflow remains in force. Credentialed Stagehand/Browserbase services stay omitted; do not fabricate semantic service receipts or claim full global certification. Record actual local evidence, independent review, unresolved concerns and current publication status before describing this revision as complete.

## Mobile contextual framing

The phone tour should present complete editorial ideas at a restrained reading distance. Keep related labels, bodies, qualifications and examples together; use at most eight reading scenes plus the folded overview for this proposal. Do not turn short paragraphs into separate full-screen macro shots. The full 90-day sequence and the partnership contribution story each form a coherent reading group.

The active group has breathing room inside the measured header/control boundaries. Neighboring print may remain visible around it, but spacing, quieter secondary typography and the camera composition must make the primary idea unambiguous. Peripheral cropping is acceptable only outside the active reading group. Avoid adding filters or opacity layers to simulate focus.

Refit the camera after available mobile viewport height changes while preserving native scroll and the current chapter. Reaching the final scene must remain possible after the viewport grows again. A selected rectangle fitting inside a nominal viewport does not prove all of its text lines or related content are readable.

Current evidence and the independent adversarial review belong in [the mobile framing remediation](docs/mobile-framing-remediation.md). Earlier screenshot and test-count approvals are historical, not substitutes for current visual judgment.
