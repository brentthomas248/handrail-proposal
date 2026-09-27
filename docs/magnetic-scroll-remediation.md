# Magnetic reading stops

Status: locally verified; publication pending.

## Intent and scope

The user now requests that every small scroll magnetically complete a transition to a concrete stop, never leaving the flyer resting between scenes. This explicitly supersedes the earlier small-nudge hold policy and its tests. The approved paper, opening curve, content and reading compositions remain the design basis.

Finding MAG-01: the existing 180px minimum settling dead zone, 3px direction threshold and 650ms idle delay intentionally leave intermediate positions stationary. Refit and input cancellation can also discard pending completion.

## Implementation contract

- Preserve native scrolling during an active gesture, including touch momentum. After about 140ms without vertical movement, complete the nearest concrete stop in the last movement direction with a firm eased pull.
- Concrete stops are the folded packet, full opened overview and each existing complete reading composition. Small nudges must work both ways, including 1px travel. Exact arrivals do not automatically chain to another scene.
- Fresh reverse input cancels the current pull and selects the stop in the new direction. Held touch delays completion; release and cancellation rearm it. Horizontal scrolling, pinch gestures and no-movement taps do not advance the tour.
- Refit preserves pending completion so changing mobile browser height cannot leave an intermediate resting pose. Clamp the final camera tail to the last complete reading pose.
- Reading mode, reduced motion and no-JavaScript content retain ordinary document behavior.

## Work and acceptance evidence

Owner: root. Independent source audit: magnetic_scroll_audit. Existing incompatible interaction tests are updated separately from new magnetic behavior coverage.

Expected source: `src/scripts/tour-path.ts`, `src/scripts/motion.ts`. Tests: pure destination selection, new `tests/e2e/magnetic-scroll.spec.ts`, and existing motion/proposal compatibility assertions. No renderer, texture, dependency, commercial-content or PDF changes.

Verify with `pnpm check`, `pnpm test`, `pnpm build`, focused magnetic and existing gesture tests, the full Chromium suite after compatibility updates, targeted WebKit behavior, independent rendered touch/wheel review and hosted checks. Retain continuous-path, complete-group framing and high-DPR budget regressions. Run current rendered review before publishing under the approved local workflow; do not infer physical iPhone certification.

## Results

The previous release failed all three initial repro checks: both 1px opening nudges stayed folded, and the terminal tail rested beyond the final scene. The first magnetic candidate passed all ten new interaction checks and 31 unit checks.

The full Chromium run passed 198 of 199 checks. The single failure was an altered test fixture that held touch during an existing resting-silhouette check. Restoring released-input semantics and waiting for the concrete arrival retained all geometry thresholds; both affected viewport cases then passed. Continuous intermediate opening geometry has separate passing coverage. Original failure artifacts are retained.

Supplementary WebKit exposed a real small-reversal defect: its first wheel event can interrupt programmatic scrolling without moving the native offset. Direction now comes from the vertical wheel event as well as native scroll movement, so a consumed reverse delta cannot restart the old forward pull. All four opening/reversal rechecks pass at 390px and 1440px. Two other WebKit failures were test-actuation/observer issues: the End key targeted the last clicked horizontal chapter strip until blank stage was selected, and nested 3D IntersectionObserver reported 60% visibility despite complete text and section bounds fitting the safe area. Both corrected cases pass, with geometry thresholds retained and stronger full-line checks. Exact arrivals clear direction, and the opened overview has a settled “The full proposal” caption.

Typecheck covers 46 files with zero issues; all 31 unit checks, formatting and the production build pass. Twenty-six of 28 output files are byte-identical to the previous release; only the scene script and main HTML script reference changed. All 27 final focused Chromium checks and all 11 WebKit checks pass without retries. The independent current rendered review accepts the candidate after 40 exact arrivals and 28 held-touch checks across desktop and two phone sizes, with no automatic chaining or clipped primary reading groups. Reversal, pending resize, bursts and reading escapes pass. Keep the current pull timing. Hosted verification remains pending.

Ignored evidence: `qa-artifacts/magnetic-scroll/` holds the red repros, initial candidate, full-suite log, corrected fixture recheck, WebKit traces and 28-file candidate identity. Source review found no concrete blocker in input ownership, rounding, refit, mode changes or history restoration.
