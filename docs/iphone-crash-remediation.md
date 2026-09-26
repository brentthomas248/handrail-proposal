# Physical iPhone crash remediation

## Curated finding and scope

IC-01: The user supplied a physical iPhone screenshot of the browser error “A problem repeatedly occurred” at the deployed proposal (`?v=0dfbaaa`). This is a browser-process failure, not an ordinary page exception. The screenshot is private and is not copied into the public repository.

Status: rendering remediation implemented; physical-device retry pending. The preceding desktop, headless WebKit and emulated Chromium passes do not establish physical-device stability. Do not call this resolved on an iPhone without a real-device retry.

Scope: homepage rendering, material/compositor cost, startup/recovery and targeted regression evidence. The user also requested a wider, shorter brochure matching the first paperclip proposal. Business terms, branding and the intended Z-fold camera remain unchanged. User-approved local verification scope persists; no new cloud credentials or semantic-service claims.

## Hypothesis and plan (before implementation)

Large source-space panels, promoted opacity overlays, a filtered SVG texture and a blurred shadow may create excessive backing surfaces at high device pixel ratio. This is a hypothesis, not a crash-log diagnosis. Measure compositing layers at DPR3, review WebKit sources, then remove redundant surfaces and bound geometry/texture cost. Keep the texture, directional light and actual fold where safe. Provide an explicit normal-reading recovery URL as part of robust progressive enhancement.

Files likely involved: global.css, motion.ts, tour geometry/material assets, Page.astro and focused browser verification. No new paid tools or new rendering framework is planned.

Acceptance evidence: typecheck/unit/build, focused cold-load/fallback tests, high-DPR layer counts/dimensions and estimated backing memory before/after, sustained real input, rendered paper/copy review, public-asset verification and final hosted regressions. Estimated compositor bytes are not actual memory profiling and cannot certify an iPhone fix. A physical iPhone result remains pending unless supplied.

## Implemented changes

The historical source at `22fe408:src/lib/paper-geometry.ts` defines a 7.4 × 3.45 spread, or approximately 0.715 width/height per panel. The new authored panel is 1200 × 1700 (0.706), with a consistent physical ratio across viewports. Cash-flow content uses columns; partnership details, rationale and the 90-day steps use the added width. Phone camera targets frame individual reading blocks instead of shrinking a whole wide panel.

Removed twelve separately promoted lighting/crease layers. Lighting is painted into face backgrounds and updated only when its quantized value changes. The fixed-seed SVG grain contains vector marks and fibers without filters. Three radial gradients form the soft projected shadow without a live blur filter. Intrinsic paper coordinates halve at DPR2 and above; interface and ordinary reading sizes remain independent.

Perspective-aware culling removes unseen opposite faces from painting. Teardown restores both faces before measuring or entering reading mode. Keyboard traversal into the paper also restores the content first. The `?view=read` URL bypasses initialization and persists the reading choice across proposal-notes navigation; the visitor can explicitly select Take the tour again.

## Evidence and limitations

The original physical-device report happened after several scroll gestures. No model or OS detail was required to proceed. Desktop stress did not reproduce process termination, so there is no crash-log diagnosis or claim that a JavaScript heap leak was found.

At 390 × 844, DPR3, the mapped six-pose sample changed from 31 total / 24 drawn compositor layers to 17 / 9. Paper now uses three drawn face layers and no promoted shade/crease pseudo-layers. The full-surface paper RGBA estimate is about 52.65 MiB, with a 2556-device-pixel maximum edge, versus about 912 MiB and a 7401-pixel face edge in the baseline. These are area-derived engineering estimates, not measured resident iPhone memory. Browser raster scale, tiling, culling and allocation differ.

The checked-in regression enforces a 64 MiB estimated paper budget and 4096-pixel edge budget through all chapters and reverse input. These are project budgets, not documented iOS crash thresholds. Detailed current measurements are in `agentic-ui/iphone-rendering-verification.json`; raw traces remain ignored under `qa-artifacts/iphone-compositing/`.

The review caught and corrected small receipt text at 320px and keyboard traversal of a culled face. The recovery URL also needed to retain reading mode when returning from notes. Unchanged canonical business copy and PDF are checked separately. Publication and final suite results belong in `IMPLEMENTATION.md` and current verification receipts.

Reference: Apple's [Safari rendering guidance](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/ResourcesandtheDOM/ResourcesandtheDOM.html) describes compositing-area and repaint costs (archived guidance). [WebKit memory debugging](https://webkit.org/blog/6425/memory-debugging-with-web-inspector/) distinguishes graphics allocations from the JavaScript heap. These support investigating the rendering path; neither establishes the cause of this user's crash.

A retry on the user's actual iPhone remains the acceptance boundary for IC-01. Local Chromium, supplementary WebKit and public deployment checks cannot substitute for it.
