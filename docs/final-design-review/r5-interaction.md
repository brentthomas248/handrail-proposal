# R5 independent review — Inclusive interaction and responsive UX

Reviewer: fresh independent design specialist (inclusive interaction and responsive UX). No earlier reports, scores, remediation notes or IMPLEMENTATION.md were read. No target score was supplied.

## Candidate identity

- Reviewed at `http://127.0.0.1:4321/handrail-proposal/` on 27 September 2026.
- `index.html` SHA-256 `d6b4ceb93590828d53a4b5c757b0f54db73a9ed29338c0879f6654405c9726e5` verified at the start and again after the last browser session (unchanged).
- Also verified against `qa-artifacts/final-design/candidate-v5/identity.json`: `agreement/index.html`, `resume/index.html`, `handrail-proposed-agreement.pdf`, `brent-showalter-handrail-resume.pdf` and the tour module `_astro/index.astro_astro_type_script_index_0_lang.DVlipvW1.js` all matched.
- No app edits, rebuilds, commits or publication were made.

## Scope, tools and viewports

- Installed `@playwright/test` 1.63.0, isolated **headed** Chromium contexts (mobile emulation with touch for widths under 760 px). Scripts: `qa-artifacts/final-design/r5/interaction/probe-{lib,desktop,mobile,followup,documents}.mjs`. Structured results: `evidence/{desktop,mobile,followup,documents}-results.json`. 101 original PNG captures in `qa-artifacts/final-design/r5/interaction/evidence/`; the captures cited below were inspected as images, not only as DOM metrics.
- Core matrix: 1440×1000, 390×844, 320×740, 390×664, 768×1024, plus 720×500 as a 200 % zoom stand-in for desktop. Coverage was bounded: every chapter landing at every size, keyboard traversal at desktop and phone, native wheel/keyboard/touch-gesture scrolling forward and reverse, mode toggle, history, reduced motion, no JavaScript, blocked module, WCAG text-spacing overrides, phone height change, notes/resume/PDF/external links, axe-core scans and accessibility-tree snapshots.
- Native VoiceOver/TalkBack, physical iPhone and real browser-zoom (as opposed to viewport emulation) were **not** tested and are not claimed.

## Scores (each 0–20)

| # | Criterion | Score | Basis |
| --- | --- | --- | --- |
| 1 | Navigation and affordance | 18 | Visible chapter buttons with `aria-current`, live caption and counter, mode control visible in both modes, loading escape link. Deductions: I-02 (chapter indicator ahead of the pose at the opened-spread rest), I-05 (fragment links ignored in tour), I-06 (phone chapter strip overflow only signalled by cut labels). |
| 2 | Keyboard and focus | 16 | Logical tab order, 3 px ink focus ring inside every control, nothing obscured, Enter/Space activate chapters, Arrow/Page/Space/Home/End drive the scene, Tab into a paper link restores reading with the link centred and focused. Deductions: I-01 (assistive-technology tree exposes only the facing panel during the tour; no H1 at the landing state), I-03 ("Explore the source" not reachable by keyboard). |
| 3 | Responsive, reflow and spacing resilience | 19 | No horizontal overflow at any size in either mode or on notes/resume; all landing text lines inside the header/control band at 1440, 768, 390, 320 and 390×664; height change kept the chapter and the final scene stayed reachable; WCAG text-spacing overrides reflow cleanly and the guard hands off to reading with an explanation. Deduction: I-07 (12–13 CSS px qualifier text in the 320 px tour landings). |
| 4 | Reduced-motion, no-JavaScript and ordinary reading | 19 | Reduced motion yields the full document with a labelled, described, aria-disabled control and recovers the tour when the preference is lifted; no-JS page is complete with controls hidden; a blocked module shows a status and a reachable escape link and falls back at about 4 s. Deduction: I-04 (the escape link silently persists the reading preference). |
| 5 | Links, history and document usability | 18 | Back restores the exact chapter and read position after the header link and after the paper link; scene fully functional after returning; TOC anchors land with headings visible under a non-sticking header; sticky TOC; PDFs serve as `application/pdf`; external links announce "Opens in a new tab"; `aria-current="page"`. Deductions: I-03 (source link only reachable by mouse in some poses), I-08 (footer/duplicate links 12–13 px tall on phones). |
| | **Total** | **90 / 100** | |

