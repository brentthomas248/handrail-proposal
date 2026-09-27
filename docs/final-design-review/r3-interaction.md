# Round 3 — Inclusive interaction and responsive UX

**Independent assessment: 97/100.** No P0, P1 or P2 defect observed in this review. Two P3 refinements remain. This is a local design assessment, not accessibility certification or physical-device acceptance.

## Candidate and independence

- Reviewed 27 September 2026 at `http://127.0.0.1:4321/handrail-proposal/`.
- Served main HTML SHA-256 independently verified as `944085d2bef0a4371beb0c148896c4490117223109c2e70ba6ca16eda6749786`, matching `qa-artifacts/final-design/candidate-v3/identity.json`.
- Read AGENTS.md, PROJECT.md, DESIGN.md, docs/local-workflow.md, the neutral review brief, and relevant current source. Did not read earlier reviews, scores, implementation commentary, remediation records or peer findings.
- Used isolated headed Chromium with actual keyboard events, Playwright touchscreen taps, native browser wheel input, and trusted CDP touch gestures. All screenshots were captured independently. No app edit, build, commit or publication was performed.
- Used the Agentic UI lifecycle/QA route with the project's authorized local-service omissions. Browser work paused while the rendering reviewer collected isolated timings; no rendering results were shared.

## Scores

| Criterion | Score | Reason and exact deduction |
| --- | ---: | --- |
| Navigation and affordance | 20/20 | The persistent reading control, explicit chapter names, current chapter indication, notes and resume links provide clear routes through the content. The phone chapter strip scrolls to expose later chapters; every chapter was reachable by touch. No deduction. |
| Keyboard/focus | 19/20 | Natural Tab order preserves tour mode through the header and chapter controls. Enter activates a chapter, visible focus remains legible, and reaching the paper notes link restores ordinary reading with the link focused. **−1: I3-02**, the desktop skip-link landing obscures the introductory line. |
| Responsive/reflow/spacing resilience | 18/20 | Complete reading groups remain available across all five core viewports, with no page-wide horizontal overflow observed. Mobile height and mobile-to-tablet changes preserve the reading idea. Spacing changes correctly select ordinary reading. **−2: I3-01**, the expanded-spacing currency comparison loses its intended separation at 320 px. |
| Reduced-motion/no-JS reading | 20/20 | Both independently load complete semantic reading content. The five-section rendered text matches ordinary reading exactly at 320 px. A failed enhancement module exposes the immediate reading escape and then automatically restores the complete document. No deduction. |
| Links/history/document usability | 20/20 | Proposal notes and resume routes, notes section anchors, actual PDF downloads, and the GitHub entry work. Browser Back restores the Client first tour location and subsequent scrolling works; deliberate reading movement supersedes a stale focused paper link when returning to the tour. No deduction. |
| **Total** | **97/100** | **Three points deducted for the two findings below.** |

## Findings

### I3-01 — P3 minor: expanded spacing crowds the narrow comparison values

**Impact.** A reader using increased text spacing at 320 px sees `$1,500$2,000` and `$8,500$8,000` with almost no gap. The column headings still establish the comparison, and no digit is lost, but scanning the two alternatives becomes needlessly difficult. This is a visible resilience weakness, not a claim that the document is unavailable.

**Evidence.** Apply `line-height: 1.5`, `letter-spacing: .12em`, `word-spacing: .16em`, and `p { margin-bottom: 2em }` to the 320×740 proposal. The app correctly switches to Reading view. In [the original measurement capture](../../qa-artifacts/final-design/r3/interaction/spacing-number-measurement.png), the first value's text range ends at x=167.24 and the second begins at x=169: only 1.76 px separates their ranges. The second value ends at x=304.24 although the intended table content ends at x=288. `$10,000` extends to x=311.65 beyond that content boundary. `documentElement.scrollWidth` remains 320, so a horizontal-overflow-only check misses the crowded internal layout. See `spacing-number-measurement` in [evidence.json](../../qa-artifacts/final-design/r3/interaction/evidence.json). The [notes comparison at the same settings](../../qa-artifacts/final-design/r3/interaction/notes-spacing-320-comparison.png) retains visibly better separation.

**Bounded correction.** Give the ordinary-reading currency comparison an intrinsic-width-safe narrow layout under expanded text metrics: preserve a real gutter between the two numeric values and keep the large collected amount inside the content area. A smaller authored currency size at the narrow breakpoint, or a comparison layout that stacks labeled values when they no longer fit, can achieve this without overriding the reader's spacing preferences.

**Recheck.** Repeat the exact override at 320×740 and 390×664; inspect actual text ranges and original captures. Both values must remain visually distinct, the amount must fit its content area, and headings/qualifications must remain available. Retain ordinary-reading fallback and verify the unmodified comparison is unchanged in meaning.

### I3-02 — P3 minor: desktop skip-link landing hides the introductory line

**Impact.** A keyboard reader who activates Skip to content reaches the proposal in ordinary reading mode, but its opening line, “A proposal for working together,” is almost entirely behind the fixed header. The main headline and economic proposition remain readable; scrolling upward recovers the line. The skip action does successfully bypass the header in the subsequent tab order.

**Evidence.** At 1440×1000 on a fresh tour load, press Tab then Enter. [The verified landing capture](../../qa-artifacts/final-design/r3/interaction/skip-landing-verified.png) shows the crop. `skip-landing-verification` in [evidence.json](../../qa-artifacts/final-design/r3/interaction/evidence.json) records the intro at y=60–91.20 and the header at y=0–90. The subsequent Tab reaches the paper's “Read the proposal notes” link, so this is a landing offset issue rather than a keyboard trap.

