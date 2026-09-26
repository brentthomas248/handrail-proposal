# Implementation checkpoint — Handrail flyer redesign

## Current state, September 26, 2026

The approved redesign is implemented, published and verified against GitHub Pages. The earlier paper-sculpture release was rejected by the user; its historical receipts remain in the workflow feed and Git history and are not evidence for this redesign.

The user approved Telescope, Igloo, Exat and Stripe Press as references, then requested the shared Handrail identity across its careers page, sample MOU, one-pager and pricing sheet. See DESIGN.md and docs/brand-sources.md. Acceptance of the finished visual result still belongs to the user.

## Delivered

- One semantic HTML flyer. Native scroll drives a reversible GSAP timeline that zooms and pans across the actual text and payment diagram. Desktop has six stops; mobile has eight, with separate rate and rationale views.
- Handrail's unchanged official wordmark, warm paper, rust accent, Inter and Playfair Display. No paper clip, decorative 3D scene, neon or calculator.
- No base salary; payment after customer collections; matching installments; 15/5 hire-first and 20/5 client-first on the triggering and future credited sales; 90-day opportunity; benefits and support request. Seven negotiable business sections replace the legal draft. Handrail prepares the final contract.
- Same-DOM ordinary reading, stored reading preference, reduced-motion override, keyboard chapter navigation, visible keyboard focus and no-JavaScript reading. Links and downloads remain native HTML.
- Canonical notes in src/content/proposal.ts power HTML, generated Markdown and a two-page PDF. The existing agreement/ route and PDF filename retain link compatibility.
- Reusable DealPath component with three Storybook states and live MCP readiness. Camera behavior is verified at the app level.
- Matching social image, public engineering README and local scripts. Three.js, React Three Fiber and Lenis are removed.

## Current verification

| Check | Observed result |
| --- | --- |
| pnpm check | 22 files, zero errors, warnings or hints |
| pnpm test | 4 content/consistency tests passed |
| pnpm build:release | Two static routes and current two-page PDF |
| pnpm contract:check | Generated Markdown matches canonical source |
| pnpm pdf:check | Introduction, 7 sections, 15 paragraphs and discussion endnote match in order |
| PDF visual review | Both rendered pages inspected; readable content and balanced page breaks |
| pnpm test:e2e | 19 browser tests passed: actual wheel zoom/pan/reverse, all camera targets, touch emulation, keyboard, Back navigation, persistent reading, reduced motion, no JS, content/download and two axe scans |
| Responsive coverage | Read-mode reflow at 320/390/768/1440px; every tour target framed at 320/390/1440px; framed paragraph text at least 12px |
| pnpm capture | 22 chapter captures plus reading/notes images; zero console/page/request errors; desktop/mobile images reviewed |
| pnpm build-storybook | Production workshop built; workshop-only large chunk warning |
| pnpm test:components | 3 checks, zero axe violations or uncaught browser errors |
| Storybook MCP and component coverage | Live endpoint/readiness and component-state validation passed |
| pnpm format:check | Passed |
| pnpm performance | Latest local Lighthouse:100 performance/accessibility/best-practices/SEO on desktop and mobile |
| Design lint/export | Zero lint errors; DTCG regenerated; current literal-token scan findings retained |

The local Lighthouse run measured mobile LCP 1717ms, TBT 11ms, CLS 0.00290; desktop LCP 377ms, TBT 0ms, CLS 0.00485. Script transfer was 45,870 bytes, below the unchanged 250KB budget. The measured run preceded a final keyboard/back-navigation cleanup. These are laboratory results, not field Core Web Vitals or physical-device measurements.

The first redesign QA pass caught 320px overflow, low-contrast cash text, small phone detail type and a layout shift during camera initialization. These were corrected and the relevant browser/capture/performance checks rerun. The final PDF render emits a Poppler Type 3 bounding-box warning; both pages visually render correctly and complete independent text comparison passes.

## Publication checkpoint

Published https://brentthomas248.github.io/handrail-proposal/ from source ad6fa8b and static commit 05eaf7dc6478f6203c554bd40335c2602de4c793. GitHub Pages [run 36268461522](https://github.com/brentthomas248/handrail-proposal/actions/runs/36268461522) succeeded. The gh-pages commit is a normal descendant of the previous release and includes .nojekyll.

The same 19 browser tests passed against the public URL in 6.2 seconds. Hosted homepage HTML, proposal notes, PDF, logo and social image match the verified build byte-for-byte. The downloaded PDF independently passed the complete 7-section/15-paragraph comparison. See agentic-ui/deployment-verification.json. User review of the finished visual treatment remains pending.

Optional Actions templates remain inactive under docs/github-actions/. The existing OAuth credential lacks workflow-write permission. GitHub's Pages job proves deployment, not remote execution of project tests. GitHub profile README and pins remain unchanged.

## Evidence boundaries

The user explicitly approved a local workflow after credentialed tools were unavailable. No new credential request is needed. Cloud generation, semantic QA and hosted replay remain omitted. Full global lifecycle certification is not claimed: the static-app policy validator, CSS literal-value scanner and unperformed manual assistive-technology/physical-device checks remain separately recorded. The previous route-JavaScript budget issue is resolved.

Raw reports and screenshots remain ignored under qa-artifacts/ and test-results/; compact receipts are public. Private company finances, correspondence and source research remain outside this repository. Brain2 already records the proportionate verification and rendered-evidence standards used here; no duplicate knowledge write was needed.
