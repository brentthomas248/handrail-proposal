# R8 independent review — inclusive interaction and responsive UX

**Score: 100/100 within the tested scope. No actionable product defect found.** This is an independent design assessment of the frozen candidate, not accessibility certification or physical-device acceptance.

## Candidate and independence

Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`. Main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`. All 28 manifest routes/assets matched both before and after review, including the two document routes and PDFs. Evidence: `qa-artifacts/final-design/r8/interaction/identity-start.json` and `identity-end.json`.

Read the neutral task, AGENTS, PROJECT, DESIGN, approved local workflow, neutral brief, original research and brand provenance. Did not read earlier reviews, scores, remediation, peer findings or IMPLEMENTATION. Did not edit the application, rebuild, publish, or use private material. The lifecycle router selected the QA route without blockers; credentialed services remained omitted under the explicit local workflow. Only this report and its assigned evidence directory were written. All independently launched browsers closed before the separate rendering timing pass.

## Scope and method

Used isolated headed Chromium and inspected original PNGs, not only contact sheets. Viewport dimensions below are CSS pixels; most phone captures use device scale factor 3, so their image dimensions are larger. No camera-scale or effective-type claims are inferred from screenshot pixel dimensions.

| Viewport | Representative rendered and interaction coverage |
| --- | --- |
| 1440×1000 | Overview; actual forward and reverse wheel travel through the narrative; collections, both rates and closing; full keyboard sequence into the paper document link; ordinary reading |
| 390×844 | Every face-on phone reading chapter; notes navigation and browser Back; touch input forward/reverse; skip-link activation; ordinary reading; reduced-motion and no-JS initial/semantic views |
| 320×740 | Collections, client-first and complete 90-day sequence; ordinary reading; user-spacing override; proposal notes and resume at default and overridden spacing |
| 390×664 | Short-screen collections and window; reading scroll then return to the tour |
| 768×1024 | Combined compensation paths and closing; ordinary reading |

Additional checks: fresh shared `#paths` URL and `?view=read#window`; notes table-of-contents navigation and browser Back; both PDF downloads; accessible heading/content tree; 11 axe scans. The core checks exercise complete user tasks; they do not reproduce the owner's full regression suites.

## Scores and exact deductions

| Criterion | Score | Evidence and rationale |
| --- | ---: | --- |
| Navigation and affordance | 20/20 | Header document/resume/portfolio links and Read normally remain visible. Named chapter controls, current chapter text and count make location understandable. Phone chapter navigation scrolls horizontally as selection advances, keeping the active choice visible. Native wheel and emulated touch changed the journey in the requested direction. No deduction. |
| Keyboard/focus | 20/20 | Thirteen successive desktop Tab steps traverse skip link, header links/mode, chapters, then the proposal notes link. Focus rings are visibly strong and remain in view. Tabbing through chapter controls preserves the tour; reaching the paper link changes to reading and focuses the visible original link. Phone Skip to content switches to ordinary reading at the beginning. Complete narrative and correctly named table are exposed in the accessibility tree. No deduction. |
| Responsive/reflow/spacing resilience | 20/20 | All five viewports preserve controls and complete sampled reading groups. The short phone collections scene includes the example, both rates, retained-cash labels, difference and before-costs qualification. Both phone rate scenes retain rationale and common terms. Ordinary reading has zero horizontal document overflow in the matrix. At 320px, line height 1.5, paragraph spacing 2em, letter spacing .12em and word spacing .16em reflow the proposal, notes and resume without horizontal overflow or observed content loss. No deduction. |
| Reduced-motion/no-JS reading | 20/20 | Both fresh contexts start in reading mode and retain the full semantic narrative, table, both rate choices, 90-day condition and closing link. Reduced motion is clearly indicated; no-JS does not leave an inert tour button. Their opening compositions are immediately legible. No deduction. |
| Links/history/document usability | 20/20 | `#paths` opens at Hire first; explicit reading URL plus `#window` opens the whole 90-day section. Notes return restores Grow together and subsequent wheel input moves the scene. Scrolling normally from the short-screen reading view and choosing Take the tour returns to Client first. Notes TOC anchors and Back work. Both visible download actions produce the expected PDFs with no download failure and hashes matching the frozen manifest. Notes and resume have clear return actions and usable 320px layouts. No deduction. |
| **Total** | **100/100** | **0 points deducted.** |

## Findings and dispositions

