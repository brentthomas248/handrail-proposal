# Approved local workflow

The user approved implementing and verifying this Handrail proposal locally after credentialed services were unavailable. This scope is limited to this repository and delivery. Global Agentic UI defaults and credential boundaries remain unchanged.

## Tool scope

Stitch and Magic generation, Stagehand semantic QA and Browserbase hosted replay are omitted with user authorization. Their credentials and live tool calls remain unverified. No retry of 1Password authorization, secret recovery or credential workaround belongs to this delivery.

Astro renders the semantic HTML trifold. Short wheel and touch gestures commit to adjacent scenes along a continuous camera path, with alternating hinged panels, perspective travel and camera-facing reading holds. Controlled flights use one eased GSAP owner; native keyboard/scrollbar travel retains the damped camera and ordinary reading stays native. There is no ScrollTrigger, Three.js, React Three Fiber or Lenis dependency in the current runtime. Handrail's actual wordmark, warm paper/rust palette, Inter and Playfair Display remain the design foundation.

Required evidence is proportionate to that implementation: production build, type checks, canonical-document consistency, complete PDF text verification, Storybook rate-component checks, deterministic Playwright interactions, rendered screenshots and accessibility checks. An independent adversarial reviewer must inspect mobile camera/layout changes before publication. Product QA, design review and deployment are separate outcomes.

## Local services

- App: `pnpm dev`, or build then `pnpm preview`, bound to `127.0.0.1:4321`, route `/handrail-proposal/`. Preview serves `dist` and requires a rebuild after source edits.
- Storybook: `pnpm storybook`, bound to `127.0.0.1:6006`; MCP endpoint `http://127.0.0.1:6006/mcp`.
- Static output: no backend, database, signatures, external message delivery or business mutations.
- Browser checks use isolated contexts; no personal browser profile or credentialed service access is required. Concurrent test processes must use separate output directories.

## Current evidence

[IMPLEMENTATION.md](../IMPLEMENTATION.md) is the current source, verification and release checkpoint. [The deployment receipt](../agentic-ui/deployment-verification.json) records the source/static commits, Pages run and hosted checks. Do not infer current readiness from historical receipts.

Browser coverage must exercise actual unfolding/reversal, front/back faces, complete reading groups and context, navigation, persistent normal reading, reduced motion, no-JavaScript, canonical notes/PDF, keyboard restoration, initialization failure and mobile height changes. Preserve the high-DPR paper budget. Target bounding boxes alone do not establish a complete or good composition.

The workshop documents DealPath's two compensation paths. App camera controls require app-level verification. The PDF is generated from `/agreement/`, visibly titled “Proposal notes.” `pnpm pdf:check` compares the introduction, seven ordered sections, complete paragraphs and endnote with the canonical source. Stable route and filename do not make the proposal a final agreement.

Supplementary WebKit geometry is separate from the Chromium suite. Protocol backface capture and native headful viewport limitations are documented in [the WebKit receipt](../agentic-ui/webkit-verification.json). Neither desktop engine establishes physical iPhone stability. Manual VoiceOver and field performance remain unmeasured; historical Lighthouse scores are not scroll-performance or device-stability proof.

## Publication and boundaries

The [public proposal](https://brentthomas248.github.io/handrail-proposal/) is served from `gh-pages` in the [source repository](https://github.com/brentthomas248/handrail-proposal). Local checks precede publication. GitHub's Pages job confirms deployment; hosted browser tests and byte-for-byte asset/PDF checks are recorded separately. The static branch includes `.nojekyll` for Astro assets.

Optional workflows in `docs/github-actions/` remain inactive because the current OAuth credential lacks workflow-write permission. Full global/cloud lifecycle certification is not claimed. Do not invent database cleanup or business-mutation evidence for this static app. Generated screenshots, traces and reports remain ignored under `qa-artifacts/` and `test-results/`. Private research stays outside the public repository. The public GitHub profile and pins were updated and verified in the portfolio revision; see `docs/portfolio-resume-motion-implementation.md`.
