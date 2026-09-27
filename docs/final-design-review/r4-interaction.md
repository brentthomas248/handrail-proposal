# Round 4 review: inclusive interaction and responsive UX

Independent specialist review, 27 September 2026. Written without reading earlier reports, scores, progress or remediation records, peer findings or IMPLEMENTATION.md.

## Candidate identity

- App: `http://127.0.0.1:4321/handrail-proposal/` (preview server, PID 75903).
- Served `index.html` SHA-256 `e320b978140a26f76376c7728ee4fb98a55e40cc9fba4d4c534f5091edb6bb82`, identical to `dist/index.html` and to `qa-artifacts/final-design/candidate-v4/identity.json` before the review and again after the last browser closed.
- `resume/index.html`, `agreement/index.html`, both PDFs also matched `identity.json` (`473347d2…`, `83bb9c66…`, `d9759900…`, `c832d689…`).
- Source HEAD `a499369`. No app files were edited, no rebuild, no commit, no publication.

## Scope and method

Headed Chromium (Playwright 1.63, `@playwright/test`) with isolated contexts, one browser per probe group, all closed at the end. Scripts and evidence are in `qa-artifacts/final-design/r4/interaction/` (`probe.mjs`, `probe-followup.mjs`, `probe-layout-diff.mjs`, `probe-toc-style.mjs`, `evidence/results-*.json`, originals as PNG, aria snapshots as text). Originals were inspected directly, not via contact sheets.

Viewports: 1440×1000, 390×844 (iPhone 14 emulation, DPR 3, touch), 320×740, 390×664, 768×1024. Documents at 390 and 320. Exercised: Tab order and focus visibility, skip link, chapter buttons by keyboard and tap, native wheel/keyboard/touch scrolling with reversal, idle settle and its cancellation, synthetic touch hold and `touchcancel` release, viewport height cycle, mode toggle and its persistence, `?view=read`, browser Back from notes and resume in both modes, reduced motion, JavaScript disabled, WCAG 1.4.12 text-spacing override in reading mode, tour mode, notes and resume, failed-module escape, responsive chrome/target sizes/overflow, notes/resume/PDF links, accessibility tree per chapter.

Not covered: physical iPhone, Safari/WebKit, Firefox, screen readers (VoiceOver/NVDA), real touch hardware, field performance. Touch scrolling used CDP synthesized gestures and the `touchcancel` case used synthetic window events, so held-finger ownership and momentum are inferred from behaviour, not measured on a device.

## Scores

| Criterion | Score | Reason |
| --- | --- | --- |
| Navigation and affordance | 19 | Chapter nav, caption, counter, mode toggle, loading escape and skip link all work and are discoverable. Phone chapter strip only hints at further chapters by clipping labels (INT-R4-04). |
| Keyboard and focus | 18 | Tab order is logical, outlines are strong and inside chapter controls, chapter Enter lands exactly, paper-link focus restores reading and the toggle returns to the same chapter. At the Overview pose the default tour exposes only the centre panel to assistive technology (INT-R4-01). |
| Responsive, reflow and spacing resilience | 20 | No horizontal overflow, internal clipping, text overlap or ink spill at any core viewport in either mode, or on notes/resume, with or without the WCAG spacing override. Tour hands off to reading view under spacing and re-enables the tour when spacing is removed. Height cycle preserves chapter. |
| Reduced motion and no-JavaScript reading | 19 | Both paths deliver the complete five-section document, hide tour chrome and keep notes/resume/GitHub links. Reduced-motion state is communicated through a disabled button whose explanation cannot be reached by keyboard (INT-R4-02). |
| Links, history and document usability | 18 | Back restores the exact tour pose or reading scroll; PDFs serve as `application/pdf` with valid headers; anchors resolve; heading order is sound. Notes contents links have no at-rest link affordance (INT-R4-03) and external links open new tabs silently (INT-R4-05). |
| **Total** | **94** | |

No P0 or P1 found. One P2 requires correction or an evidence-backed disposition before release.

## Findings

