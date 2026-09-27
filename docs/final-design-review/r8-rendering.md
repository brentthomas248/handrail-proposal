# R8 — Rendering and animation engineering

**Score: 99/100. No confirmed P0–P2 product defect.** One minor evidence gap remains: this automation environment did not produce a genuinely hidden document, so hidden-tab recovery is not verified. The score describes this bounded local review, not physical-phone stability or GPU-memory certification.

## Candidate and independence

Reviewed September 27, 2026 at `http://127.0.0.1:4321/handrail-proposal/`. Main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`.

All 28 entries in `candidate-v8/identity.json` matched both `dist` and live HTTP bytes before and after review. I read the neutral task, AGENTS, PROJECT, DESIGN, local workflow, brief, redesign research and brand sources, plus renderer source. I did not read earlier reviews, scores, peer findings or IMPLEMENTATION. No app edits, rebuilds, publication or commits. Only this report and assigned ignored evidence were written. All reviewer-owned browsers are closed.

## Conditions and scope

Apple M5 Max, ARM64, 128 GiB RAM, Darwin 27.0.0; Node 25.9.0; headed Playwright Chromium 153.0.8010.12. CPU multiplier 1, no network throttling, local static server, observed display cadence about 120 Hz. Root explicitly cleared competing reviewer/root browsers and stopped Storybook before profiling. Desktop and phone contexts ran sequentially. Chromium's three background-throttling-disabling launch defaults were omitted for timing. Measurements contained no screenshots or video; captures were made separately afterward.

- Full native forward/reverse wheel traversal and screenshot-free telemetry: 1440×1000 CSS px/DPR 1 and 390×844 CSS px/DPR 3. Each direction used 150 native wheel inputs, approximately 8.7 seconds. Phone is desktop Chromium with phone geometry, DPR and touch capability; it is not iOS.
- Independent visual evidence: all five core geometries, including 320×740/DPR 3, 390×664/DPR 3 and 768×1024/DPR 1. Opening, cash, rates, window and closing captured; desktop/390-phone forward and reverse transition frames separately captured. Original images were inspected, including every opening/transition capture and representative small, short, tablet, resized and fallback reading images.
- Resilience: height change, phone/tablet breakpoint crossing and return, four read/tour cycles, touch-cancel releasing deferred resize, failed JS-module fallback, notes/resume route load.

## Rubric

| Criterion | Score | Exact reason and deduction |
| --- | ---: | --- |
| Actual frame delivery | 20/20 | Compositor and callback evidence agree on near-120 Hz delivery during native forward/reverse input. No long task or callback gap above 17 ms; no reproducible visible missing face or freeze in independent captures. Rare partial/checkerboard trace signals are disclosed below, not misrepresented as zero dropped frames. No actionable product defect established. |
| Bounded memory/layers | 20/20 | Three paper draw layers remained present in the sampled layer histories; total layers were bounded at 16–19 desktop and 20–22 phone. Intrinsic phone paper estimate is 62.89 MiB and maximum edge 3180 device px, within the stated 64 MiB/4096 px paper budgets. Mode cycling did not accumulate DOM/transcripts. No deduction; estimates are explicitly not measured GPU memory. |
| Load stability | 20/20 | Fresh isolated loads had no console/page errors or failed HTTP responses; local FCP was 40/44 ms and startup layout shift 0.000895/0. The failed-module case recovered a visible readable proposal by the 4.5-second observation. Notes/resume returned 200 without page errors. No deduction. |
| Resize/background/reversal resilience | 20/20 | Immediate reversal returned both viewports to the original opening transform; phone height changes preserved scroll and chapter, breakpoint crossing retained the chapter, touch-cancel released deferred resize, and final content stayed reachable. No product failure observed. True hidden-state coverage remains explicitly unknown and is accounted for once under evidence completeness. |
| Implementation simplicity and evidence completeness | 19/20 | One GSAP scene ticker, pure path module, semantic HTML faces and separate paper/typography responsibilities; no second scroll owner or speculative rendering library. Idle stops mutating the paper, and mode teardown removes scene ticking and transforms. **−1: R8-RENDER-E1**, because both attempted background mechanisms failed to create hidden visibility, leaving one requested lifecycle condition unproved. |
| **Total** | **99/100** | No product blocker established by this specialty. |

## Measurements

Animation callbacks are not screen presentation. `frame-delivery.json` independently summarizes Chromium DrawFrame, PipelineReporter and FrameSequenceTrackerV3 records; raw traces are retained. Duplicate pipeline reporters are not treated as independent screen frames.

| Run | rAF interval p50 / p95 / p99 / max, ms | Changed scene frames | Long tasks |
| --- | --- | ---: | ---: |
| Desktop forward | 8.30 / 9.20 / 10.10 / 16.70 | 1040/1045 intervals | 0 |
| Desktop reverse | 8.30 / 9.60 / 10.20 / 10.30 | 1046/1047 intervals | 0 |
| Phone forward | 8.30 / 9.80 / 10.30 / 16.80 | 1044/1047 intervals | 0 |
| Phone reverse | 8.30 / 9.60 / 10.20 / 10.40 | 1048/1048 intervals | 0 |

Desktop delivered 2100 DrawFrame events over 17.499 s; draw-gap p95/p99/max were 9.458/10.211/24.640 ms. Phone delivered 2103 over 17.515 s; 9.675/10.313/10.514 ms. Desktop trace included seven DroppedFrame markers, all `hasPartialUpdate=true`; phone included three. Completed RAF tracker windows reported 13/1800 desktop and 16/1801 phone missing-content/checkerboarded samples; the dropped-v4 counts were 1 and 0. These are small nonzero compositor imperfections under trace instrumentation, not proof of flawless frames. The independent visual pass did not reproduce a visible missing tile or sustained stall, so I have not invented a product defect or a broad renderer rewrite from these counters.

During each two-second idle sample, the paper had **zero style mutations and zero changed transforms**. The observer's own rAF continued at display cadence. That distinction matters: a running measurement loop is not evidence that the app still animates.

JS heap used moved from 3.11→3.50 MiB desktop and 3.09→3.46 MiB phone; telemetry retains frame records, so these deltas are not a leak measurement. Four read/tour cycles left the phone at 309 elements, one transcript, the same chapter, scroll and transform. Source inspection confirms `tick` removal on rest, `destroyTour` removal on mode changes, restoration of semantic nodes, and source-owned input listeners installed once for the page lifecycle (`motion.ts`, `paper-layout.ts`, `typography-guard.ts`).

Paper estimate: `3 × panel CSS width × panel CSS height × 4 RGBA bytes × DPR²`. All three phone geometries used 576×1060 CSS-pixel panels: **62.8857 MiB**, edge **3180**. Desktop was **25.4196 MiB** and tablet **25.6393 MiB** at requested DPR 1. This model excludes compositor tiling, caches, shadow layers and implementation-specific raster scales. LayerTree reported native-display dimensions at twice CSS layout even with emulated DPR 3; multiplying those dimensions by DPR again would be wrong. Full scroll-layer bounds are also not texture allocations. **No measured GPU-memory claim is made.**

At The window, 390×844→390×664 preserved scrollY **4780.5** and the chapter; 768×1024 retained The window at its corresponding **5333.5**; return restored **4780.5**. The touch-cancel case also recovered the short viewport and the same chapter. The screenshots show complete active groups with crisp front ink; opening/crease images preserve an actual folded object and matte material. Cropped peripheral material during continuous transitions is intentional under the brief and was not classified as clipped active reading content.

## Finding and evidence limits

**R8-RENDER-E1 — P3, evidence completeness; not a confirmed app defect.**

- **Observed:** opening a blank sibling page and bringing it forward, then a separate native-window minimize/restore attempt, both left `document.visibilityState === 'visible'`; neither produced a visibilitychange event. Both the raw timing record and `background.json` preserve that negative result.
- **User impact:** this review cannot substantiate recovery after the browser truly suspends a hidden proposal. It does not establish that users lose their place or encounter a broken scene.
- **Bounded correction:** obtain one genuine hidden→visible lifecycle run on this exact candidate in an environment where the document visibility event changes. No speculative application change is justified by this result.
- **Recheck:** record the hidden event, a brief inactive interval, visible event, preserved/settled readable scene and successful reverse native input afterward. Report any failure separately from this evidence gap.

True hidden-tab throttling, physical iPhone/Safari crash behavior, extended memory soak, thermal throttling, low-end hardware, manual assistive technology and field INP are untested. No WebKit/Firefox performance or physical-device certification is inferred. PDF bytes were identity-verified; PDF rendering and commercial-copy consistency were outside this rendering pass. Reduced-motion/no-JS comprehensive accessibility coverage was not repeated; the explicit failed-module reading path was tested. The [web.dev animation performance guidance](https://web.dev/articles/animations-guide) informed checking paint/frame behavior and avoiding unmeasured layer-cost claims.

## Artifacts

Evidence root: `qa-artifacts/final-design/r8/rendering/`.

- `identity-before.json`, `identity-after.json`: all 28 frozen assets verified twice against disk and HTTP.
- `measure.mjs`, `measurements.json`, `summary.json`: exact conditions, input, callback samples, long tasks, load, heap and layer evidence.
- `desktop-trace.json`, `phone-trace.json`, `frame-delivery.json`: screenshot-free compositor evidence and bounded summary.
- `visual-resilience.mjs`, `visual-resilience.json`, viewport-named directories: independent captures, resize and mode-cycle state.
- `background.mjs`, `background.json`: unsuccessful attempt to establish genuine hidden visibility, retained without a false pass.
- `load-fallback.json`, `module-failure-reading.png`: failed-module recovery and auxiliary-route loads.

Candidate unchanged at closeout; all owned browser processes closed. This report is final for the bounded review.
