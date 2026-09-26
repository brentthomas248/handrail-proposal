# Approved local workflow

The user approved implementing and verifying this Handrail proposal locally after credentialed services were unavailable. This scope is limited to this repository and delivery. Global Agentic UI defaults and credential boundaries remain unchanged.

## Tool scope

Stitch and Magic generation, Stagehand semantic QA and Browserbase hosted replay are omitted with user authorization. Their credentials and live tool calls remain unverified. No retry of 1Password authorization, secret recovery or credential workaround belongs to this delivery.

The current implementation uses Astro, GSAP ScrollTrigger and native browser scrolling. The semantic HTML trifold is the animated scene: three hinged panels, front/back faces, sequential opening, perspective travel and flat readable holds. Handrail's actual wordmark, warm paper/rust palette, Inter and Playfair Display replace the rejected paper sculpture and cool navy styling. Three.js, React Three Fiber and Lenis have been removed.

Required evidence is proportionate to that implementation: a production build, type checking, canonical-document consistency, complete PDF text verification, Storybook rate-component checks, deterministic Playwright interactions, rendered screenshots and accessibility checks. Product QA, design review and deployment are separate outcomes.

## Local services

- App: `pnpm dev`, bound to `127.0.0.1:4321`, route `/handrail-proposal/`.
- Storybook: `pnpm storybook`, bound to `127.0.0.1:6006`; MCP endpoint `http://127.0.0.1:6006/mcp`.
- Static output: no backend, databases, signatures, external message delivery or business mutations.
- Browser checks use isolated local contexts; no personal browser profile or credentialed service access is required.

## Current redesign evidence

The active verification and release state is recorded in IMPLEMENTATION.md and the lifecycle artifacts. **Current trifold publication and finished-design review are pending.** Source `ad6fa8b`, static commit `05eaf7d` and 19 hosted browser passes describe the preceding flat-flyer edition. They do not establish this revision’s hinge behavior, reading quality or readiness.

Current checks must verify independent wing rotations under real scrolling, reversible opening, front/back faces, perspective transitions and flat holds with legible text. Root-sheet translation alone is insufficient evidence. Also check chapter navigation, persisted ordinary reading, reduced motion, no-JavaScript content, mobile framing, canonical notes, PDF downloads, keyboard focus and browser-back restoration.

The workshop now documents the DealPath component and its two compensation paths. Removed PaperScene, PaperFallback, SceneHost and MotionToggle stories are historical implementation details, not current workshop surfaces. App-level camera controls require app-level verification.

The PDF is generated from `/agreement/`, now visibly titled “Proposal notes.” `pnpm pdf:check` compares the introduction, seven ordered sections, complete paragraphs and endnote with the canonical source. The stable route and filename preserve existing links; they do not make the document a final agreement.

## Evidence boundaries

Generated reports and screenshots stay under ignored `qa-artifacts/` and `test-results/`. Configuration and stories are preparation, not completed interaction evidence. Record command output and actual screenshots before marking checks passed.

The previous global static-app policy mismatch and literal design-token scanner limitations remain separate from product checks. This app has no database or business mutation endpoints; do not fabricate cleanup or mutation evidence to satisfy a generic full-stack validator. Do not describe a local release as a fully certified cloud lifecycle run.

Earlier local Lighthouse measurements in performance-evidence.json belong to the preceding flat-flyer edition until explicitly replaced with a trifold measurement. Do not carry its scores or script-byte totals forward. Field metrics remain unmeasured. Automated checks do not establish physical-device coverage, manual assistive-technology certification, field Core Web Vitals or cloud-adapter readiness.

## Publication

The [public URL](https://brentthomas248.github.io/handrail-proposal/) serves the preceding flat-flyer edition until this revision is validated and published. The [source repository](https://github.com/brentthomas248/handrail-proposal) and branch-based Pages configuration already exist.

Optional workflows in `docs/github-actions/` remain inactive because the current OAuth credential lacks workflow-write permission. Local checks precede a publishing push. GitHub's own Pages job confirms deployment, not remote execution of project tests. After publication, run the current trifold browser checks with PROPOSAL_BASE_URL set to the public URL and independently compare the hosted PDF with the current canonical proposal. Branch publication includes a .nojekyll marker so Astro assets are served. Profile README and pin changes remain unapplied.
