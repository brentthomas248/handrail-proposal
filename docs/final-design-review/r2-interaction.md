# Independent review: inclusive interaction and responsive UX

Reviewed 27 September 2026. **98/100. No P0–P2 defect found in the exercised scope; two P3 refinements remain.** This is an independent design assessment, not accessibility certification or physical-device acceptance.

## Candidate and independence

- Frozen candidate: `http://127.0.0.1:4321/handrail-proposal/`, identified by the supplied 27 September 10:07 candidate manifest at `qa-artifacts/final-design/candidate/identity.json`.
- Manifest root `index.html` SHA-256: `55aa2fb3216bcdb31ff22a501bf984b8dbe599699d7e1412204130efbaa16f33`.
- Both PDFs were downloaded by clicking their visible links. Their downloaded bytes independently match the manifest: proposal `f7877c9339e02c0ab48758a4b467381a1d7b304f830451b365b8a0b4c6d692ac`; resume `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.
- Read only the assigned neutral brief, AGENTS.md, PROJECT.md, DESIGN.md and local-workflow.md for project context. Did not consult prior reviews, scores, remediation records, progress records or implementation commentary. No application edits, build, commit or publication.
- Captured original screenshots in isolated **headed Chromium 153.0.8010.12** using the installed Playwright package. Original frames were opened and inspected individually. No previous review captures were used.
- Evidence directory: `qa-artifacts/final-design/r2/interaction/`. Numbers below refer to original files in that directory. Full-page images supplement viewport frames; sticky-header stitching in a full-page image is not treated as live overlap evidence.

## Scope

| Viewport | Exercised coverage |
| --- | --- |
| 1440×1000 | Opening, sequential Tab navigation, visible focus, skip link, complete ordinary reading text and next keyboard destination |
| 390×844 | All seven tour stops; normal reading; keyboard focus entering a paper link; wheel intent after stale link focus; notes/resume and Back; both PDF downloads; held-touch and cancellation; PageDown/PageUp; reduced-motion and no-JavaScript entry/end |
| 320×740 | Collections/window/closing scenes; ordinary reading; spacing override before startup; notes and resume spacing/reflow; supporting axe checks |
| 390×664 | Collections/window/closing; ordinary reading; height-only resize while on Client first |
| 768×1024 | Collections/window/closing; ordinary reading; phone-to-tablet breakpoint preservation; live reduced-motion switch on the paths section |

Inputs were actual browser clicks, Tab/Enter/End/PageDown/PageUp, wheel events, and Chromium touch input events. DOM measurements and accessibility scans were supporting evidence, not substitutes for looking at the page.

## Scores and exact deductions

| Criterion | Score | Evidence and reason |
| --- | ---: | --- |
| Navigation and affordance | **19/20** | Clear normal-reading escape, identifiable chapter buttons and progress, prominent notes/resume links. Phone chapter navigation automatically brings the selected control into the horizontal strip. **−1 for INT-R2-01:** the reduced-motion tour control is disabled without explaining the reason. |
| Keyboard/focus | **20/20** | Visible focus through header/chapter controls; ordinary Tab navigation does not force a mode change. Skip to content opens readable flow and the next Tab reaches the paper notes link. Tabbing from the last chapter to that paper link opens normal reading with an unobscured focus ring. No keyboard trap observed. `keyboard-desktop.json`, `02-tab-0.png`, `02-tab-4.png`, `03-skip-content.png`, `17-keyboard-paper-link.png`. No deduction. |
| Responsive/reflow/spacing resilience | **20/20** | Complete active reading groups remained usable in tested phone/short/tablet scenes. Ordinary reading has no horizontal document overflow at 320, 390 or 768 pixels. Spacing overrides before and after initialization safely choose document flow; the live override preserves Client first near the top instead of losing the reader. Height changes preserve the stop and width changes map to the corresponding desktop section. `05-mobile-*.png`, `09-*.png`, `responsive.json`, `spacing-overrides.json`, `resize-live-preference.json`. No deduction. |
| Reduced-motion/no-JS reading | **20/20** | Both deliver the complete semantic proposal in ordinary flow, including both rate explanations, common terms, full 90-day sequence and closing link. Live reduced-motion adoption retains the paths section in view. No-JS hides the unavailable mode action. The disabled-control explanation is already deducted under navigation. `alternative-reading.json`, `20-reduced-motion.png`, `20-no-javascript.png`, `21-no-javascript-end.png`, `24-live-reduced-motion.png`. No additional deduction. |
| Links/history/document usability | **19/20** | Notes and resume open correctly, notes contents links place their headings visibly, both PDF downloads succeed, Back restores the tour chapter, and further scrolling works. Document typography reflows with spacing at 320 pixels. `history.json`, `documents.json`, `11-notes-phone.png`, `13-resume-phone.png`, `14-notes-anchor.png`, `15-notes-spacing.png`, `16-resume-spacing.png`. **−1 for INT-R2-02:** the resume action container has an unsupported accessible label. |
| **Total** | **98/100** | **Two exact deductions of 1 point each.** No score adjustment for a desired outcome. |

## Findings

### INT-R2-01 — P3 minor: explain the unavailable tour under reduced motion

**Observed behavior:** With `prefers-reduced-motion: reduce` active at startup, the page correctly opens ordinary reading, but still presents the disabled label “Take the tour.” The live DOM is `<button … aria-pressed="true" disabled="" title="">Take the tour</button>`. Changing the preference while viewing the tour produces the same unexplained disabled action. The initial visual affordance resembles a temporarily unavailable feature.

**User impact:** A reader can consume the entire proposal, but cannot tell from the page why the offered action is unavailable or whether it is broken. This is a small explanation/affordance issue, not a failure to respect reduced motion and not content loss.

**Evidence:** `20-reduced-motion.png` (390×844), `24-live-reduced-motion.png` (768×1024), `alternative-reading.json` and `resize-live-preference.json`. Spacing overrides have a title explaining their fallback, documented separately in `spacing-overrides.json`; reduced motion has an empty title.

**Bounded correction:** Replace the unavailable action with a compact visible status such as “Reading mode · reduced motion,” or associate a visible explanation with it. Preserve the motion preference and complete reading path. A hover-only title would not explain the state to touch users.

**Recheck:** Load with reduced motion on and switch it on during a tour on both phone and desktop. Verify that the reason is visible and available in the accessible name/description, content and reading position remain intact, and no unexpected animation or new focus stop is introduced.

### INT-R2-02 — P3 minor: the resume action label is applied to a generic container

**Observed behavior:** The rendered resume contains `<div class="resume-tools" aria-label="Resume actions">` with no group or navigation role. A targeted repeat of axe's incomplete `aria-prohibited-attr` result identifies that exact node. [WAI-ARIA's generic-role definition](https://www.w3.org/TR/wai-aria-1.2/#generic) describes a nameless container and directs named descendant grouping to a semantic container such as `group`; its `aria-label` definition excludes generic elements.

**User impact:** The intended “Resume actions” grouping has no supported naming semantics. Inconsistent or absent announcement of that group is an inference from the markup and specification, not a claimed manual screen-reader observation. Both child links retain descriptive names and worked in this review, so this is a minor semantic refinement, not a blocked download or return path.

**Evidence:** `axe-incomplete-detail.json` contains the exact live element, selector and warning; `13-resume-phone.png` shows the two usable child actions. The supporting repeat used the same frozen resume route at 320×740 with reduced motion.

**Bounded correction:** Remove the unnecessary container label, or give the wrapper `role="group"` if the named group is intentional. Keep the existing link names and behavior.

**Recheck:** Confirm the wrapper no longer triggers the incomplete rule and inspect the accessibility tree for either ordinary named links without a phantom group, or a named `group` containing those links. Repeat keyboard activation and the PDF download. Manual assistive-technology coverage remains a separate limit.

## Behavior evidence

- **Reader intent beats stale link focus.** Tabbing to “Read the proposal notes” enters normal reading at `scrollY=2749.5`, focused link y=641.4–671.8. A deliberate −2000 wheel action moves to collections at `scrollY=749.5` while the old link remains focused. “Take the tour” returns to **Cash flow**, `scrollY=1980`, rather than pulling back to the closing. `reader-intent.json`, `17`–`19` viewport captures.
- **Held touch owns input.** A touch drag from y=610 to y=410 moves native scroll from 1980 to 2165 between Cash flow and Hire first. Holding contact for 1000ms leaves it at 2165. After `touchCancel`, settling reaches Hire first at 2860.5. PageDown and PageUp subsequently move forward and backward. `touch-and-keys.json`, `25-held-touch.png`, `26-touch-cancel-settle.png`.
- **Resize retains place.** Client first stays at native `scrollY=3540.5` when viewport height shrinks 844→664. Width change to 768 maps it to **The two paths** at 3539.5. Enabling reduced motion retains that section at y≈113.8 in normal flow. `resize-live-preference.json`, `22`–`24` captures.
- **Spacing is handled as a reading preference.** Applied line-height 1.5, letter-spacing .12em, word-spacing .16em and paragraph spacing 2em before startup at 320×740, and after startup on Client first at 390×844. Both exit/stay outside the camera; document width equals viewport width. Client first remains at y≈139.2 after the live change. Notes/resume also remain within 320 pixels after the same override. `spacing-overrides.json`, `06-spacing-after-start.png`, `07-spacing-before-start.png`, `27-spacing-before-start-verified.png`.
- **History remains functional.** Tour Client first at 3540.5 → notes → Back restores Client first at 3540.5. A subsequent +500 wheel action progresses to The window at 4220.5. Resume → Back then restores The window at 4220.5. `history.json`, `12-back-working-tour.png`.
- **Downloads are real files.** Visible controls produced `handrail-proposed-agreement.pdf` (235,108 bytes) and `brent-showalter-handrail-resume.pdf` (376,630 bytes), each without a download failure and with manifest-matching SHA-256. `documents.json`, `proposal-download.pdf`, `resume-download.pdf`.
- **Supporting scan:** axe WCAG2A/AA, WCAG2.1AA and WCAG2.2AA tags reported zero violations on the proposal, notes and resume at 320×740 with reduced motion. The resume retained one `aria-prohibited-attr` item; its exact node was investigated separately and is INT-R2-02. This scan result is not asserted as assistive-technology certification. `axe-supporting.json`, `axe-incomplete-detail.json`.

## Explicit limits

- No physical iPhone/iPad, iOS address-bar chrome or browser-process crash certification. Desktop Chromium mobile emulation and touch protocol input cannot establish these.
- No manual VoiceOver, NVDA, TalkBack, switch-control or speech-control session. No Braille or real magnifier test. Accessible DOM/axe evidence does not replace those checks.
- No PDF tagging/reading-order accessibility audit or print-layout acceptance; this review verifies the actual download path and file identity. Other specialties own document editing and deeper typography review.
- No external GitHub/Arms Inventory workflow audit. Their destinations were inspected from visible links; external site behavior was not graded.
- This is bounded interaction coverage, not exhaustive combinations of every font preference, zoom level, browser engine and device. Full page transitions and raster performance are outside the specialty's score; screenshots at shorter waits can include transition captions.
- The declared local workflow omits credentialed Stagehand/Browserbase services. No cloud service receipt, physical-device result or manual assistive-tech result is implied.

The exercised reading and interaction paths are suitable for release from this specialty's perspective. INT-R2-01 and INT-R2-02 are minor refinements; the integration owner retains the overall release decision and the explicit device/assistive-tech limits above.