### INT-R4-01 · P2 · Default tour exposes a partial document to assistive technology at Overview

- Impact: on first load in the default tour, the accessibility tree of `main` contains the caption, the six chapter buttons and only the centre panel (Collections). No level-1 heading, no cover, no rates, no 90-day window, no closing and no proposal-notes link are present until the reader moves past Overview. A screen-reader user who explores `main` before activating anything meets an incomplete proposal.
- Evidence: `evidence/aria-main-tour-1440-overview.txt` and `aria-main-tour-390-overview.txt` (partial tree); `evidence/aria-main-tour-1440-paths.txt` (complete tree after moving to a chapter); `results-followup.json` → `a11y.1440` / `a11y.390`: `idea`, `paths`, `window`, `together` are `display:none on DIV.panel-face` at Overview and `exposed` at every later chapter and mid-transition. Cause: folded wing faces are removed with `display: none` at the packet pose.
- Mitigations already present: the skip link switches to reading mode, "Read normally" is in the header, any chapter button restores the full tree. This keeps it below P1.
- Bounded correction (either): keep folded wing faces in the tree at Overview by hiding them with `visibility`/`backface-visibility` handled inside the renderer's existing face logic rather than `display: none`, or add a visually hidden sentence at the top of the article in tour mode ("The tour shows one panel at a time. Choose Read normally for the complete proposal.") and keep the current rendering budget.
- Recheck: aria snapshot of `main` at Overview on 1440 and 390 contains the level-1 heading and both rates, or the guidance text; Tab order, skip link and paper-link restoration unchanged; renderer budgets unchanged.

### INT-R4-02 · P3 · Reduced-motion status is a disabled control with unreachable explanation

- Impact: with `prefers-reduced-motion: reduce` the header button reads "Reduced motion", is `disabled`, and its explanation ("Normal reading respects your reduced-motion preference.") lives in a `title`. Keyboard users skip it entirely (`reducedMotion.tabOrder` in `results-followup.json`: not in the Tab sequence), so the explanation is never reachable without a pointer.
- Evidence: `evidence/rm-1440-top.png`, `rm-390-top.png`, `results-…json` → `reducedMotion.*.toggleAttempt`.
- Bounded correction: render the state as static text (or `aria-disabled` with the explanation as visible or `aria-describedby` text) instead of a native disabled button.
- Recheck: reduced-motion Tab order reaches or announces the explanation; no motion is offered.

### INT-R4-03 · P3 · Notes contents links lack an at-rest link affordance

- Impact: on `/agreement/` the "In this proposal" list renders as muted grey text (`#6b6258`, no underline, 14px); the underline and ink colour appear only on hover/focus. Readers may not realise the list jumps to sections.
- Evidence: `evidence/fu-06-agreement-toc-390.png`, `fu-08-agreement-toc-focus-390.png`/`-1440.png`, `probe-toc-style.mjs` output (rest: `deco: none`, hover/focus: underline + ink).
- Bounded correction: a resting underline in the rust rule colour or ink text for the contents list.
- Recheck: computed `text-decoration-line` on contents links is not `none` at rest; contrast unchanged.

### INT-R4-04 · P3 · Phone chapter strip has no scroll affordance beyond clipped labels

- Impact: at 320–390 wide the chapter nav is a horizontal scroller (`overflow-x: auto`, no scrollbar, no snap, no fade). Three of seven buttons start off-screen. The only hint is a clipped label ("Clien"). Behaviour is otherwise correct: the active chapter scrolls into view after flicks and taps, and buttons are 44px tall.
- Evidence: `evidence/touch-01-phone-overview.png`, `resp-320x740-tour-overview.png`, `fu-07-phone-strip-after-flick.png`, `results-followup.json` → `touchCancelAndStrip.strip`.
- Bounded correction: an edge fade mask or trailing padding on the strip so the continuation is intentional.
- Recheck: strip still auto-scrolls the active chapter into view; no reduction of the 44px targets; no page overflow.

### INT-R4-05 · P3 · External links open a new tab without warning

