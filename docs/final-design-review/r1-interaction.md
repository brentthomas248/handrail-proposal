# Independent review: inclusive interaction and responsive UX

**Score: 90/100. Two material findings require correction or an evidence-backed disposition before release.** No critical or major finding was established. This is an independent design assessment, not WCAG certification.

## Candidate and scope

Reviewed 27 September 2026 against the frozen headed Chromium page at `http://127.0.0.1:4321/handrail-proposal/`, application source `33f64ef7e648ec740cf443120663faba0d39d218`. Checkout HEAD was `a499369a8629c3007de53760b0345446b6e77476`; `git diff 33f64ef..HEAD -- src` returned no changes. [Captured response identity](../../qa-artifacts/final-design/r1/interaction/candidate.json).

Fresh viewport captures and interactions covered desktop 1440×1000, phone 390×844, narrow 320×740, short 390×664, and tablet 768×1024. Spacing stress additionally used desktop 1440×844 and phone 390×850 after resizing. All tour chapter controls were activated across the five core sizes. Ordinary reading, reduced motion, JavaScript disabled, keyboard navigation, notes anchors, history restoration, and both document downloads were exercised. Both two-page PDFs were rendered and inspected. No application edits, rebuild, publication, or external messages were made.

The repository's approved local workflow supersedes credentialed-service defaults. Evidence is my own headed Chromium capture and interaction, plus local PDF rendering; no other review reports or scores informed this assessment. The mandated project documentation and current implementation checkpoint were read for environment/candidate context; its prior validation assertions were not used as acceptance evidence.

## Scores and exact deductions

| Criterion | Score | Reason |
| --- | ---: | --- |
| Navigation and affordance | **17/20** | The visible reading escape and desktop chapter labels are strong. −2 for phone dot controls hiding their destinations from sighted users (R1-INT-03); −1 for removing direct proposal-notes access from the phone header (R1-INT-04). |
| Keyboard/focus | **20/20** | Visible keyboard focus, working skip link and chapter activation; paper-link focus restores normal reading and keeps the link visible. No actionable keyboard failure was found in the tested paths. |
| Responsive/reflow/spacing resilience | **14/20** | Default pages fit the tested widths, and notes/resume cope well with the stress settings. −4 for tour failure after spacing changes and compressed/overlapping rates after remeasurement (R1-INT-01); −2 for the ordinary-reading headline requiring horizontal scrolling at 320px with spacing overrides (R1-INT-02). |
| Reduced-motion/no-JS reading | **20/20** | Both independently loaded a complete ordinary document with the economic terms and closing notes link. No actionable defect was found in these default-style paths. |
| Links/history/document usability | **19/20** | The tested notes anchors, downloads, persistent reading preference, and ordinary browser Back paths work. Both PDFs are legible and tagged. −1 for losing the closing chapter when re-entering the tour after returning from its notes link (R1-INT-05). |
| **Total** | **90/100** | Deductions: 2 + 1 + 4 + 2 + 1 = 10. |

## Findings

### R1-INT-01 — P2 material: user text spacing invalidates the tour's reading layout

**Observed behavior and impact.** Applying the four WCAG text-spacing values after initialization leaves the measured camera composition stale. At 390×844, the Client first rationale, future-credit scope, and benefits fall below the fixed controls. At desktop 1440×844, the two-path composition ends around the recurring-rate line and omits the explanations from the selected reading pose. The user has explicitly requested easier-to-read text, yet essential qualifications disappear from that composition.

This is not solely an observer omission: injecting the overrides before initialization or resizing afterward makes the camera refit a much taller group, shrinking the phone text severely and colliding the 20% and +5% rate marks. Remeasurement alone is therefore an incomplete fix.

**Evidence.** [Phone after-load override](../../qa-artifacts/final-design/r1/interaction/tour-spacing-390-client-first.png), [desktop after-load override](../../qa-artifacts/final-design/r1/interaction/tour-spacing-1440-the-two-paths.png), [phone override before initialization](../../qa-artifacts/final-design/r1/interaction/spacing-before-load-390.png), [phone after resize](../../qa-artifacts/final-design/r1/interaction/spacing-after-resize-390.png), [measured paragraphs](../../qa-artifacts/final-design/r1/interaction/spacing-confirm.json). Reproduction scripts: [deep-check.mjs](../../qa-artifacts/final-design/r1/interaction/deep-check.mjs) and [spacing-confirm.mjs](../../qa-artifacts/final-design/r1/interaction/spacing-confirm.mjs).

