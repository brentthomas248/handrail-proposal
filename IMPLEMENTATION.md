# Implementation checkpoint — continuous Z-fold and matte paper

## Current state, September 26, 2026

The current source replaces the inward-folding choreography with a physical accordion fold. The two wings travel to opposite sides of the center plane. A continuous cubic camera path uses logarithmic zoom and a single critically damped response to native scrolling. Reading windows keep moving gently; an interrupted transition settles into readable content, and fresh input cancels settling.

Fine SVG grain and fibers, layered edges, mirrored crease shading and orientation-linked illumination give the panels a matte paper surface. A soft projected shadow follows the folded geometry and stays close to the closed leaflet. Essential text remains semantic HTML. The Handrail identity, proposal copy, compensation paths and PDF are unchanged.

The prior release's endpoint checks missed real motion defects. Independent baseline input reproduced a 716.6ms stationary interval during scrolling, a startup jump and unnecessary viewport rebuilding. The remediation record is [docs/motion-remediation.md](docs/motion-remediation.md). User visual acceptance of this revision remains separate from technical verification.

## Implementation

- `src/scripts/tour-path.ts`: pure accordion geometry, shape-preserving C1 camera interpolation, log-scale zoom and bounded damping.
- `src/scripts/motion.ts`: measurements, one ticker, chapter controls, input cancellation, idle settlement, stable phone-height handling and chapter-preserving breakpoint changes. No ScrollTrigger startup path.
- `src/styles/global.css` and `public/paper-grain.svg`: original static paper texture, face lighting, edge/crease treatment and a separate soft shadow. Three-dimensional ancestors retain their depth; print excludes material effects. The unpositioned tour remains hidden until the first measured camera frame, with a four-second fallback to normal reading if initialization fails.
- Reduced motion, no-JavaScript viewing, ordinary reading, keyboard access, browser Back and the complete proposal notes remain available.
- Source `src/content/proposal.ts` still owns 15/5 hire-first and 20/5 client-first terms, all future credited sales, collections-first payments, the benefits request, 90-day window and beginning-of-partnership framing. Handrail prepares the final agreement.

## Verified locally

| Check                                             | Observed result                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `pnpm check`                                      | 24 files; zero errors, warnings or hints                                                                           |
| `pnpm test`                                       | 11 tests: content, accordion geometry, continuous interpolation, damping, startup and reversal                     |
| `pnpm build`                                      | Two static routes built                                                                                            |
| `pnpm contract:check` and `pnpm pdf:check`        | Canonical Markdown and the unchanged PDF match the introduction, seven sections and 15 complete paragraphs         |
| `pnpm test:e2e`                                   | 27 Chromium tests passed in 20.8 seconds, including motion/lifecycle and delayed/failed initialization regressions |
| `pnpm build-storybook` and `pnpm test:components` | Workshop build and three component checks passed; zero axe violations; workshop-only chunk warning                 |
| `pnpm format:check`                               | Passed after implementation                                                                                        |
| `pnpm performance`                                | Mobile performance 99; desktop 100; accessibility, best practices and SEO 100 on both                              |

Current laboratory LCP: mobile 1801.03ms, desktop 380.98ms. TBT is zero; CLS is 0.00290 and 0.00108. These page-load measurements do not establish scroll quality, field INP or physical-device performance.

Independent replay reduced the longest measured stationary scrolling interval from 716.6ms to 50ms. The immediate-input progress-speed spike decreased from 43.0/s to 8.36/s. Six phone-height changes no longer rebuild navigation or rebase scrollY. Cancelled touch input releases the controller, and crossing the mobile breakpoint preserves the parent chapter. These are local deterministic observations, not claims about every device.

Root inspected the integrated cover, open accordion, headline and cash panel in the native in-app browser. The material reviewer independently inspected desktop/mobile texture, crease orientation, directional light and the shadow, with no material blocker. Final evidence under `qa-artifacts/z-fold-final/` includes 24 chapter images, 15 fold samples and three continuous/reversal videos. Minimum reading-target text is 13.48px; no Chromium errors, warnings or failed requests were observed. Supplementary WebKit passed 21 reading positions at three sizes; root inspected actual desktop beginning, open Z-fold and rates. Its capture, visibility-reporting and headful-phone limitations remain explicit in `agentic-ui/webkit-verification.json`.

## Publication

The [public Z-fold](https://brentthomas248.github.io/handrail-proposal/) is published from source `0dfbaaaa065adeeabf0d7c64da106dca8917de88` and static commit `4013024ba8464a5e4158c0199a45952999cd7af5`. [Pages run 36272824422](https://github.com/brentthomas248/handrail-proposal/actions/runs/36272824422) succeeded. Eight hosted HTML/assets, including camera code and grain, match the final build byte-for-byte; the downloaded PDF passes complete canonical verification. Root reviewed the final public cold-load cover. The final 27-test hosted suite passed in 21.7 seconds, including delayed-module and failed-module fallback cases. The prior inward-folding edition remains historical baseline evidence.

Pages publishes the root of `gh-pages` with `.nojekyll`. Optional Actions templates remain inactive under `docs/github-actions/`; local tests run before publication, and GitHub's Pages job establishes deployment rather than a project-test pass.

## Evidence boundaries

The user approved the local workflow; cloud generation, Stagehand semantic QA and Browserbase replay remain omitted. Full global certification, manual VoiceOver, physical iOS and field-performance coverage are not claimed. The WebKit screenshot API has a separately reproduced backface-capture defect; current behavior and native rendering must be distinguished from that historical reproduction.

Raw reports, screenshots and videos remain ignored under `qa-artifacts/` and `test-results/`. Compact receipts are public. Private company research, correspondence and finances remain outside this repository. GitHub profile README and pin changes remain separate and unapplied.