No P0, P1, P2 or P3 product defect was supported by the observed evidence. There is therefore no corrective implementation request from this specialty. A score of 20 uses the brief's anchor of no actionable defect within the stated scope; it does not mean every browser or assistive technology was tested.

The following were inspected and deliberately not promoted to defects:

- Phone chapter labels partially visible at the scroll-strip edges are a consequence of the horizontally scrolling list; the selected chapter remains readable, is separately named immediately above, and is reachable by keyboard and pointer. This is not a clipped essential-content finding.
- The 320px user-spacing override can break the display word “Handrail” across lines. The word remains complete and the document reflows. A more elegant wrap would be a typographic preference; there is no demonstrated access loss under this override.
- Peripheral panels are cropped during actual camera travel. The sampled face-on reading compositions retain their complete ideas, while ordinary reading remains available.
- DOM `textContent` concatenates some display spans without spaces, but the actual accessibility snapshots expose “Let’s grow Handrail.” and “New business. Room to grow.” correctly. No screen-reader pronunciation defect is inferred from the raw DOM string.
- The initial axe integration rejected the helper's `browser.newPage()` context. Direct installed axe injection completed the scans. A no-JS injection attempt could not execute and was omitted from axe counts; no-JS content was checked through rendered and accessibility-tree evidence. These are review-tool limitations, not product failures.
- The attempted portfolio popup used the incorrect exact accessible name `GitHub`; the actual link is `Explore my GitHub`. It failed before activation. The actual target and new-tab description were inspected, and a separate HTTP GET to the profile returned 200. Live popup completion remains untested rather than being reported as a dead link.

## Evidence index

All files below are in `qa-artifacts/final-design/r8/interaction/`.

- Machine evidence: `results.json`, `flows.json`, `tour-aria.txt`, `protocol-notes.json`, both identity files. `review.mjs`, `flows.mjs` and `probe.mjs` preserve the independent probes; the portfolio selector limitation is recorded above.
- Focus: `desktop-tab-1.png`, `desktop-tab-4.png`, `desktop-tab-11.png`, `desktop-tab-13.png`, `phone-skip.png`.
- Representative original reading views: `1440x1000-the-two-paths.png`, `390x844-the-beginning.png`, `390x844-cash-flow.png`, `390x844-client-first.png`, `390x844-grow-together.png`, `320x740-the-window.png`, `390x664-cash-flow.png`, `768x1024-the-two-paths.png`.
- Actual scroll input: `desktop-forward-8.png`, `desktop-forward-19.png`, `desktop-reverse-5.png`, `touch-reversed.png`, plus the directional scroll samples in the JSON. These are intermediate poses, not claimed face-on landings.
- Alternate reading and resilience: `no-js.png`, `reduced-motion.png`, `320-spacing-top.png`, `320-spacing-cash.png`, `320-spacing-paths.png`, `320-spacing-closing.png`, `agreement-320-spacing.png`, `resume-320-spacing.png`.
- Links/history: `shared-path.png`, `shared-window-read.png`, `notes-320-last-section.png`, `notes-back-functional.png`, `short-reading-tour-return.png`, `resume-320-top.png`; downloaded `handrail-proposal-notes.pdf` and `brent-showalter-handrail-resume.pdf`.

## Limits

This is desktop Chromium with viewport/device emulation. No physical phone, mobile browser chrome, native touch hardware, VoiceOver/NVDA, switch control, magnifier or forced-colors certification is claimed. The 320px reflow check is not a full browser zoom/input-device matrix. Touch was delivered through Chromium's native input protocol, not a physical finger. There was no separate long-duration stability or frame-performance assessment here.

Axe reported zero violations in 11 completed scans. Tour scans retained incomplete color-contrast and `aria-prohibited-attr` checks; a zero-violation count is not an all-rules pass. The standard reading and spacing scans had no incomplete checks. The complete accessibility tree is useful semantic evidence, not a substitute for manual assistive technology. PDF download identity, titles, page counts and tagged status were checked; PDF tag order and full visual/pagination quality were not reviewed by this specialty. The portfolio popup and external work-link destinations were not fully browser-tested.

Primary principles checked live: [WCAG text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), and [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). They inform the checks above; this report does not assert formal WCAG conformance.

**Final candidate confirmation:** all 28 assets still match candidate-v8; no application change occurred during this review. Within this specialty's observed scope, no defect requires remediation before the integration owner's release decision.
