# Candidate v5 endpoint timing correction

Implementation investigation only; no design score or application change.

The five Chromium failures and the WebKit minimum-font failure were measurements taken during chapter navigation. Candidate v5 permits chapter tweens up to 1.8 seconds; the old tests sampled after 1.1 or 1.4 seconds, and some geometric predicates could become true transiently before the final scale. The camera's damping also continues after native scroll reaches its destination.

## Change

Added `tests/helpers/tour-settled.ts`, shared by the Chromium specifications and standalone WebKit verifier. It observes native scroll, viewport dimensions, the sheet transform and all hinge transforms on animation frames. It requires the tour to be camera-ready and the observed state to remain unchanged for 200 ms over at least three frames. An eight-second deadline reports the last observed state instead of hanging.

Replaced the obsolete endpoint-only waits in `tests/e2e/final-design.spec.ts`, `tests/e2e/proposal.spec.ts`, and `scripts/verify-webkit.mjs`. The WebKit reading-hold checks now wait for the observable landing before measuring face normals, text bounds and type size. Geometry, type, margin, scroll-retention and accessibility thresholds are unchanged. Intentional input/interruption/sampling intervals remain unchanged, including the 90/100/120/250 ms gesture checks, held-touch timing, and WebKit's 500 ms intermediate unfolding samples.

The helper checks rendered observable state, not an application-private GSAP flag. Existing assertions still establish whether the stable result is correct; stability alone is not a pass.

## Measurements

Independent probe against served v5 SHA-256 `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5`:

| Assertion | Original timer | Probe value at old timer | Settled value | Unchanged requirement |
| --- | ---: | ---: | ---: | --- |
| Window lower margin, 1440×1000 | 1100 ms | −0.0477 px | **113.4066 px** | ≥20 px |
| Closing type, 320×740 | 1400 ms | 11.0134 px | **16.2133 px** | ≥16 px |
| Closing type, 390×664 | 1400 ms | 13.8489 px | **17.2000 px** | ≥16 px |
| Closing type, 390×844 | 1400 ms | 13.7550 px | **17.2000 px** | ≥16 px |
| Cash flow native position, 390×844 | 1400 ms | 1892 px | **1980 px** | Height changes retain position within 2 px |

The independent probe needed another 842–1181 ms after the old timer, including the 200 ms stability observation. Old-timer values vary with scheduling, which is part of the failure mechanism; the original full-suite log recorded margin 0.0847 px and closing sizes 12.9505/15.8305/15.7972 px. Both runs measured a moving scene.

After establishing the settled Cash flow position, viewport heights 800, 760, 664, 810, 844, 770 and 844 each retained **1980 px exactly**. The previous full-suite test had recorded a 51 px change because its original position was taken before the navigation finished.

The original WebKit log failed at 8.4812 px against a 12 px floor. With settled measurements, all **29 reading holds** pass across 1440×1000, 390×844, 320×740, 430×932 and 390×664. The overall minimum is **14.0624 px**. Browser errors and failed requests are empty; the existing five unused-font-preload warnings remain warnings. This is geometry/behavior evidence and does not remove the documented WebKit screenshot or physical-device limitations.

## Verification and receipts

Evidence directory: `qa-artifacts/final-design/candidate-v5/settled-endpoints/`.

- `before-after.json` and `probe.mjs`: independent old-timer versus settled measurements, exact transforms, native positions, resize positions and candidate hashes.
- `chromium.log`: the five formerly failing cases plus the new reduced-motion keyboard case, **6 passed in 14.2 seconds**.
- `webkit/verification.json` and `webkit.log`: **29 holds passed**, minimum 14.0624 px, no browser errors or failed requests.
- `check.log`: `pnpm check`, **41 files, zero errors/warnings/hints**.
- Full Chromium suite: **135 passed in 2.0 minutes**; its isolated log is `full-chromium.log` and artifacts are in `full-chromium-results/`.

Commands:

```sh
PROPOSAL_BASE_URL=http://127.0.0.1:4321/handrail-proposal/ pnpm exec playwright test tests/e2e/final-design.spec.ts tests/e2e/proposal.spec.ts tests/e2e/loading-affordance.spec.ts --grep 'the window has a real lower paper margin at 1440x1000|the closing argument uses readable body type|phone browser-height changes retain|reduced-motion explanation remains keyboard reachable' --workers=1 --reporter=line --output=qa-artifacts/final-design/candidate-v5/settled-endpoints/chromium-results
WEBKIT_OUTPUT=qa-artifacts/final-design/candidate-v5/settled-endpoints/webkit PROPOSAL_BASE_URL=http://127.0.0.1:4321/handrail-proposal/ node scripts/verify-webkit.mjs
pnpm check
PROPOSAL_BASE_URL=http://127.0.0.1:4321/handrail-proposal/ pnpm exec playwright test --workers=3 --reporter=line --output=qa-artifacts/final-design/candidate-v5/settled-endpoints/full-chromium-results
```

No source application, CSS, build output or design threshold was changed. No build, commit or publication was performed by this investigation.