**Bounded correction.** Prefer a complete ordinary-reading layout when user text metrics invalidate the authored camera compositions, rather than enlarging paper surfaces or shrinking the whole group until it technically fits. Preserve the current semantic section and any keyboard focus, align it below the fixed header, and retain the user's CSS. Prevent immediate automatic tour re-entry while the altered layout cannot preserve readable complete groups. Handle overrides present before initialization and those applied later. Normal reading must independently pass R1-INT-02.

**Recheck.** At 320, 390, 768, and 1440 CSS px, apply line-height 1.5, paragraph spacing 2em, letter spacing .12em, and word spacing .16em before and after startup. Every affected heading, rate, rationale, scope and benefits statement must remain readable and reachable without collisions or lateral clipping. If the app selects reading mode, verify preserved section/focus and full content flow after resize, reload and mode interaction. Verify no renderer-budget increase is used to mask the issue.

**Basis.** [WCAG 2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) requires that user overrides preserve content and functionality. Those values are a resilience test, not a demand that the default aesthetic use wider tracking or larger paragraph margins. This review identifies a failure of the tested tour presentation; it does not assert whole-site conformance status without evaluating any claimed alternative-version mechanism.

### R1-INT-02 — P2 material: normal-reading headline overflows at 320px under spacing overrides

**Observed behavior and impact.** In ordinary reading at 320×740, the unbroken word “Handrail.” extends beyond the viewport. Its text box ends at x=329.57px; `documentElement.scrollWidth` is 329px for a 320px viewport. Horizontal scrolling reaches approximately 9.5px. The last character is partly off-screen on arrival, and reading requires movement in two directions. Default spacing does not reproduce this overflow. Notes and resume did not show comparable document-width overflow in the same 320px stress case.

**Evidence.** [Narrow ordinary reading with overrides](../../qa-artifacts/final-design/r1/interaction/small-read-spacing.png); `overflow-detail` and `horizontal-scroll-possible` in [deep-observations.json](../../qa-artifacts/final-design/r1/interaction/deep-observations.json).

**Bounded correction.** Make ordinary-reading display typography resilient to user tracking: permit emergency wrapping of a long word or otherwise select a responsive size that retains the entire word within available width. Do not disable user spacing or hide horizontal overflow to conceal the text.

**Recheck.** At 320px with the four spacing settings, the entire heading must be visible through vertical reading, and document width must not exceed the viewport. Repeat at normal styling, reduced motion, and JavaScript disabled to avoid breaking the shared fallback layout.

**Basis.** [WCAG Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) and [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). The latter uses a 320 CSS-pixel width for vertically scrolling content; this ordinary prose headline does not require a two-dimensional layout.

### R1-INT-03 — P3 minor: phone chapter destinations are visually undiscoverable

**Observed behavior and impact.** Below the tablet breakpoint, every chapter label becomes an identical small dot. The current chapter is named in the caption, but a sighted user cannot identify another destination before selecting it. Keyboard focus on a dot outlines it without exposing its name. Revisiting “Client first” or “The window” requires remembering the dot order or trial activation.

The actual targets are approximately 42×44px at 320px and have descriptive accessible names. This is **not** a target-size or missing-accessible-name failure.

**Evidence.** [Phone controls](../../qa-artifacts/final-design/r1/interaction/phone-the-beginning.png), [keyboard focus on the closing dot while the caption still says “Scroll to unfold”](../../qa-artifacts/final-design/r1/interaction/small-tab-12.png), and measured controls in [observations.json](../../qa-artifacts/final-design/r1/interaction/observations.json).

**Bounded correction.** Give phone users a compact named chapter selector, or reveal the focused/targeted chapter name before activation. Preserve the existing practical target areas and non-obscuring control footprint.

**Recheck.** A sighted keyboard or touch user must be able to choose a named chapter without first activating unknown dots. Check 320×740 and 390×664 for control overlap or content loss.

**Basis.** Product navigation judgment, not an invented WCAG requirement that every chapter button display a full text label. [WCAG Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) includes size and spacing exceptions; the observed dot targets already meet the basic 24px dimension threshold.

### R1-INT-04 — P3 minor: direct proposal-notes access disappears on phone

**Observed behavior and impact.** The phone header retains resume and GitHub links but hides “Proposal notes.” To reach the supporting business terms, a phone reader must find the final chapter or enter ordinary reading and navigate to its end. The desktop's immediate notes route is absent precisely where chapter names are also hidden.