- Impact: GitHub, Arms Inventory and source links use `target="_blank"` with no visible or screen-reader text about the new window (WCAG advisory G201).
- Evidence: `results-…json` → `documents.*.info.externalNoNewTabWarning`.
- Bounded correction: visually hidden "(opens in a new tab)" text, or drop `target="_blank"`.
- Recheck: accessible name of each external link includes the new-tab note.

## Verified behaviour (no deduction)

- Tab order at 1440: skip link → identity → Proposal notes → Read normally → resume → GitHub → six chapter buttons; focus never leaves the tour on its own; outlines are 3px ink, chapter outlines inset (`kb-01…kb-03`, `results-batch1.json`).
- Enter on a chapter button lands exactly on that chapter with focus retained; Tab then moves to the next chapter (`kb.enterOnChapter`, `kb.tabAfterChapter`).
- PageDown/End/Home drive the tour natively; End reaches Grow together, Home returns to the folded overview (`kb.nativeKeys`).
- Skip link switches to reading mode, sets `#main`, places the main content directly under the fixed header (`kb-06`).
- From Grow together, Tab reaches "Read the proposal notes", which restores reading mode with the link visible and focused; Enter on "Take the tour" returns to Grow together (`fu-01`, `fu-02`, `paperLinkFocus`).
- Mode toggle: Cash flow ↔ reading aligns the same section under the header and returns to the same scroll; preference persists across reload; `?view=read` forces reading; reading at the window section returns to The window in the tour (`mode-01…04`).
- Browser Back from notes and from resume restores the exact tour pose (`hist-01`) and, in reading mode, the exact scroll (`hist-02`, the difference in section offset is the document-end clamp, not a layout change: `results-layout-diff.json`). The tour still responds to wheel after returning.
- Wheel: 1:1 native travel, immediate reversal, settle begins after roughly 600ms idle, an opposite wheel during settle cancels it and the next settle follows the new direction (`scroll-desktop-samples.json`).
- Touch (CDP gesture): swipes move the scene, reverse works, settle to the nearest stop in the last direction; synthetic held touch suppresses settle and defers the refit; `touchcancel` releases both (`touch.phone`, `touchCancelAndStrip`).
- Height cycle 844→744→844 keeps Grow together (`touch-06`).
- Reduced motion and no-JS: complete document, no tour chrome, no overflow (`rm-*`, `nojs-*`).
- Failed module: loading status plus a keyboard-reachable "Read without animation" link at 0.7s; automatic fallback to reading at about 4.0s with all five sections; tour controls and mode button stay hidden (`modfail-*`).
- WCAG text spacing: no clipping, overlap or spill in reading mode at 1440/390/320, on notes or resume; tour hands off to "Reading view" and re-enables "Take the tour" once spacing is removed (`spacing-*`, `fu-04-*`). The large rate numerals gain tall gaps under the override; content and function are preserved, so no deduction.
- Targets: header/chapter/footer controls ≥ 24px or spaced beyond the 24px exception; notes contents links sit on a 29px pitch (`tocPitch`).
- Documents: both PDFs 200/`application/pdf`/`%PDF`; resume PDF has `download`; anchors resolve; `aria-current="page"` set; skip link first in Tab order; no overflow at 320.
- Decorative back faces are `aria-hidden` and absent from the tree at every pose (`ariaHas.backText: false`).

## Evidence index

`qa-artifacts/final-design/r4/interaction/evidence/`: `results-batch1.json`, `results-scrollDesktop-…-documents.json`, `results-followup.json`, `results-layout-diff.json`, `scroll-desktop-samples.json`, `aria-main-tour-*.txt`, `batch2.log`, and the PNG originals named above (kb-, mode-, hist-, scroll-, touch-, rm-, nojs-, spacing-, modfail-, resp-, doc-, fu-, layoutdiff-).

## Closeout

Candidate identity unchanged after the review. All review browsers closed; no Playwright Chromium processes from this session remain. Physical-device, assistive-technology and field-performance coverage remain explicit limits.