Release note: I-01 is P2 and needs a correction or an evidence-backed disposition before release. No P0/P1 defects were found.

## Findings

### I-01 — Tour exposes only the camera-facing panel to assistive technology (P2)

- **Impact.** A screen-reader user who lands on the default tour hears the sr-only guidance sentence, the chapter buttons, and then an article that starts at "Commission follows collections." The cover H1 "Let's grow Handrail.", "Two ways to begin", "90 days to begin." and "New business. Room to grow." are absent until the camera faces them. The reading order and completeness of the proposal therefore depend on a visual camera state. The guidance sentence is the only mitigation.
- **Evidence.** Aria snapshot at the overview (`documents-results.json` → `ariaTree.tourMain`) lists one heading; the same snapshot in reading mode lists all seven. axe-core at the tour overview reports `page-has-heading-one` (moderate); reading, notes and resume pages report zero violations. Reading order in `desktop-00-overview.png` vs `desktop-read-fullpage.png`.
- **Fix (bounded).** Keep every content section in the accessibility tree throughout the tour (avoid `visibility:hidden` on away-facing content faces; if occlusion needs hiding, use `inert`/`aria-hidden` only on the decorative backs), or move the guidance into a live region and make the H1 always exposed.
- **Recheck.** Aria snapshot of `main` at the overview lists the H1 and all section headings in document order; axe `page-has-heading-one` passes at the tour overview.

### I-02 — Chapter indicator runs ahead of the scene at the opened-spread rest (P3)

- **Impact.** After a wheel pause in the opening (scroll 805–900 px at 1440×1000), the scene rests on the deliberately established full spread while the chapter strip highlights "The beginning", the counter reads 01/05 and the caption reads "Unfolding the proposal". Two indicators disagree, and the "current" chapter is not the pose on screen.
- **Evidence.** `followup-results.json` → `settle-positions` (targets 300/600 settle to 805, 900 stays at 900, all with chapter "The beginning" and caption "Unfolding the proposal"); `desktop-settle-900.png`, `desktop-wheel-settled.png`.
- **Fix.** Report "Overview" (or no current step) until the cover reading pose is reached, or label the rest as its own step.
- **Recheck.** At the opened-spread rest, `aria-current` and the caption agree.

### I-03 — "Explore the source" is not reachable by keyboard and only sometimes by mouse (P3)

- **Impact.** The right panel's colophon link exists only in tour mode. Tabbing past the chapter buttons jumps to "Read the proposal notes", which switches to reading mode where the panel chrome is not rendered, so the link is skipped. At "The two paths" its box sits below the viewport (y ≈ 1273 at 1440×1000), so it is not clickable there either. Equivalent GitHub links exist in the header and resume, so the loss is a secondary path, not content.
- **Evidence.** `followup-results.json` → `paper-links-keyboard` (`sourceLink.visible=false`, `clickable.inViewport=false`); `desktop-tab-from-two-paths.png`; link inventory in `documents-results.json`.
- **Fix.** Either drop the link from the panel chrome (it is duplicated on the resume) or make it part of the reading document as well.
- **Recheck.** Every visible tour link is reachable by Tab, or the link is removed.

### I-04 — "Read without animation" escape silently persists the reading preference (P3)

- **Impact.** The loading-state escape navigates to `?view=read`, which stores the reading preference. A reader who used it once during a slow load gets the reading view on every later visit until they find "Take the tour". The toggle is visible, so recovery is discoverable.
- **Evidence.** `desktop-results.json` → `blocked-module.escaped.url`; `mode-toggle.afterReload` shows the stored preference surviving reload.
- **Fix.** Treat the escape as a one-visit override (e.g. do not write storage on `?view=read`, or expire it).
- **Recheck.** After using the escape and reloading without the query string, the default tour returns.

