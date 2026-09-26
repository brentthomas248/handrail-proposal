# Implementation checkpoint — hinged trifold revision

## Current state, September 26, 2026

The current source implements an actual HTML trifold: three hinged panels, front and back faces, sequential opening and perspective camera travel. Reading holds flatten and frame the active face. Native scrolling drives the reversible GSAP timeline. Desktop has six stops; mobile has nine. Decorative Unicode arrows, ornamental symbols and the paperclip are removed.

The proposal now introduces the beginning of a partnership and helping Handrail grow. New business is the starting point, with room for Brent's contribution to develop around the company's needs. It names no specific future position and discloses no private financial circumstances. The official Handrail wordmark, warm paper/rust palette and Inter/Playfair typography remain.

The Telescope, Igloo, Exat and Stripe Press reference approvals persist. The finished trifold has not yet received user visual acceptance. Current local checks, PDF visual review and both performance runs have passed. Publication and hosted verification remain pending.

## Implemented

- Independent left and right DOM hinges with front/back faces, a folded cover, sequential opening and camera transitions. Numeric `scale3d` transforms keep the camera geometry consistent.
- Flat readable holds, chapter navigation, ordinary reading mode, persisted preference, reduced-motion override, keyboard focus handling, browser-back restoration and no-JavaScript reading.
- No base salary; commissions follow collected customer revenue and matching installments. Hire first proposes 15% build plus 5% recurring; client first proposes 20% plus 5% on the triggering client and all future credited sales. The 90-day opportunity and benefits request remain unchanged.
- Canonical partnership copy and seven sections of negotiable business notes in `src/content/proposal.ts`. HTML, generated Markdown and the PDF share that source. Handrail prepares the final contract. The existing `agreement/` route and PDF filename preserve links.
- A reusable DealPath component and three Storybook states. Hinge and camera behavior are verified at the app level. No WebGL, Three.js, React Three Fiber, Lenis, calculator, backend or signature flow.

## Current local evidence

| Check                                | Observed result                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check`                         | 22 files; zero errors, warnings or hints                                                                                                                                                           |
| `pnpm test`                          | Four content and consistency tests passed                                                                                                                                                          |
| `pnpm build:release`                 | Two static routes and current proposal PDF generated; Markdown consistency passed                                                                                                                  |
| `pnpm pdf:check`                     | Introduction, seven ordered sections, 15 paragraphs and endnote match canonical content                                                                                                            |
| `pnpm test:e2e`                      | 19 tests passed against the numeric `scale3d` build, including actual unfolding of both hinges, reverse scrolling, opening framing, flat readable holds and reading/navigation/accessibility paths |
| `pnpm capture`                       | 24 chapter images and 15 intermediate scroll samples across desktop, 390px and 320px views; zero errors, warnings or failed requests                                                               |
| Captured text                        | Minimum sampled reading-target text size: 14.05px                                                                                                                                                  |
| `pnpm build-storybook`               | Passed with a workshop-only large-chunk warning                                                                                                                                                    |
| `pnpm test:components`               | Three checks; zero axe violations                                                                                                                                                                  |
| Storybook MCP and component coverage | Live endpoint readiness and component-state validation passed at 20:33 UTC                                                                                                                         |
| `pnpm format:check`                  | Passed                                                                                                                                                                                             |

Capture evidence is under `qa-artifacts/trifold/`; rendered PDF pages are under `qa-artifacts/trifold-pdf/`. Both regenerated PDF pages were visually inspected: a clean, readable two-page layout with complete independent text comparison. Poppler still emits its known Type 3 bounding-box warning; rendered output and canonical text are correct. Existing flat-flyer captures are historical and are not used to establish current hinge behavior.

Current local Lighthouse runs scored 100 in performance, accessibility, best practices and SEO on both mobile and desktop. Mobile measured LCP 1656.355ms, TBT 0ms and CLS 0.0227967504; desktop measured LCP 368.8312ms, TBT 0ms and CLS 0.0191034406. These are current trifold laboratory measurements, not the preceding edition's scores. They do not establish field INP or physical-device performance.

## Remaining closeout

1. Reconcile compact evidence with this source, publish the verified static build and run fresh hosted trifold checks, asset comparison and PDF verification.
2. Provide the public URL for user review. Reference approval and local tests do not substitute for acceptance of the finished design.

Profile README and pin changes remain separate and unapplied.

## Historical publication

The existing [public URL](https://brentthomas248.github.io/handrail-proposal/) currently serves the preceding flat-flyer edition, source `ad6fa8b`, static commit `05eaf7dc6478f6203c554bd40335c2602de4c793`. Its [Pages run 36268461522](https://github.com/brentthomas248/handrail-proposal/actions/runs/36268461522), 19 hosted browser passes and asset comparison describe that edition only. Publication of this trifold revision is pending.

Pages publishes the root of `gh-pages` with a `.nojekyll` marker. Optional Actions templates remain inactive under `docs/github-actions/` because the current OAuth credential lacks workflow-write permission. Local verification precedes publication; GitHub's Pages job establishes deployment rather than a remote run of project tests.

## Evidence boundaries

The user approved the local workflow. Cloud generation, Stagehand semantic QA and Browserbase hosted replay remain omitted. Full global lifecycle certification is not claimed; static-app policy/token-scanner limitations and unperformed manual VoiceOver, physical-device and field-performance checks remain explicit.

Raw reports and screenshots stay in ignored `qa-artifacts/` and `test-results/`. Compact receipts are public. Private company finances, correspondence and source research remain outside this repository. No additional credentials or profile changes are needed for this release.
