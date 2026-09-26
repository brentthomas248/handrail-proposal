# Handrail proposal

An interactive business proposal from Brent Showalter to Handrail. One HTML flyer becomes the scene: scrolling zooms into its headline, moves through the cash-flow example and compares two ways to begin working together.

**Redesign publication is pending.** The [public URL](https://brentthomas248.github.io/handrail-proposal/) currently serves the previous edition. The working implementation replaces that edition; consult [IMPLEMENTATION.md](IMPLEMENTATION.md) for current verification and publication status.

![The Handrail flyer at the opening camera view](docs/media/proposal-desktop.png)

## The proposal

No base salary. Commission is paid as customer revenue is collected, with customer installments producing matching commission installments. Hiring first proposes **15% of collected build fees plus 5% recurring**. Bringing the qualifying client first proposes **20% plus 5% recurring**, applying to that client and all future credited sales under the relationship.

The higher rate rewards originating the business that makes hiring possible. Benefits are requested separately, and the cash illustration explicitly leaves delivery, benefits and other costs to be covered. This is a negotiable business proposal; Handrail prepares the final contract after the parties align.

## The experience

The flyer uses Handrail's actual wordmark, warm paper, near-black text and rust accents. Locally served Inter and Playfair Display connect the typography to Handrail's published materials. Large type, thin rules and a receipt-like payment example form one continuous composition.

GSAP ScrollTrigger moves the actual HTML document with coordinated translation, rotation and scale. The reader can select chapters or switch to ordinary reading. Mobile has closer views of each compensation path. Reduced motion and JavaScript-disabled viewing keep the complete proposal in normal document flow.

## Engineering

| Responsibility | Implementation                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages          | Astro static output, strict TypeScript and a reusable React rate component. No backend, accounts, analytics or electronic signing.          |
| Business terms | `src/content/proposal.ts` supplies rates, path copy and seven sections of proposal notes. HTML, generated Markdown and PDF use that source. |
| Scroll camera  | `src/scripts/motion.ts` measures the semantic flyer and builds one GSAP timeline. Native scrolling drives the tour.                         |
| Reading paths  | The same HTML remains selectable and accessible in tour and normal reading modes. No canvas or WebGL dependency.                            |
| Brand assets   | The official Handrail PNG wordmark, locally served Inter and Playfair Display.                                                              |
| Verification   | Vitest document checks, Playwright browser flows, axe accessibility checks and Storybook component states.                                  |

The PDF is printed from the proposal-notes route. Regenerate it when the content changes; a previously generated PDF does not update itself. The existing `agreement/` URL and PDF filename are retained for link compatibility, while the visible content is proposal notes.

## Run locally

Use Node **22.18 or later** and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open [the local flyer](http://127.0.0.1:4321/handrail-proposal/) or [proposal notes](http://127.0.0.1:4321/handrail-proposal/agreement/).

To inspect a production build, use an available preview port:

```sh
pnpm build:release
pnpm preview --port 4321
```

The `/handrail-proposal/` base path is intentional. Preserve it when checking direct links, assets and downloads.

## Verify

```sh
pnpm check
pnpm test
pnpm build:release
pnpm pdf:check
pnpm build-storybook
pnpm exec playwright install chromium
pnpm test:e2e
```

The PDF verifier requires Poppler (`brew install poppler` on macOS, `poppler-utils` on Ubuntu). It independently compares extracted PDF text with the complete canonical proposal content.

Use `pnpm storybook` for the component workshop at [localhost:6006](http://127.0.0.1:6006/), then `pnpm test:components` to exercise its states. `pnpm capture` and `pnpm performance` use the app preview on port 4321. These commands are verification entry points; completed checks and remaining work are recorded in [IMPLEMENTATION.md](IMPLEMENTATION.md) and [the local workflow](docs/local-workflow.md).

## Design and authorship

Brent supplied the business intent, proposal decisions and approved reference direction. AI tools assisted design, implementation and review. Generation and verification are recorded separately.

[DESIGN.md](DESIGN.md) records the direction. Telescope informed changes in scale, Igloo informed camera continuity, Exat informed typographic confidence, and Stripe Press informed document presentation. No assets from those reference sites are included. Handrail's official wordmark and published color/font choices are used for this proposal.

GitHub Pages serves tested static output from the `gh-pages` branch. Optional Actions templates under `docs/github-actions/` remain inactive; validation runs locally before a publishing push. GitHub's own Pages deployment job establishes deployment, not a remote project-test pass. Profile README and pin changes remain separate, unapplied work; see [the showcase handoff](docs/github-showcase.md).