**Evidence.** [Phone opening](../../qa-artifacts/final-design/r1/interaction/phone-opening.png), [small opening](../../qa-artifacts/final-design/r1/interaction/small-opening.png), compared with [desktop opening](../../qa-artifacts/final-design/r1/interaction/desktop-opening.png). The notes link is still available in the closing content and footer; this is added friction, not total inaccessibility.

**Bounded correction.** Preserve a direct named notes entry in a compact phone navigation arrangement, prioritizing the proposal's decision-support document alongside the reading control. A compact disclosed navigation may work if its control is visible and keyboard operable.

**Recheck.** From a fresh phone opening, reach Proposal notes directly by touch and keyboard without completing or guessing the tour. Retest all header actions at 320px and with text-spacing overrides.

**Basis.** The project's DESIGN.md requires direct notes/PDF access; this is a proportional discoverability finding rather than a claim that WCAG prescribes the header's information order.

### R1-INT-05 — P3 minor: return from closing notes loses the intended tour chapter

**Observed behavior and impact.** At desktop: focus and activate Grow together, Tab to its paper notes link (correctly switching to normal reading), open notes, go Back, then select Take the tour. Back restores the reading scroll position, but tour re-entry chooses The window instead of Grow together. The reader is moved one section backward despite making no intervening reading gesture. Opening notes from the header while at Cash flow and going Back correctly restores Cash flow.

**Evidence.** Ordered `chapter-enter`, `paper-link-focus`, `back-from-paper-notes`, and `tour-after-notes-back` records in [deep-observations.json](../../qa-artifacts/final-design/r1/interaction/deep-observations.json); [focused closing link](../../qa-artifacts/final-design/r1/interaction/keyboard-paper-link.png), [restored reading position](../../qa-artifacts/final-design/r1/interaction/back-from-paper-notes.png).

**Bounded correction.** Preserve the semantic reading-group identifier along with mode/scroll history, using it for tour re-entry until a new deliberate reading gesture selects a different section. Avoid making pixel scroll position the only source of semantic restoration after a document round trip.

**Recheck.** Repeat the exact sequence using keyboard and pointer; return to Grow together. Then deliberately scroll the restored ordinary document to another section and verify that the newer reading intent takes precedence. Keep the already-correct Cash flow header-link Back behavior.

## Positive verification and evidence limits

- Desktop and narrow-phone Tab traversed visible header and chapter controls with clear focus. Enter activated the closing chapter. The subsequent paper-link focus restored normal reading and left the link fully visible. Skip-to-content entered normal reading. The tested focus was not entirely obscured by authored overlays, consistent with [WCAG Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html); this AA requirement should not be misstated as an absolute ban on any partial overlap.
- Actual PageDown moved from the opening to The beginning and then Cash flow; End reached Grow together; Home returned to Overview. Wheel forward and reverse changed both native scroll and camera transforms. [Input records](../../qa-artifacts/final-design/r1/interaction/input.json). This is interaction evidence, not a frame-performance certification.
- Read normally persisted after reload. Fresh reduced-motion and no-JavaScript contexts presented the same complete semantic reading sequence through the closing notes link. [Reduced-motion ending](../../qa-artifacts/final-design/r1/interaction/reduced-read-end.png), [no-JS ending](../../qa-artifacts/final-design/r1/interaction/nojs-read-end.png).
- Seven notes TOC links changed fragments and reached the corresponding sections. Both download controls produced the intended PDFs with no download failure. Each PDF has two pages, text, a structure tree and outline entries; the resume preserves its five expected URI links. All four rendered PDF pages were visually inspected. [PDF metadata](../../qa-artifacts/final-design/r1/interaction/pdf-metadata.json). Tagged structure alone is not proof of correct assistive-technology reading order. Poppler emitted Type 3 glyph bounding-box warnings while rendering; no visible missing text was identified in the inspected pages.
- Axe reported zero violations in the four default-style 390px views tested: tour opening, ordinary reading, notes, and resume. Tour had incomplete contrast/ARIA checks; resume had an incomplete ARIA check. [Axe evidence](../../qa-artifacts/final-design/r1/interaction/axe.json). These automated results do not contradict the manually reproduced spacing defects or establish conformance.
- Physical phones/tablets, Safari/WebKit, manual VoiceOver, switch input, actual browser-chrome 400% zoom, PDF reader keyboard/reading order, external destination workflows, and field performance were **untested**. The 320 CSS-pixel check is effective-width reflow evidence, not a claim of physical-device or assistive-technology certification. No credentialed Stagehand or Browserbase coverage is claimed.
