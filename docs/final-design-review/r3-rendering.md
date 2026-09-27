# Round 3 independent review — rendering and animation engineering

**Score: 98/100. No P0–P2 product defect found in this review.** One P3 rendering refinement and one P3 verification gap remain. This is a local engineering assessment, not physical-device certification.

## Candidate and independence

Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`. The response body in every core-size run matched candidate-v3 `index.html` SHA-256 `944085d2bef0a4371beb0c148896c4490117223109c2e70ba6ca16eda6749786`, also checked against `dist/index.html` and `qa-artifacts/final-design/candidate-v3/identity.json`.

Read the neutral brief, AGENTS.md, PROJECT.md, DESIGN.md, local workflow, and relevant runtime source. Did not read prior review reports, earlier scores, remediation/progress commentary, or peer findings. No app edit, rebuild, commit, or publication was performed. The only written files are this report and the assigned ignored evidence directory.

Used the Agentic UI lifecycle/QA guidance under the repository's approved local Playwright workflow. Primary performance guidance is Google's [animation performance guide](https://web.dev/articles/animations-guide): investigate actual paint and frame behavior and avoid assuming layer promotion is free. No Stagehand/Browserbase service receipt is implied.

## Scope and scoring

Headed Chromium 153.0.8010.12 on the supplied ARM64 Mac. All five core viewports used requested DPR 3: 1440×1000, 390×844, 320×740, 390×664, and 768×1024. Each had actual forward and reverse wheel input across the complete native scroll range, post-settle idle observation, calibrated compositor-layer capture, and original overview/cash screenshots. Desktop and 390×844 received isolated CDP timing traces while the other reviewers and root kept their browsers idle. Resilience and forced-load-failure checks used 390×844. No old capture was substituted.

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Actual frame delivery | 19/20 | Responsive native input and mostly 8.33 ms reported presentation cadence on this host, without a >50 ms presentation gap. **−1:** isolated missing raster content during both timed journeys, RE3-01. |
| Bounded memory/layers | 20/20 | Three active painted paper faces, calibrated estimates below 64 MiB and 4096 device pixels at all core sizes. No layer-count accumulation during either direction. Idle animation work terminates. |
| Load stability | 20/20 | All five normal loads reached camera-ready without a failed request, HTTP error, or uncaught page error. Blocked module and delayed-font cases preserve an immediate reading exit and fall back to ordinary reading. No-JS/reduced-motion entry remains readable. |
| Resize/background/reversal resilience | 20/20 within tested scope | Height changes preserve native position and selected phone chapter. Breakpoint mapping preserves the containing section. The CDP freeze/active sequence recovers and accepts immediate reverse input. True hidden-background and OS suspension remain explicitly unproven below; their missing evidence is charged once under completeness. |
| Implementation simplicity and evidence completeness | 19/20 | One demand-driven GSAP callback owns camera progress, semantic nodes are reused for reading, there is no WebGL subsystem, and estimates/traces have reproducible local scripts. **−1:** the attempted background-window tests never produced an observed hidden visibility state; RE3-02. |
| **Total** | **98/100** | No P0, P1, or P2 finding in this category. |

## Frame delivery and idle work

`review.mjs` used 50 wheel increments per direction at each size. The desktop native range was 5,180 CSS pixels, and phone was 4,996.5 as observed. Both journeys reached the end and returned to zero. Hundreds of distinct paper transforms were observed throughout each input phase. Screenshots were taken outside timed phases.

`DrawFrame` measures compositor drawing, not screen presentation. The figures below use the **end timestamps of paired `PipelineReporter` records with `STATE_PRESENTED_*`**, filtered to the page process and layer-tree host. Reporter IDs are reused, so the analysis pairs them chronologically, then deduplicates identical presentation timestamps. rAF timestamps and draw timestamps are reported separately in `timing-summary.json`. This is browser-reported presentation evidence, not an external high-speed display measurement.

| Viewport / input | Presented frame sequences | Presentation interval p95 | Maximum interval | Missing-content frame sequences |
| --- | ---: | ---: | ---: | ---: |
| 1440×1000 forward | 249 | 16.666 ms | 25.000 ms | 4 |
| 1440×1000 reverse | 248 | 8.334 ms | 8.334 ms | 6 |
| 390×844 forward | 246 | 16.666 ms | 16.667 ms | 2 |
| 390×844 reverse | 248 | 16.666 ms | 16.667 ms | 8 |

The median presentation interval is 8.333 ms in all four phases. Compositor draw p95 is 8.49–9.19 ms. No observed page long task occurred in the normal matrix; timed paint events remained below 0.83 ms individually. These values describe this fast host and trace configuration, not expected phone FPS.

At all five sizes, after 4.2 seconds of settling, a further 1.3-second observation measured **zero additional requestAnimationFrame callbacks and zero additional paper/wings style writes**. Native position and the final transform stayed fixed. The measuring rAF sampler was explicitly stopped before this idle check.

## Surface budget and layer stability

A known 100×100 CSS-pixel `translateZ(0)` layer reported **200×200 CDP layer units** at requested DPR 3. Thus the host ratio is 2 CDP units per CSS pixel; multiplying uncorrected CDP dimensions by DPR would overstate the estimate. The budget calculation is:

`sum((reportedWidth / 2) × (reportedHeight / 2) × 3² × 4) / 2²⁰` MiB.

Only active `drawsContent` paper front/back layers enter the paper estimate. The layer dimensions include the paper edge paint. Other scene, UI, shadow, browser, tile-cache and buffering allocations are not called paper memory.

| Viewport | Layer snapshots | Peak paper MiB | Largest normalized device edge | Active paper layers | Total layer range |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1440×1000 | 319 | 56.144 | 2725.5 px | 3 | 16–19 |
| 390×844 | 321 | 63.312 | 3073.5 px | 3 | 18–20 |
| 320×740 | 320 | 63.312 | 3073.5 px | 3 | 18–20 |
| 390×664 | 320 | 63.312 | 3073.5 px | 3 | 18–20 |
| 768×1024 | 323 | 56.144 | 2725.5 px | 3 | 16–19 |

All pass the 64 MiB/4096-device-pixel contract. The phone estimate has about **0.688 MiB headroom**; it should continue to be tested after content or material changes. This is an RGBA surface estimate, **not actual GPU memory** or a bound on total browser-process memory. Short runs do not establish long-session leak freedom.

The initial pre-navigation LayerTree subscription emitted no app snapshots in this environment. Those zero/null preliminary layer results in `measurements.json` are invalid for budgets. `layers.mjs` enables the domain after navigation; `layers-summary.json` and `*-layers-calibrated.json` contain the accepted recapture. Timing/idle measurements in the first run remain independently valid.

## Load and recovery observations

- Fresh contexts in the same local browser reached camera-ready in 44–57 ms; this is a warm local-server observation, not a cold-network performance claim. All normal-load request/error lists are empty.
- At Client first, 390×844 → 390×664 preserved native `scrollY=3540.5` and the Client first chapter while refitting the scene. At 768×1024 the selection became The two paths, its containing section; returning to phone selected Hire first, the first mobile subscene of that section. This matches the declared containing-section fallback and is not exact preservation of the Client first subscene across a collapsed desktop section.
- A CDP `frozen`/`active` sequence during motion left a functioning scene. After resumption, reverse wheel input moved native scroll from 3540.5 to 3310.5 and the camera reversed; idle settling reached Hire first. This is protocol-level simulation, not macOS/iOS sleep certification.
- Blocked tour JavaScript displayed “Opening the proposal” and the immediately usable “Read without animation” link. The four-second watchdog exposed ordinary reading. Clicking the link before recovery navigated to `?view=read` and worked with the module still blocked.
- Font requests delayed by 5.2 seconds triggered the reading fallback; fonts resolving later did not unexpectedly move the reader back into the tour. The normal reading heading and document were visibly rendered.
- No JavaScript and reduced-motion entry both produced ordinary reading without the loading surface.
- Tab switching and native window minimization were attempted, including focus-emulation/background-flag adjustments. `document.visibilityState` remained `visible` and no visibility event was recorded. These attempts prove return-input behavior only; **they do not prove hidden-tab suspension or resumption**.

## Findings

### RE3-01 — P3: isolated raster readiness misses during travel

**Evidence:** `desktop-trace.json`, `phone-trace.json`, `timing-summary.json`. Each full forward/reverse timed journey reports ten unique frame sequences with `has_missing_content=true` and `checkerboarded_needs_raster=true`, roughly 2% of its reported presented frame-sequence count. Each trace also contains five `TileBasedLayerImpl::AppendQuads checkerboard` events with one missing tile. No `checkerboarded_needs_record` frames were counted. Presentation remained responsive and reviewed steady screenshots show no blank paper area.

**Impact:** the renderer occasionally submits a frame before all visible raster content is ready. That can cause a brief incomplete patch while traveling. A reader-visible flash was not conclusively captured here; this is a measured minor raster-delivery weakness, not evidence of a sustained blank page, a crash, or a GPU-memory breach. Deduction: **1 point from actual frame delivery**.

**Bounded correction:** profile the specific face-reveal/lighting-change moments and reduce the raster invalidations they cause, or prepare the soon-visible face just before reveal while preserving the three-face budget. Avoid adding broad permanent layer promotion. Keep the correction tied to the recorded miss windows; the trace alone does not establish which material operation caused each miss.

**Recheck:** replay one isolated desktop and phone forward/reverse trace with presentation pairing and missing-tile counts. Capture transition frames around the flagged moments. Accept zero missing-content sequences, or document a targeted visual/trace disposition showing that residual misses are outside reader-visible paper; retain the surface budget and idle shutdown.

### RE3-02 — P3 verification gap: actual hidden-background behavior remains unobserved

**Evidence:** `resilience.json` background-tab record, `background.json`, and `background-window.json`: visibility stays `visible` throughout both tab/window attempts and there are no visibility events. The CDP freeze/active test is separate evidence and does not replace a real hidden state.

**Impact:** this review cannot say whether returning from a genuinely backgrounded browser yields the same stable pose/input behavior. No background-related product failure was observed. Deduction: **1 point from evidence completeness**, counted once.

**Bounded correction:** add a short background/return verification on a browser surface where `visibilityState === 'hidden'` is actually observed. No speculative app refactor is requested. Only change the app if that check demonstrates a failure.

**Recheck:** record visible → hidden for at least one second → visible, then immediate forward/reverse input, the selected chapter/native position, final transform, and idle callback termination. Keep OS suspension and physical iPhone claims separate.

## Evidence and limits

All local evidence is under `qa-artifacts/final-design/r3/rendering/`:

- Reproduction: `review.mjs`, `layers.mjs`, `resilience.mjs`, `background.mjs`, `background-window.mjs`, `analyze-traces.mjs`.
- Primary metrics: `measurements.json`, `timing-summary.json`, `layers-summary.json`, five `*-layers-calibrated.json`, `resilience.json`.
- Raw traces: `desktop-trace.json`, `phone-trace.json`; input samples: five `*-samples.json`.
- Original screenshots: all five `*-overview.png`/`*-cash.png`, resize/suspend return, and initial/result captures for blocked-module, delayed-fonts, no-JS and reduced-motion entry. Individually inspected the desktop opening, phone/small/short/tablet cash-flow images, and blocked-module/delayed-font captures; no contact sheet substituted for those originals.

No physical iPhone, mobile Safari/WebKit, Android, GPU allocation counter, OS memory-pressure event, thermal throttling, extended soak, actual hidden-tab interval, field-INP or low-end-device frame budget was measured. The specialty's focus was rendering; PDF/resume editorial QA, assistive technology and full visual choreography scoring belong to their independent reviews. The observed 120 Hz host cadence is not a physical-device promise. No app changes need regression validation from this report itself; the integration owner owns disposition and the overall release gate.
