# Fixed header/controls capture investigation

**Result:** the 50–150 px displacement in M-R4-05 was **not reproduced in native Chrome app captures** of the same candidate's distant chapter jumps. The header was pixel-identical across 26 captured motion frames; the controls stayed visually anchored. This supports a desktop capture-path anomaly, but it does **not** prove the precise compositor cause or clear the physical-phone fling case. This is a bounded engineering investigation, not a fresh score or a release decision.

## Identity and scope

- Date: 27 September 2026.
- URL: `http://127.0.0.1:4321/handrail-proposal/`.
- Candidate: v4; served `index.html` SHA-256 `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82`.
- Served identity was recorded before the native baseline and after both capture bursts. The `dist/index.html` hash was recorded immediately before every burst frame. All match v4.
- Surface: standard Google Chrome selected through native CUA (`cua.getApp('com.google.Chrome')`), using its native app `getScreenshot()` API. Images include the Chrome tab strip, address bar and infobar, rather than just copied tab pixels. The captured native window is 1210×768 image pixels; no core-matrix viewport override was made.
- Sequences: Overview → Grow together; then, after verifying the Grow together landing in the native accessibility tree, Grow together → The beginning. The first burst contains 8 frames. The reverse burst contains 18 frames spanning 1127 ms between first and last capture starts, including multiple crease poses and the beginning landing.
- No application source edit, rebuild, permission change, global setting change, publication, or scoring change was made. Investigation tabs were closed afterward; Chrome was left on its normal New Tab surface.

## Observed evidence

The inspected native frames show the header at the same position while the paper changes orientation, camera framing and native scrollbar position. The bottom caption/chapter controls also remain at the bottom in the inspected intermediate and final frames. No 50–150 px fixed-chrome jump is visible.

A pixel comparison against the native overview baseline checked these two image-space rectangles in **all 26 frames**:

| Header region | Rectangle (left, top, right, bottom) | Maximum mean absolute channel difference |
| --- | --- | ---: |
| Handrail identity and proposal author | 20, 115, 215, 157 | **0.0** |
| Header links and reading control | 750, 115, 1200, 157 | **0.0** |

Both regions are exactly unchanged, not merely within a position tolerance. This directly excludes the reported large header displacement in those captured native frames. The controls were inspected visually; their changing caption, selection and progress are not falsely treated as a pixel-identical region. Sticky-stage motion was not separately instrumented in this narrow check.

Inspected originals include `native-forward-0.png`, `native-forward-3.png`, `native-forward-7.png`, and `native-reverse-0.png`, `native-reverse-5.png`, `native-reverse-10.png`, `native-reverse-17.png`. These contain different live object poses, so the result is not a series of stationary endpoint captures.

## Capture-surface distinction

The earlier M-R4-05 report records displacement in CDP/tab screencast evidence and a black result from shell `screencapture`. The native CUA path succeeded here and produced visible app-window pixels. Therefore **the shell's black capture was not a universal inability to obtain native window evidence in this session**.

Initial native selection attempts were bounded:

1. The test-browser bundle identifier was ambiguous across two installations.
2. Selecting the exact normal Playwright-cache app path returned `Computer Use server error -10005: timeoutReached`.
3. The optional `cua.computer.launch_app` method was unavailable in this runtime.
4. Selecting standard Chrome succeeded, so it supplied the native evidence. An unrelated running test-browser instance under a different worker checkout was not used.

The historical WebKit record documents a different protocol backface-capture anomaly. That is useful precedent for distinguishing native pixels from protocol output, **not proof that this Chromium fixed-layer issue has the same cause**. Likewise, the stale-scroll-offset/compositor-copy explanation in M-R4-05 remains a plausible mechanism; this investigation did not instrument Chromium internals or reproduce both paths simultaneously in the exact same browser build.

## Disposition and remaining boundary

- **Supported:** native standard-Chrome desktop chapter-jump captures on v4 show anchored header and controls. There is no native evidence here warranting a P1 escalation or a speculative application patch.
- **Not established:** a universal Chromium capture bug, exact equivalence with the earlier Playwright Chromium build and viewport, frame-perfect coverage between native snapshots, physical touch-fling behavior, mobile Safari, or actual iPhone rendering.
- **Recommended scoped disposition:** retain M-R4-05 as “not reproduced in native desktop capture; capture-path artifact supported for the sampled desktop sequence; physical touch case unverified.” The integration owner may use these receipts to disposition the desktop claim. Do not rewrite it as physical-device certification or a proven Chromium root cause.
- **If a further check is required:** use a real touch device or a matched native/protocol browser session to observe the particular fling/jump while recording the candidate identity. Only alter the app if the displacement appears on the native surface. No additional access or permission changes were requested in this investigation.

## Evidence

Ignored evidence directory: `qa-artifacts/final-design/fixed-chrome/`.

- `identity-before-native.json`, `native-baseline-identity.json`, `identity-after-native.json`: served candidate checks.
- `native-captures.json`: every frame name, pre-capture candidate hash, and capture timing.
- `native-baseline.png`, `native-forward-0.png` through `native-forward-7.png`, `native-reverse-0.png` through `native-reverse-17.png`: native app-window captures.
- `native-pixel-comparison.json`: all-frame header-region comparisons and image dimensions.

The native actions and captures used CUA only. Filesystem operations persisted returned screenshot bytes and calculated image differences; no shell screenshot or alternate native input mechanism was used.