### I-05 — Fragment links to proposal sections are ignored in tour mode (P3)

- **Impact.** `…/handrail-proposal/#window` opens at the folded overview with the window section not shown. No in-app link uses such a fragment (inventory verified), so this affects only hand-shared URLs.
- **Evidence.** `followup-results.json` → `hash-deep-links` (`#window` → overview; `?view=read#window` → section visible under the header).
- **Fix.** Map a known section hash to its chapter stop when the tour mounts.
- **Recheck.** `#window` lands on "The window" in tour mode and on the section in reading mode.

### I-06 — Phone chapter strip overflow has no affordance beyond cut labels (P3)

- **Impact.** At 390 and 320 px the strip is 598 px wide inside 354/296 px with the scrollbar hidden; only a clipped label ("Clie…", "The windo…") suggests more chapters. Auto-centring the current chapter does keep the active button visible, and every button is 44 px tall. On one Tab step the newly focused "Client first" button was still partly outside the strip (100 ms after focus; the strip scrolls smoothly, so this may be timing).
- **Evidence.** `mobile-results.json` → `phone-chapters.layout.navOverflows`, `phone-keyboard-and-read.steps`; `phone-tab-chapter-overview.png`, `phone-03-hire-first.png`.
- **Fix.** Add an edge fade or keep the current button centred on focus as well as on scene change.
- **Recheck.** A focused chapter button is fully inside the strip immediately after Tab; overflow is visually signalled.

### I-07 — Small qualifier text in 320 px tour landings (P3)

- **Impact.** The cash-flow qualifier lines render at about 12.6 CSS px and the 90-day steps at about 12.3 CSS px at 320×740 (14.7–15.3 px at 390 px). Legible in the capture, but at the low end for the terms that qualify the numbers. Reading mode and notes use 13 px minimum body on the same viewport.
- **Evidence.** `mobile-results.json` → `small-chapters.landings[2,5].text.minFontPx`; `small-02-cash-flow.png`, `small-05-the-window.png`.
- **Fix.** Raise the 320 px camera reading radius for those two groups slightly, or the qualifier size.
- **Recheck.** Minimum rendered size in the 320 px landings ≥ 13 px.

### I-08 — Footer and secondary header links are 12–13 px tall on phones (P3)

- **Impact.** Footer "Proposal notes"/"My GitHub" (13 px) and the document pages' "The proposal" header link (12–13 px) are small touch targets. All have equivalent controls elsewhere on the page and are spaced apart, which satisfies the WCAG 2.5.8 equivalent/spacing exceptions, so this is a comfort issue, not a conformance failure.
- **Evidence.** `documents-results.json` → `documents-phone/small.smallTargets`; `followup-results.json` → `phone-skip-and-targets.targets`; `agreement-phone-top.png`.
- **Fix.** Give those links `min-height: 24px` padding.
- **Recheck.** No interactive target under 24 px tall on phones.

## What passed (evidence)

