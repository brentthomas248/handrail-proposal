# Handrail proposal

An interactive business proposal from Brent Showalter to Handrail. A three-dimensional Z-fold becomes the scene: its wings open in opposite depth directions, then a scroll-driven camera moves across the printed proposal. Matte paper grain, creases, directional lighting and a projected shadow give the document a physical presence.

**[Explore the live proposal](https://brentthomas248.github.io/handrail-proposal/).** See [IMPLEMENTATION.md](IMPLEMENTATION.md) for verified behavior, release evidence and remaining limits.

## The proposal

A practical way to begin a partnership and help Handrail grow. New business is the starting point, with room for Brent’s contribution to evolve as the company’s needs develop.

No base salary. Commission is paid as customer revenue is collected, with customer installments producing matching commission installments. Hiring first proposes **15% of collected build fees plus 5% recurring**. Bringing the qualifying client first proposes **20% plus 5% recurring**, applying to that client and all future credited sales under the relationship.

The higher rate rewards originating the business that makes hiring possible. Benefits are requested separately, and the cash illustration explicitly leaves delivery, benefits and other costs to be covered. This is a negotiable business proposal; Handrail prepares the final contract after the parties align.

## The experience

The flyer uses Handrail's actual wordmark, warm paper, near-black text and rust accents. Locally served Inter and Playfair Display connect the typography to Handrail's published materials. Large type, thin rules and a receipt-like payment example form one continuous composition.

Three hinged panels have actual front and back faces. CSS 3D transforms and a GSAP ticker coordinate the accordion opening, continuous camera travel and framed reading views. A critically damped response follows native scroll, with no fixed dead-scroll intervals. Pausing between sections settles the camera; new input immediately takes control. The reader can select chapters or switch to ordinary reading. Mobile has closer views where needed. Reduced motion and JavaScript-disabled viewing keep the complete proposal in normal document flow. Decorative arrows and symbols are removed; the document’s movement supplies the visual interest.

## Engineering

| Responsibility | Implementation                                                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages          | Astro static output, strict TypeScript and a reusable React rate component. No backend, accounts, analytics or electronic signing.                                                       |
| Business terms | `src/content/proposal.ts` supplies rates, partnership copy and seven sections of proposal notes. HTML, generated Markdown and PDF use that source.                                       |
| Scroll camera  | `motion.ts` measures the document and owns input/lifecycle; `tour-path.ts` handles fold geometry, a continuous cubic camera path, logarithmic zoom and refresh-rate-independent damping. |
| Reading paths  | The same essential HTML supports tour and ordinary reading. Decorative back faces are hidden from assistive technology; no canvas or WebGL dependency.                                   |
| Brand assets   | The official Handrail PNG wordmark, locally served Inter and Playfair Display.                                                                                                           |
| Verification   | Vitest geometry/motion/content checks, Playwright continuous scrolling and interruption regressions, axe scans and Storybook states.                                                     |

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

Supplementary WebKit behavior checks run with `node scripts/verify-webkit.mjs`. The [WebKit verification record](agentic-ui/webkit-verification.json) distinguishes native-window rendering from a reproduced protocol-screenshot backface defect and records the remaining physical-device limits.

The PDF verifier requires Poppler (`brew install poppler` on macOS, `poppler-utils` on Ubuntu). It independently compares extracted PDF text with the complete canonical proposal content.

Use `pnpm storybook` for the component workshop at [localhost:6006](http://127.0.0.1:6006/), then `pnpm test:components` to exercise its states. `pnpm capture` and `pnpm performance` use the app preview on port 4321. These commands are verification entry points; completed checks and remaining work are recorded in [IMPLEMENTATION.md](IMPLEMENTATION.md) and [the local workflow](docs/local-workflow.md).

## Design and authorship

Brent supplied the business intent, proposal decisions and approved reference direction. AI tools assisted design, implementation and review. Generation and verification are recorded separately.

[DESIGN.md](DESIGN.md) records the direction. Telescope informed changes in scale, Igloo informed camera continuity, Exat informed typographic confidence, and Stripe Press informed document presentation. No assets from those reference sites are included. Handrail's official wordmark and published color/font choices are used for this proposal.

GitHub Pages serves tested static output from the `gh-pages` branch. Optional Actions templates under `docs/github-actions/` remain inactive; validation runs locally before a publishing push. GitHub's own Pages deployment job establishes deployment, not a remote project-test pass. Profile README and pin changes remain separate, unapplied work; see [the showcase handoff](docs/github-showcase.md).
