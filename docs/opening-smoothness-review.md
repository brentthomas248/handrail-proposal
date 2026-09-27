# Independent review of the first opening

Reviewed 27 September 2026. **Accepted within the inspected local scope.** The initial packet, unfolding and cover approach remain coherent, and the candidate removes the conspicuous change in zoom pace seen in the published opening. No new material opening defect was found. This is a rendered motion/design judgment, not physical-device or frame-rate certification.

## Scope and identity

The user approves the rest of the site. This review therefore covers only the fresh folded start, unfolding, transfer to the cover, full reversal and an interrupted opening. It makes no new assessment of commercial copy, later camera travel, resume, PDFs or the public profile. No application or test code was changed by this reviewer.

The review used `AGENTS.md`, `PROJECT.md`, `DESIGN.md`, `IMPLEMENTATION.md`, [the approved local workflow](local-workflow.md), [Handrail brand provenance](brand-sources.md), [the approved references](redesign-research.md) and [the motion research basis](design-research-round-3.md). The relevant principles are one continuous physical object, purposeful overview-to-detail travel, matte material, complete framing and input-owned reversal. Earlier review grades did not determine this decision.

The local production build was served at `http://127.0.0.1:4321/handrail-proposal/`. At review, `src/scripts/motion.ts` SHA-256 was `981052d11a3ff3698481275f03397cd61f5d13ff36cdbe775b54b5c343677b44`, and `dist/index.html` was `a00a911bd51082edfbf2a245ae998a57b552cbe74e5cddbc671f8b68788e7983`. The comparison was independently captured from the [published original](https://brentthomas248.github.io/handrail-proposal/) before this candidate was published.

## Method

Headed Chromium used fresh isolated contexts at 390 × 844, 320 × 740, 390 × 664, 1440 × 1000 and 820 × 1180. Phone contexts used DPR 3, mobile emulation and touch capability. Each began at the fresh packet and received actual wheel input before any chapter navigation or earlier traversal. The helper captured viewport screenshots, continuous browser video, per-animation-frame transforms and panel geometry, page errors and HTTP error responses. After the cold pass it visited the cover, reversed through the opening, then changed direction during a partial opening and paused.

The published original was separately captured at 390 × 844 and 1440 × 1000 with the same helper. The reviewer inspected the forward and reverse screenshot sequences, matched original/candidate contact sheets, and full-resolution grazing, overview and cover frames. Screenshots add capture overhead; the sampling is evidence of composition and path behavior, not unbiased performance measurement.

Commands, from the repository root:

```sh
node qa-artifacts/opening-smoothness/reviewer/capture-review.mjs candidate
node qa-artifacts/opening-smoothness/reviewer/capture-review.mjs published https://brentthomas248.github.io/handrail-proposal/
node qa-artifacts/opening-smoothness/reviewer/summarize.mjs
```

The local workflow explicitly omits credentialed Stagehand and Browserbase. The runtime-safety validator returned `ok: true` and `liveQaMayLaunch: true`; no service credentials or private browser profile were used.

## Findings and disposition

### OPEN-01: uneven camera retreat — resolved in the reviewed candidate

The original phone opening holds nearly the same object scale through the first two fold intervals, then contracts abruptly as the wings cross their grazing orientation. Independent samples near 146°, 128°, 110°, 92°, 74°, 56° and 38° give scales **.416, .390, .374, .253, .194, .173, .166**. The .374 → .253 interval is approximately a 32% contraction. In the original desktop sequence the scale first falls, then increases, then falls again while the paper continues to open.

The candidate distributes retreat across the opening. The corresponding phone scales are **.416, .314, .250, .209, .184, .170, .166**. This produces a visible early pullback that progressively relaxes as the object opens. The middle no longer presents the same sudden collapse in size. Desktop scales decrease gently from .288 to .264 throughout the reveal rather than reversing the dolly. The smaller desktop overview is a real change: approximately 922px wide at the first completed reveal, 64% of the 1440px viewport. It remains substantial and clearly establishes the three-panel object; the later cover reading pose remains intact.

The paper still opens physically. Both creases visibly change from a strongly folded packet to the spread, the rust center provides a stable spatial reference, and the edges stay connected. Temporary self-occlusion and nearly edge-on wings occur naturally during the fold; they are not evidence of a missing panel. The inspected grazing frames show thin attached edges, matte surfaces and coherent shadows, without a detached leaf, blank flash or mirrored cover arrival.

### Whole-object framing and cover transfer — retained

All three panels become visible before the camera transfers to the cover. The full silhouette remains inside the viewport and between the actual header and controls during the unfolding. This was checked visually as well as geometrically.

| Viewport | Sampled opening frames | Smallest margin to viewport/header/controls | Clipped opening frames |
| --- | ---: | ---: | ---: |
| 390 × 844 | 217 | 30.8px | 0 |
| 320 × 740 | 194 | 28.8px | 0 |
| 390 × 664 | 190 | 32.3px | 0 |
| 1440 × 1000 | 265 | 53.3px | 0 |
| 820 × 1180 | 316 | 27.8px | 0 |

These 1,182 frames end at the first completed 38° reveal. Later cover travel intentionally crops peripheral panels and is not misclassified as unfolding failure. The narrow and short phones preserve the cover's complete introductory line, headline, collected-revenue message and partnership statement at the first reading arrival. Header and chapter controls stay clear. The tablet retains its one-line navigation.

### Reversal and physical continuity — retained

All five contexts return through actual reverse wheel input to native scroll 0 and the initial 146° packet. In the interrupted sequence, reversing at native scroll 300 to 160 increases the fold angle in every viewport; after damping finishes, the scene remains at the reader's chosen 160px position rather than advancing into the reveal. The screenshots show the same connected object folding back, with no direction-dependent missing face or forward jump in these sessions.

Across the seven candidate/original contexts there were zero page errors and zero HTTP responses at status 400 or greater.

## Evidence and limits

Ignored evidence is under `qa-artifacts/opening-smoothness/reviewer/`:

- `capture-review.mjs`, `summarize.mjs` and `comparison.json` preserve the exact capture and measurement method.
- `candidate/` contains 150 viewport screenshots, five browser videos, full per-frame capture data, summarized facts, and forward/reverse contact sheets for all five viewports.
- `published/` contains 60 original screenshots, two videos and matching data. `phone-comparison.jpg` and `desktop-comparison.jpg` show the compared sequences.

This review finds the refined choreography acceptable and preserves the full unfolding requirement. It does not establish the cause of every possible physical-device stutter. It does not certify iPhone Safari, touch performance, browser-process memory, field INP or later-site behavior. The release owner separately owns the regression suite, isolated cold profiling, WebKit checks, budgets and hosted verification; this report does not treat those uninspected results as reviewer evidence.