- **Chapter navigation.** All chapters at all five sizes landed with `aria-current`, caption and counter agreeing and every text line of the target group inside the header/control band (`*-chapters` in `desktop-results.json` / `mobile-results.json`; `desktop-03-the-two-paths.png`, `phone-03-hire-first.png`, `short-02-cash-flow.png`, `tablet-03-the-two-paths.png`).
- **Keyboard.** Desktop tab order: skip link → identity → notes → mode → resume → GitHub → six chapter buttons → browser UI; no step left the tour. Focus ring 3 px ink, `outline-offset -4px` inside chapter buttons (`desktop-tab-chapter-overview.png`, `desktop-kb-chapter-focus.png`). Enter and Space activate chapters. ArrowDown/PageDown/Space/End/Home move the scene; End reaches "Grow together", Home returns to the overview. Tab from the last chapter button lands on "Read the proposal notes", the page switches to reading and the link is centred and focused (`desktop-tab-paper-link-1.png`); "Take the tour" then returns to the same chapter.
- **Mode toggle.** Read normally from "The two paths" lands the section just under the header; Take the tour returns to the identical scroll position and chapter; the preference survives reload in both directions (`desktop-read-from-chapter3.png`, `desktop-tour-restored-from-read.png`).
- **History.** Header link → notes → Back restored tour chapter 4 at the same scroll; reading position restored likewise; paper link → notes → Back restored "Grow together", then wheel reversal and chapter navigation worked normally (`desktop-history-back-tour.png`, `desktop-after-back-nav-cash.png`).
- **Reduced motion.** Full document, control reads "Reduced motion", `aria-disabled="true"`, `aria-describedby` explanation "Normal reading respects your reduced-motion preference.", focus ring visible; lifting the preference at runtime restored the tour at "The beginning" (`desktop-reduced-motion.png`, `phone-reduced-motion.png`).
- **No JavaScript.** Reading document with all five sections, mode button and tour controls hidden, skip link works, no overflow (`desktop-nojs-fullpage.png`, `phone-nojs-fullpage.png`).
- **Blocked module.** "Opening the proposal" status and "Read without animation" link visible and reached after six Tabs; the sheet and controls stay hidden meanwhile; automatic fallback to reading at about 4 s (`desktop-blocked-module-during.png`, `desktop-blocked-module-after-fallback.png`).
- **Text spacing.** Injecting the WCAG 1.4.12 overrides at 1440 and 320 px flips to reading, control reads "Reading view" with the explanation, no clipped elements and no horizontal overflow; header stays two rows at 320 px (`desktop-text-spacing-reload-header.png`, `small-read-text-spacing-cash.png`, `small-read-text-spacing-header.png`).
- **Touch and height change.** Synthesised touch gestures traversed the whole phone journey forward and back with monotonic captions; shrinking 390×844 → 390×664 at "Client first" kept the chapter and scroll, growing back kept it, and the final chapter and End position stayed reachable (`phone-height-shrunk-chapter4.png`, `phone-height-regrown-final.png`).
- **Documents.** Notes: seven TOC anchors land with the H2 visible at y≈31 (header is absolute, not fixed), TOC is sticky, heading outline H1→H2 in order, Download proposal and resume PDFs return HTTP 200 `application/pdf`. Resume: coherent H1/H2/H3 outline, all external links `target=_blank rel=noreferrer` with "Opens in a new tab." description. axe-core: 0 violations on reading, notes and resume pages (`notes-desktop-top.png`, `resume-desktop-fullpage.png`).
- **200 % zoom stand-in (720×500).** Six-stop mobile layout, cash-flow group fully inside the band, reading mode reflows (`desktop-zoom200-cash.png`).

## Protocol artifacts (not product defects)

- Playwright refuses `click()` on the mode control when it carries `aria-disabled="true"`; two scenarios timed out for that reason and were rerun with a forced click. The button remains focusable and ignores activation as designed.
- The phone height-change probe measured `#window` while the chapter was "Client first"; its clipped-line list is the neighbouring section, not a defect. The chapter and final-scene results stand.
- `#paths` without `?view=read` opened in reading mode only because the earlier `?view=read` navigation in the same context had stored the preference.
- One `net::ERR_FAILED` console error is the intentionally aborted module in the blocked-module scenario.

## Untested limits

- No native screen reader (VoiceOver/TalkBack), switch access or voice control was run; accessibility-tree snapshots and axe-core are proxies only.
- No physical iPhone/Android device; mobile evidence is Chromium emulation (touch gestures via CDP). WebKit was not exercised.
- Browser-level zoom was approximated by viewport size; real 200/400 % zoom and Windows High Contrast were not tested.
- Colour contrast in the tour was left "incomplete" by axe because of transformed 3D surfaces; contrast was not independently measured.
