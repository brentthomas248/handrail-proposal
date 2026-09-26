# Implementation checkpoint — local release verified

## Objective and state

The sculptural Handrail proposal is implemented locally: procedural folded paper, restrained graphite/navy typography, scroll-linked animation, both commission paths, timeline, collection example and the complete unsigned agreement. No neon, calculator, accounts or signature flow. Public deployment and GitHub profile changes remain pending.

The user explicitly approved a local workflow after the credentialed tools were unavailable. No later credential request was made. Cloud generation, semantic QA and hosted replay remain omitted; see docs/local-workflow.md for the exact scope and known global-validator limitations.

## Delivered

- Astro static pages at `/handrail-proposal/` and `/handrail-proposal/agreement/`.
- Original continuous paper geometry and local printed texture, with a silver clip. Scroll progress changes the folds; demand rendering stops idle work. Simple diffuse paper lighting and a CSS shadow replace expensive realtime shadow passes.
- Semantic HTML and an SVG fallback; persisted motion preference, system reduced motion, keyboard navigation, native touch scrolling and responsive layouts.
- Canonical proposed terms in src/content/proposal.ts. HTML, generated Markdown and PDF follow that source. Neither route accepts or signs the proposal.
- Three-page PDF, rendered and visually inspected. An independent Poppler text check compares its complete ordered content with the canonical source.
- Storybook documentation/states and live MCP access, plus deterministic local QA.
- Read-only GitHub profile audit, reviewed profile draft, repository README and inspected desktop screenshot. No GitHub mutations.
- Prepared verification and manual Pages workflows. Neither workflow has run on GitHub yet.

## Verification, September 26, 2026

| Check | Observed result |
| --- | --- |
| `pnpm check` | 30 files, zero errors, warnings or hints |
| `pnpm test` | 31 contract scenario tests passed |
| `pnpm build:release` | Two static routes built; current PDF generated into public and dist |
| `pnpm contract:check` | Markdown matches canonical source |
| `pnpm pdf:check` | Introduction, 18 sections, 29 paragraphs and unsigned status match in order |
| `pnpm test:e2e` | 13 browser tests passed; 320/390/768/1440 layouts, navigation/download, exact clauses, keyboard, motion, no-JS and WebGL failure |
| `pnpm build-storybook` | Successful production component workshop build |
| `pnpm test:components` | Seven behavior checks, zero axe violations and zero uncaught browser errors |
| Live Storybook MCP | Endpoint and initialize/tools/docs/preview calls verified |
| `pnpm capture` | Desktop scene ready, no console/page errors, no mobile overflow; final screenshots inspected |
| `pnpm peers check` | No peer dependency issues |
| `pnpm performance` | Local mobile: performance99/accessibility100/best-practices100/SEO100; desktop100 in all four |

Mobile lab LCP was 1962ms, TBT44ms and CLS0.000042; desktop LCP445ms, TBT0ms and CLS0.000011. Optimized mobile runs varied from93 to99; this table records the latest run. These are local Lighthouse measurements, not field Core Web Vitals. INP and deployed performance remain unmeasured. Initial mobile performance59 revealed shader startup cost; the final measurements follow rendering simplification, font preloading and critical CSS inlining.

Raw browser, PDF-render and Lighthouse artifacts are in ignored qa-artifacts/ and test-results/. Durable project records summarize their results. Automated accessibility passes are not manual assistive-technology certification.

## Remaining boundaries

- The lazy Three.js chunk still produces the bundler's 500KB uncompressed warning. The general lifecycle JavaScript budget and strict global validators have explicit recorded limitations; do not call this a full cloud-certified lifecycle run.
- Complete the employer/entity, legal name, work state, pre-employment status/pay, benefits, expenses and other Section18 details before signing. The website is an unsigned proposed agreement.
- Publishing the proposal, enabling Pages, creating the profile README and changing pins require the separate reviewed publication step. The planned public route is not yet live.
- After approved publication, verify the real GitHub-hosted routes, assets, PDF, mobile rendering and motion behavior. Local and prepared CI evidence do not prove a deployed workflow.

## Local continuation

`pnpm build:release` regenerates HTML and PDF. `pnpm preview --port 4321` serves the built proposal; the current preview runs on that port. `pnpm storybook` serves the workshop on port6006. `pnpm test:e2e` starts a static server when none exists. Install Playwright Chromium and Poppler before PDF/browser checks. Preserve private research outside this repository.

## Knowledge reconciliation

Brain2 already records the proportionate delivery and UI QA evidence standards applied here. No duplicate memory note was required. Current source, tests and records control readiness.
