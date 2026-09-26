# Implementation checkpoint — hinged trifold revision

## Current state, September 26, 2026

The current source implements an actual HTML trifold: three hinged panels, front and back faces, sequential opening and perspective camera travel. Reading holds flatten and frame the active face. Native scrolling drives the reversible GSAP timeline. Desktop has six stops; mobile has nine. Decorative Unicode arrows, ornamental symbols and the paperclip are removed.

The proposal now introduces the beginning of a partnership and helping Handrail grow. New business is the starting point, with room for Brent's contribution to develop around the company's needs. It names no specific future position and discloses no private financial circumstances. The official Handrail wordmark, warm paper/rust palette and Inter/Playfair typography remain.

The Telescope, Igloo, Exat and Stripe Press reference approvals persist. The finished trifold has not yet received user visual acceptance. Current local checks, PDF visual review and both performance runs have passed. The trifold is published and hosted verification has passed.

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

Supplementary WebKit 26.6 checks passed 21 reading holds at 1440px, 390px and 320px, with zero browser errors or failed requests and three font-preload warnings. The screenshot API showed mirrored hidden backfaces; a minimal two-face card reproduced the capture defect independently of the app, consistent with [Playwright issue 21620](https://github.com/microsoft/playwright/issues/21620). Native-window inspection confirmed the closed cover, unfolded panels and cash face render correctly. No product CSS workaround was applied. This is separate from the Chromium suite and is not physical iOS verification; see [the WebKit receipt](agentic-ui/webkit-verification.json).

Current local Lighthouse runs scored 100 in performance, accessibility, best practices and SEO on both mobile and desktop. Mobile measured LCP 1656.355ms, TBT 0ms and CLS 0.0227967504; desktop measured LCP 368.8312ms, TBT 0ms and CLS 0.0191034406. These are current trifold laboratory measurements, not the preceding edition's scores. They do not establish field INP or physical-device performance.

## Remaining review

Publication and hosted verification are complete. Provide the public URL for the user's finished-design review; reference approval and technical checks do not substitute for that acceptance. Profile README and pin changes remain separate and unapplied.

## Current publication

The [public trifold](https://brentthomas248.github.io/handrail-proposal/) is published from source `a7fc658ce169e4dae1927a7fd3eae95f8c14f6c7` and static commit `92975026a1d4ae002716349bd1663e2335c3fdc1`. [Pages run 36270588222](https://github.com/brentthomas248/handrail-proposal/actions/runs/36270588222) succeeded. The 19-test Chromium suite passed against the public URL in 8.7 seconds. Homepage, notes, PDF, logo and social image returned HTTP 200 and matched the verified build byte-for-byte. The downloaded PDF independently matched the complete seven-section/15-paragraph proposal.

Hosted capture at 20:46:38.085 UTC produced 24 chapter images and 15 fold samples with zero errors, warnings or failed requests; minimum sampled reading-target text was 14.05px. Hosted partial-fold and mobile cash-front images were visually reviewed. These are fresh trifold checks, separate from the successful Pages deployment job.

The preceding flat-flyer source `ad6fa8b` and static commit `05eaf7dc6478f6203c554bd40335c2602de4c793` remain historical records. Their tests are not substituted for the current hosted checks.

Pages publishes the root of `gh-pages` with a `.nojekyll` marker. Optional Actions templates remain inactive under `docs/github-actions/` because the current OAuth credential lacks workflow-write permission. Local verification precedes publication; GitHub's Pages job establishes deployment rather than a remote run of project tests.

## Evidence boundaries

The user approved the local workflow. Cloud generation, Stagehand semantic QA and Browserbase hosted replay remain omitted. Full global lifecycle certification is not claimed; static-app policy/token-scanner limitations and unperformed manual VoiceOver, physical-device and field-performance checks remain explicit.

Raw reports and screenshots stay in ignored `qa-artifacts/` and `test-results/`. Compact receipts are public. Private company finances, correspondence and source research remain outside this repository. No additional credentials or profile changes are needed for this release.