**Bounded correction.** Offset the skip-link destination for the fixed header, or explicitly land the first reading section below the header after changing modes. Keep the current bypass behavior and mode transition.

**Recheck.** Repeat Tab → Enter from fresh tour and ordinary-reading loads at desktop and phone widths. The first introductory line and headline should start below the header, and the next Tab should still skip the header controls.

## Coverage and evidence

The primary receipt is [evidence.json](../../qa-artifacts/final-design/r3/interaction/evidence.json), containing 40 independent checkpoints, extracted rendered content, states, touch-event evidence, target sizes and download hashes. Original PNGs, scripts and downloaded files live only in the ignored [interaction evidence directory](../../qa-artifacts/final-design/r3/interaction/).

| Viewport | Independently exercised |
| --- | --- |
| 1440×1000 | Opening; natural keyboard traversal; Enter on chapter control; skip link; paper-link focus and reading restoration; selected reading captures. |
| 390×844 | Every tour chapter by touch; every ordinary-reading section; persisted reading mode on reload; notes/resume navigation; notes anchor; history restoration; stale-focus reading intent; trusted native touch forward/reverse, hold/release and cancel; module-load failure; PDF actions. |
| 320×740 | Every tour chapter by touch; every ordinary-reading section; notes/resume navigation and captures; complete reduced-motion, no-JS and spacing-override proposal reading; notes/resume spacing samples. |
| 390×664 | Every tour chapter and ordinary-reading section; notes/resume routes; short-screen framing; transition from 844 px height while retaining Client first. |
| 768×1024 | Every tour chapter and ordinary-reading section; notes/resume routes and section anchor; mobile-to-tablet continuation maps Client first to The two paths. |

Notable positive evidence:

- [Desktop focus](../../qa-artifacts/final-design/r3/interaction/desktop-chapter-focus.png) is visible without changing modes; [paper-link focus](../../qa-artifacts/final-design/r3/interaction/desktop-paper-link-focus.png) is restored in document flow.
- [Phone cash flow](../../qa-artifacts/final-design/r3/interaction/390x844-tour-cash-flow.png), [small-phone client path](../../qa-artifacts/final-design/r3/interaction/320x740-tour-client-first.png), [short-phone closing](../../qa-artifacts/final-design/r3/interaction/390x664-tour-grow-together.png), and [tablet rate comparison](../../qa-artifacts/final-design/r3/interaction/768x1024-tour-the-two-paths.png) preserve their associated explanations. Every chapter was captured, not only these examples.
- Normal, reduced-motion, no-JS and spacing-override proposal text are identical at 320 px, including both rates, recurring fees, benefits request, 90-day conditions, growing contribution and the final-contract qualification. Section and full-page captures are retained for the fallback modes.
- Mobile chapter controls measure 44 px high; notes/resume/GitHub header links measure 24 px high and remain separately operable in the narrow matrix.
- `mobile-notes-history-restoration` records the tour returning to Client first at scrollY=3540.5, followed by successful movement and settling at The window. `reading-intent-over-stale-link-focus` returns to Cash flow after reading upward despite the notes link retaining focus.
- Trusted touch events move native scroll from 0 to 445 during a held upward gesture; release allows settling, and a reverse gesture followed by touchcancel returns to Overview. These are browser-emulated touch events, not a physical-device claim.
- [The failed-load state](../../qa-artifacts/final-design/r3/interaction/load-failed-early.png) offers “Read without animation”; the four-second fallback restores all reading sections after JavaScript module requests are aborted.
- Both actual download actions produced bytes matching candidate identity: proposal PDF `d9759900f5a67816fe24a4bea3a7118d8700630755befd04ce0e9726bf23c363`; resume PDF `c832d6895f0e51c19c52a042a8c202661ae2b8b9d5d0181e0ed771490fe4b649`.
- The public portfolio link opens `https://github.com/brentthomas248` with the expected profile title. [Original capture](../../qa-artifacts/final-design/r3/interaction/public-portfolio.png).

The independent matrix script completed with exit 0. The behavior script recorded its interaction and PDF checks before its final portfolio action encountered an ambiguous reviewer locator; the locator was corrected, and the isolated postcheck completed with exit 0 and verified the actual public link. This was a review-harness failure, not an application failure. No application page errors were recorded in the matrix's monitored contexts. Root functional tests were not substituted for these exercises.

## Explicit limits

- Chromium desktop and emulated touch only. No physical iPhone, mobile Safari crash/stability claim, native iOS browser-chrome test, WebKit acceptance, Firefox coverage or manual VoiceOver session.
- No screen-reader certification, PDF tagging/assistive-reading audit, forced-colors audit, actual browser-zoom matrix or field input-latency measurement. Semantic text and keyboard behavior are useful evidence but do not replace those checks.
- Reduced motion, no-JS and complete spacing-override reading were independently exercised at the narrowest core width; they were not exhaustively repeated at every desktop and tablet size. Notes/resume spacing checks sampled the primary header/content and comparison surfaces, not every paragraph at every viewport.
- Touch gestures exercised trusted forward/reverse scrolling and cancellation in the opening segment; the complete journey was separately traversed by touch chapter controls. This report does not grade continuous cinematic motion or frame delivery.
- Existing independent document content/PDF consistency tests and broader rendering tests remain the integration owner's responsibility. No Stagehand, Browserbase, cloud lifecycle, release or deployment certification is claimed.
