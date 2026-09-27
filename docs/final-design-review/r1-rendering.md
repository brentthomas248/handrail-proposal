# R1 — Rendering and animation engineering

**Score: 99/100. No P0–P2 finding in this specialty. One P3 refinement.** Independent review of application commit `33f64ef` at `http://127.0.0.1:4321/handrail-proposal/`, 27 September 2026. Initial repository HEAD was `a499369`; served `dist/index.html` SHA-256 was `a8f6065370756d541c0c4d5543139e6d8bd19db3f150403a19b22d0e3c81dbec`. Source inspection preceded subsequent remediation edits; source references below describe the frozen application.

## Scope and grades

Headed Chromium 153.0.8010.12, Playwright 1.63, native macOS ARM64 hardware, no CPU/network throttling. Actual wheel-driven forward/reverse traces at 1440×1000/DPR1 and 390×844/DPR3. Startup, cover/transition/final captures also cover 320×740/DPR3, 390×664/DPR3 and 768×1024/DPR2. Read only this neutral brief and project instructions, not other reviewers' reports.

| Criterion | Score | Reason / exact deduction |
| --- | ---: | --- |
| Actual frame delivery | 19/20 | Sustained travel stays responsive at the host's observed ~120 Hz cadence. Rare desktop delivery gaps and avoidable progress-indicator layout/paint leave a minor refinement: **−1, R1-REN-01**. |
| Bounded memory/layers | 20/20 | At most three retained drawn paper faces. Normalized DPR3 paper estimate 59.17 MiB, maximum edge 2,872.5 device px: below 64 MiB/4096 px. No idle paper mutations or node growth. |
| Load stability | 20/20 | Normal fresh contexts mount successfully; blocked script and delayed fonts recover to visible ordinary reading. Aborted fonts still mount with fallback typography. No ordinary-run request failures, page errors or crashes. |
| Resize/background/reversal resilience | 20/20 | Height changes preserve native scroll/chapter, breakpoint changes preserve the corresponding section, repeated reversals respond, synthetic renderer suspension recovers. Native backgrounding remains an explicit test limit, not claimed proof. |
| Implementation simplicity and evidence completeness | 20/20 | One demand-driven GSAP ticker; pure geometry/path module; semantic HTML restored through a small mounting boundary. No WebGL/scroll-engine duplication or idle decorative animation. Fresh reproducible traces, calibrated layer estimates, load/resize receipts and headed captures support this assessment. |

## Measured evidence

Each trace contains two complete forward/reverse wheel cycles (~12 seconds, 90 wheel increments per direction). Counts use trace `Display::FrameDisplayed` timestamps, deduplicated by timestamp; these are browser presentation notifications, not endpoint-test or Lighthouse FPS. `requestAnimationFrame` samples separately verify changing scene progress. Trace instrumentation itself adds overhead.

| Sample | Distinct presentation notifications/s | p95 interval | Maximum interval | `DroppedFrame` events |
| --- | ---: | ---: | ---: | ---: |
| Desktop initial, reviewer contention possible | 111.69 | 16.67 ms | 25.00 ms | 20 |
| Phone emulation, same native host | 113.45 | 16.67 ms | 16.67 ms | 4 |
| Desktop repeat after other reviewers completed | 113.26 | 16.67 ms | 33.33 ms | 24 |

The repeat had one gap above 25 ms; no long tasks ≥50 ms were observed. Neither result establishes phone hardware performance. Three seconds of settled idle in every trace produced **zero stage mutations, layouts, style recalculations and animation script duration**; approximately 1–1.7 ms total task time includes the measuring commands. No sustained idle loop was found.

CDP layer dimensions required calibration: this Retina host reports legacy device-space dimensions at **2× CSS pixels**, even when emulated `devicePixelRatio` is 1 or 3. `layer-calibration.json` proves this against live face widths and `Page.getLayoutMetrics`. Normalize each dimension by 2 before applying emulated DPR; blindly multiplying the raw layer values by DPR would falsely fail the budget by 4×. Estimates count retained drawn paper layers, including offscreen ones, and include their reported paint bounds. They are **not measured GPU allocation**. Max whole-page layer counts were 20 desktop / 21 phone; drawn counts 11 / 12. Desktop paper estimate was 23.39 MiB.

`stability.json` records all five final scenes reached with finite transforms. At Hire first, 390×844 → 390×664 → 390×844 retained exactly `scrollY=2860.5` and the same chapter. Crossing to 768×1024 selected The two paths; returning restored Hire first and its original scroll. Script abort and six-second font delay had visible reading content by 4.5 seconds, matching the four-second recovery timer. Three additional ordinary loads passed. `freeze.json` records a 2.2-second CDP renderer freeze, successful settling on resume, and immediate subsequent reversal without errors.

## Finding

**R1-REN-01 — P3 minor: progress mark causes avoidable layout and paint during camera movement.**

- **Evidence:** Frozen `src/scripts/motion.ts:430` writes `--tour-progress` each rendered frame. Frozen `src/styles/global.css:781` and `:1130` consume it as animated pseudo-element `height`. The active phone trace records 1,456 layouts, 1,346 paints attributed to `SPAN.scroll-line`, and 1,432 SVG shadow paints. Desktop repeat records 1,438 layouts; occasional frame gaps remain despite no long tasks. See `paint-targets.json`, `desktop-repeat-summary.json` and raw traces.
- **User impact / confidence:** Minor unnecessary work while scrolling reduces available frame headroom. Its own measured paint cost is small (~7.72 ms summed over the 12-second phone trace). This is not evidence that this marker alone causes the rare missed cadence, or that physical phones stutter.
- **Bounded correction:** Keep its full height fixed and express the fill using `transform: scaleY(...)` with a top origin, preserving current minimum/maximum visual lengths on desktop and phone. Do not remove material lighting or introduce broad layer promotion to chase this small cost.
- **Recheck:** Repeat the same headed forward/reverse trace, confirm marker-attributed repeated paint/layout is reduced, unchanged appearance and input response, and no paper-layer/budget regression. SVG and lighting work may legitimately remain.

## Artifacts and limits

Evidence is under `qa-artifacts/final-design/r1/rendering/`: `measure.mjs`, `summarize.mjs`, three `*-metrics.json`/`*-summary.json` pairs, compressed `*-trace.json.gz`, `layer-calibration.json`, `paint-targets.json`, `stability.json`, `freeze.json`, and original headed PNGs. Reviewed originals include desktop/phone starts, phone cover/transition/resize, small final and script-failure fallback. Traces can be decompressed for Chrome/Perfetto inspection.

Not tested: physical iPhone/Safari, memory-pressure termination, native OS background/foreground suspension, thermal/battery behavior, long-duration soak, field INP, or other browser engines. The attempted background-tab check remained `visibilityState=visible`; it is explicitly **not** background coverage. CDP freeze/resume is only a synthetic interruption check. PDFs/resume/portfolio, keyboard/assistive technology and subjective choreography are outside this specialty. No build, application edit or publication was performed by this reviewer.

Profiling rationale follows the primary-source [web.dev animation guidance](https://web.dev/articles/animations-guide): inspect actual layout/paint/frame behavior, prefer transforms where appropriate, and avoid speculative layer promotion.
