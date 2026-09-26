# Redesign research — references approved

Research date: September 26, 2026. The user subsequently approved this direction. Implementation now follows DESIGN.md; the research observations below remain a record of the prior pass.

## User direction

- Dynamic scrolling means zooming into the actual flyer and moving across its content, with reversible camera travel controlled by scroll position.
- Remove the paper clip and reject decorative geometry beside conventional sections as the main experience.
- Establish a visual direction from real sites the user approves before building again.
- This is a proposal for review and negotiation. Handrail will write the final contract. Remove legal drafting and statutory caveats from the presentation; do not represent proposed terms as accepted.
- Lead with no proposed base salary and commission paid as customer payments are collected. The commercial argument is that compensation follows revenue instead of requiring an advance commission payment.
- Explain the client-first premium as a reward for originating the business that enables the relationship. Keep 15% build / 5% recurring for employment first, and 20% / 5% for client first, applying to future credited sales under the chosen path. Preserve the 90-day proposal concept and benefits request without expanding them into invented agreed terms.

## Message hierarchy to design around

Draft headline: **No base salary. Commission paid from collected revenue.**

Draft supporting copy: “A proposal to grow Handrail's sales with compensation tied to money received. If customers pay in installments, my commission follows those installments.”

Draft premium rationale: “If I bring in the client that makes hiring possible, the higher commission reflects the business I created and the risk I took to create it.”

Illustrative flow: customer pays -> Handrail receives payment -> applicable commission is paid. For $10,000 of collected build fees, commission is $1,500 or $2,000; the remaining $8,500 or $8,000 is before delivery costs, benefits, taxes and other expenses. Label examples as illustrations and keep build and recurring revenue distinct. Do not imply the remaining amount is profit or that the structure guarantees company-wide positive cash flow.

Tone: collaborative proposed structure, open to adjustment. No signature flow or full legal agreement. Do not publish private company finances or portray a private company financial problem as public marketing copy.

## Shortlist for user approval

| Reference | What to inspect | Potential application | Evidence |
| --- | --- | --- | --- |
| [Telescope](https://telescope.fyi/) | Scroll through the imagery and the “Zoom in with Telescope” sequence. | Strong shift from overview into detail, coordinated scale and framing. Use that principle to enter and navigate the flyer. | Live Chrome navigation, scroll input and screenshots inspected. |
| [Igloo](https://www.igloo.inc/) | Scroll from the opening scene; camera viewpoint changes around one continuous environment. | Camera continuity and purposeful movement between viewpoints. The proposal remains one spatial composition. | Isolated Playwright wheel-input screenshots inspected. Scene motion verified; some headless text rendered poorly. Not a full compatibility audit. |
| [Exat / Hot Type](https://exat.hottype.co/) | Opening oversized type, specimen layouts and changes of scale. | Typographic character, intentional composition and the relationship between display and reading sizes. | Live opening composition inspected in Chrome. Used as an art-direction reference, not proof of the desired camera model. |
| [Stripe Press](https://press.stripe.com/) | Select a book and examine how the object transitions into its reading view. | Credible physical document treatment, material detail and readable supporting copy. | Live book selection and before/after screenshots inspected. Its selection interaction is not being represented as the exact desired scroll behavior. |

Recommendation to discuss: Telescope's overview-to-detail transitions and Exat's typography, composed as one readable flyer; Igloo is the camera-continuity reference and Stripe Press is the material/reading reference. The user approved all four references and this recommendation on September 26, 2026. Copy no logos, assets, premium fonts or proprietary site code.

## Concrete tools and reusable studies

- **[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)**: preferred existing tool for one pinned, scrubbed timeline controlling flyer scale, position and perspective. Already installed. [Free commercial use under a custom license](https://gsap.com/standard-license/), not an MIT/open-source claim.
- **[Motion](https://motion.dev/docs/scroll)**: credible alternative for scroll-linked transforms with sticky positioning. [Core is MIT](https://github.com/motiondivision/motion/blob/main/LICENSE.md). Use instead of GSAP if choosing an entirely open-source animation stack.
- **[Lenis](https://github.com/darkroomengineering/lenis)**: MIT, optional smoothing. Not the camera choreography. Use one scroll owner; add smoothing only if it improves the actual prototype.
- **[Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)**: [MIT](https://github.com/radix-ui/primitives/blob/main/LICENSE), unstyled accessible interaction components if review dialogs or tabs are needed. Native links/buttons may be sufficient. A component library does not supply this site's art direction.
- **[Three.js](https://threejs.org/), [React Three Fiber](https://github.com/pmndrs/react-three-fiber), [drei ScrollControls](https://github.com/pmndrs/drei/blob/master/docs/controls/scroll-controls.mdx)**: optional true 3D route if approved references justify it. Zooming and panning crisp HTML/SVG content does not itself require WebGL. Do not install another scene/scroll controller speculatively.
- **[Codrops Telescope zoom demo](https://tympanus.net/Tutorials/TelescopeZoom/)**: live-tested overview and zoomed states. [Tutorial](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/) and [public source with MIT declaration](https://github.com/joffreysp/telescope-zoom). Study the timing and transform technique; third-party imagery and GSAP retain their own licensing.
- **[Codrops typography studies](https://tympanus.net/codrops/2023/01/18/on-scroll-typography-animations/)** and [MIT source](https://github.com/codrops/OnScrollTypographyAnimations): reusable typographic motion techniques, to be chosen only after visual approval.

No paid generator, cloud browser account or credential setup is needed to prototype this direction.

## Approval and next acceptance evidence

1. User selects the references and identifies the desired motion and visual qualities. No implementation before this answer.
2. Design the actual flyer with the revised commercial copy. It must work as a static composition before adding movement.
3. Build a short, reversible opening prototype: full flyer -> zoom into its first-page headline -> pan to the customer-payment/commission sequence. Review the real scroll interaction on desktop and phone before filling out the page.
4. Continue only with an approved visual/motion direction. Preserve sharp readable text, pause time at each idea, touch control, chapter navigation and a simple reading/reduced-motion mode.
5. Functional tests prove function. User visual review determines whether the design meets the brief. Do not describe a functional pass as aesthetic acceptance.

## Research verification

The read-only lifecycle router classified this research-only task outside UI implementation and returned no blockers. `dev-doctor` passed with unrelated contract-file warnings. Source and tooling recommendations were checked against live sites, official documentation and repository license declarations. The prior visual-evidence preference retrieved from Codex memory already exists in Brain2's `Wiki/Workflows/agentic-ui-qa-global-standard.md`; no duplicate knowledge write was necessary.


## Brand direction and implementation checkpoint

After approving the references, the user requested a blend of Handrail’s careers page, sample MOU and supplied pricing/one-pager documents, preserving their shared vibe. The implementation uses the official wordmark, warm paper, rust, Inter and Playfair Display. See docs/brand-sources.md for provenance and IMPLEMENTATION.md for current verification. The flyer camera and proposal copy are implemented; reference approval does not imply the user has accepted the finished visual result.
