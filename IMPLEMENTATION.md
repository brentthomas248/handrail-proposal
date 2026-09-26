# Implementation checkpoint — wider paper and iPhone crash remediation

## Current state, September 26, 2026

The user reported a physical iPhone browser-process crash after several scrolls and asked for the wider, shorter proportions of the first proposal. The new paper is authored at 1200×1700 per panel, approximately 0.71 width/height, matching the original paperclip edition's geometry without restoring the clip. Columns use the added width; 15 phone reading targets keep each block readable.

The rendering path now paints texture, shade and crease into existing faces. Twelve promoted overlays and live SVG filters are removed. Unseen opposite faces are released using the actual perspective viewpoint; teardown restores them for measurement and normal reading. Paper coordinates halve at high pixel density, while header, navigation and reading typography retain their own sizes. Three radial-gradient shadow pads follow the fold. Light values are cached to avoid redundant paint changes.

The proposal remains semantic HTML with the same Handrail brand and canonical business terms. The 90-day window, 15/5 and 20/5 paths, all future credited sales, collections-first payments, benefits request and broader partnership framing are unchanged. The PDF is unchanged and verified. `?view=read` bypasses the camera and preserves reading mode through notes navigation; Take the tour remains an explicit option.

## Verification

- `pnpm check`: 24 files, zero errors/warnings/hints.
- `pnpm test`: 11 unit checks passed.
- `pnpm build`: two static routes built.
- `pnpm test:e2e`: 29 Chromium checks passed in 31.6s. Includes DPR3 paper budget, all phone targets, sustained input/reversal, viewport changes, keyboard restoration, initialization failure, persistent recovery, reduced motion and no-JavaScript.
- `pnpm build-storybook && pnpm test:components`: workshop built ; 3 checks passed, zero axe violations. Workshop-only bundle-size warning remains outside the published page.
- `pnpm contract:check && pnpm pdf:check`: canonical Markdown and complete PDF match.
- `pnpm format:check`: passed.
- Final capture: 38 chapter images, 15 fold samples, 3 journey videos; no browser errors/warnings/failed requests. Minimum captured target text 12.251px. Root reviewed desktop and phone rendering.
- Supplementary WebKit: 35 reading targets across 1440/390/320px; phones at DPR3; minimum 12.2495px. Zero errors/failed requests ; 3 unused-font-preload warnings. Current native iPhone rendering is not verified.

At 390×844/DPR3 the mapped compositor sample fell from 31 layers/24 drawn to 17/9. Paper uses three drawn faces and no promoted overlays. Its area-derived RGBA estimate fell from 912.062MiB to 52.652MiB; the maximum measured paper edge fell from 7401 to 2556 device pixels. These are theoretical full-surface estimates, not actual iPhone memory measurements. The 64MiB/4096px project budget passes across chapters and reversals.

Independent stress covered 12 forward/reverse cycles, 336 wheel inputs and 714 layer observations, with no desktop errors. Physical iPhone termination was not reproduced on the desktop. A real-device retry is required before calling IC-01 resolved.

## Publication checkpoint

The [public proposal](https://brentthomas248.github.io/handrail-proposal/?v=e3339c9) is published from source `e3339c9737566dd71a16770a276f553d815ad879` as static commit `c0f5dc73edfe1d7103659461036ff854ce711ddd`. [Pages run 36274389010](https://github.com/brentthomas248/handrail-proposal/actions/runs/36274389010) succeeded. The final hosted suite passed all 29 browser checks in 32.9s, including the DPR3 rendering budget and persistent recovery URL. Eight public assets match the build byte-for-byte; the downloaded PDF matches all seven sections and 15 complete paragraphs.

The direct [reading fallback](https://brentthomas248.github.io/handrail-proposal/?view=read&v=e3339c9) is available. Actual iPhone retry and user approval of the revised proportions remain pending. The final named-listener CDP cleanup also passed a focused regression and strict typecheck after the complete local run. This closes implementation and publication; it does not certify the reported device crash as resolved.

## Durable evidence and boundaries

- [Crash/proportion remediation](docs/iphone-crash-remediation.md)
- [Rendering measurements](agentic-ui/iphone-rendering-verification.json)
- [Local verification](agentic-ui/local-verification.json)
- [WebKit scope and limits](agentic-ui/webkit-verification.json)
- [Publication receipt](agentic-ui/deployment-verification.json)
- [Prior motion remediation](docs/motion-remediation.md)

The approved local workflow remains in force. Cloud semantic QA, Browserbase replay, manual VoiceOver, full global certification and field-performance claims are not included. Previous native-window and Lighthouse receipts are historical; they do not prove current physical iPhone stability. Raw captures/traces stay ignored under qa-artifacts and test-results. Private business material remains outside the public repository. GitHub profile and pins remain unchanged.
