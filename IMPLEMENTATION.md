# Implementation checkpoint — mobile contextual framing

## Current state, September 26, 2026

The phone camera now frames eight complete reading scenes plus the opening view. Related headings, both rate explanations, all three window steps and the full partnership story stay together. A restrained optical zoom cap and revised column spacing leave surrounding paper visible. Inactive ink recedes during reading holds; the active text stays at full contrast. No new composited opacity or filter layers were added.

The camera measures the actual header and controls with a 24-pixel inset. Mobile browser-height changes refit the scene after input settles while preserving native scroll position, chapter identity and navigation nodes. The final scene remains reachable after viewport expansion. Secondary groups are inert and hidden from the accessibility tree only during a focused hold; ordinary reading restores everything.

The wide 1200 × 1700 authored paper, alternating Z-fold, texture and light are preserved. High-density intrinsic surfaces remain 600 × 850. Canonical terms, brand and PDF are unchanged: 15/5 and 20/5, all future credited sales, no base, collections-first payments, requested benefits, the 90-day window and the beginning of a broader partnership. The `?view=read` recovery path remains available.

## Adversarial design review

An independent reviewer rejected the baseline and the first candidate. The final rendered composition was accepted after correcting a joined-word heading. Review covered every phone scene at 320 × 740, 390 × 844 and 390 × 664, plus forward/reverse transitions. Root also inspected complete groups and moving frames. See [the independent review](docs/mobile-context-adversarial-review.md) and [the remediation record](docs/mobile-framing-remediation.md). This gate is now required by AGENTS.md for future mobile camera/layout changes.

## Verification

- `pnpm check`: 24 files, zero errors, warnings or hints.
- `pnpm test`: 11 unit checks passed.
- `pnpm build`: two static routes; a formatting-only rebuild was byte-identical.
- Chromium: all 32 checks passed in 30.1 seconds. Includes complete text lines, measured control clearances, four DPR3 phone viewports, live height changes, last-scene reachability, semantic focus, keyboard restoration, sustained scroll/reversal and the existing rendering budget.
- `pnpm test:components`: three checks passed with zero axe violations or browser errors after starting the local workshop.
- `pnpm contract:check && pnpm pdf:check`: canonical Markdown and unchanged complete PDF match.
- `pnpm format:check`: passed.
- Capture: 42 chapter images, 25 fold samples, 32 intermediate frames and five videos. No errors, warnings or failed requests; minimum primary text 14.0374 pixels. Eight rate images were refreshed after the heading correction.
- Supplementary WebKit: 37 reading positions at five sizes, minimum primary text 14.0792 pixels, zero errors/failed requests and five font-preload warnings. Known screenshot/native-viewport limitations remain explicit.

The original new geometry regressions failed against the previous release: over-close framing and approximately 106 pixels of receipt text behind controls after height reduction. The initial final-suite attempt also caught a test waiting for geometry before semantic focus had settled; a bounded state poll corrected the timing, then all 32 passed.

The 64 MiB estimated-paper and 4096-device-pixel edge budgets remain enforced. The prior 52.65 MiB paper estimate is a theoretical area calculation, not physical iPhone memory. Desktop Chromium and supplementary WebKit do not certify the user's earlier physical iPhone process crash as resolved.

## Publication checkpoint

The current mobile-framing candidate is verified locally and ready for the already-authorized GitHub Pages publication. The previous release is still live until the new source/static commit and hosted checks are recorded here. Deployment evidence and current application source are tracked in [the receipt](agentic-ui/deployment-verification.json).

## Evidence and boundaries

- [Independent design review](docs/mobile-context-adversarial-review.md)
- [Mobile framing remediation](docs/mobile-framing-remediation.md)
- [Prior device-rendering remediation](docs/iphone-crash-remediation.md)
- [Local verification](agentic-ui/local-verification.json)
- [WebKit evidence and limits](agentic-ui/webkit-verification.json)

The approved local workflow remains in force. Physical-device stability, manual VoiceOver, field performance, cloud semantic QA and full global certification are not claimed. Raw captures/traces remain ignored. Private business material stays outside this repository. GitHub profile and pins remain unchanged.
