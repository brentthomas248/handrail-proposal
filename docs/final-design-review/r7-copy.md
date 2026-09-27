# Round 7 independent review — Commercial copy and information grouping

Reviewer: fresh independent copy specialist (no earlier reports, scores, progress or remediation records read; IMPLEMENTATION.md not read).
Date: 27 September 2026.

## Candidate identity

Frozen candidate `http://127.0.0.1:4321/handrail-proposal/`, verified against `qa-artifacts/final-design/candidate-v7/identity.json` before and after review:

| Route / asset | SHA-256 | Matches identity.json |
| --- | --- | --- |
| `index.html` | `72caa74399d49b8af19e224bcb36ae1e27a731e058cdc74e055fa8e2abdea6a4` | yes (start and end of review) |
| `agreement/index.html` | `504dd71d98a188f4bf6ebde5bd10a7c79331eb6e5e7039b44183bbd0a53c0f98` | yes |
| `resume/index.html` | `dde002faf7212e0b054c370533db05dcee32f819d1714b35882a6953ac41d609` | yes |
| `handrail-proposed-agreement.pdf` | `0c81c8d3a68ada31b9af1fe6c733627169e9a6cc38c8e08160a36cc8f9e40f95` | yes |
| `brent-showalter-handrail-resume.pdf` | `dbf5cae25589697e1c9904e82ffa27aa384a9a98212a1a57272dcfca845ef501` | yes |
| `handrail-logo.png` | `1e024d51ef5f28a6bcedfa90ff58c5f0481a81db81cbcd5efede50594766bb3a` | yes |

The candidate was unchanged at the end of the review (main HTML re-hashed after all captures).

## Scope and evidence

Read in full: canonical `src/content/proposal.ts` and `src/content/resume.ts`, the served proposal HTML text, the web notes (`/agreement/`), the web resume (`/resume/`), and both PDFs via `pdftotext` and rendered page images (Poppler). Rendered evidence was captured by me with headed Chromium through `qa-artifacts/final-design/r7/copy/capture.mjs` (uses only the neutral `review-tools/browser.mjs` plumbing):

- Tour scenes at all five core viewports (1440×1000, 390×844, 320×740, 390×664, 768×1024): overview plus every chapter, with a per-scene measurement of each reading-group element's projected box against the measured header/control safe area and its rendered line height (`evidence/measurements.json`).
- A bounded native wheel sweep (four mid-frames plus settled frame) between the two rate scenes at phone and desktop, to see whether related copy stays grouped while the camera moves.
- Ordinary reading mode full page at all five viewports; notes and resume routes full page at desktop and phone.
- Both PDFs rendered to page images and text-extracted.
- No console or page errors in any session (`evidence/*/errors.json` all empty).

Evidence directory: `qa-artifacts/final-design/r7/copy/` (`evidence/<viewport>/*.png`, `evidence/measurements.json`, `pdf/*.txt`, `pdf/*.png`).

## Scores

| Criterion | Score | Reasons and deductions |
| --- | --- | --- |
| Immediate proposition | 19 | The folded packet's back cover already reads "New business. Room to grow. / No base salary. Commission follows collected revenue." Cover scene: eyebrow, "Let's grow Handrail.", the economic statement and "Begin with new business. Build the relationship from there." are in one group at every viewport. −1: link-preview metadata carries three wordings of the lead line that differ from the page (C7-01). |
| Compensation precision | 19 | Rates, bases ("of collected build fees", "of collected recurring fees"), scope ("all my future credited sales"; "the triggering client and all future credited sales"), timing ("Handrail receives the customer payment first"), benefits as a requested separate company cost, "Handrail keeps, before costs", and the "Illustration only; not Handrail pricing" qualifier are all present and unambiguous. Arithmetic verified: $120,000 ÷ 12 = $10,000; $1,500/$2,000; $8,500/$8,000; $500 per installment; $18,000/$24,000; $6,000; 5% × $2,000 = $100. Open items (qualifying-client criteria, recurring duration, deals in progress) are named rather than invented. −1: "That start earns 20% on this client…" compresses build and recurring into one figure (C7-02). |
| Concise persuasive language | 18 | "Commission follows collections." and "Collect first. Pay commission second." carry the argument; the client-first premium is explained as recognizing the business that enables the hire, without hype; "walk away without an obligation to hire" is candid. −1: notes §6 second paragraph is a three-list run-on (C7-03). −1: the "That start earns…" sentence is the one awkward line in the flyer (C7-02, shared cause). |
| Hierarchy and related-copy spacing | 19 | Every measured reading-group element sat inside the header/control safe area at all five viewports (0 of 130 measured boxes outside). Each phone rate scene carries its own muted "Two ways to begin" context line, path label, rate, recurring line, path description, scope/rationale and the shared "Both paths…" terms beneath a rule. The collections figure keeps assumption → collected amount → table → difference → rule → qualifier in one column at 320 px and 390×664. Window steps and the closing group each read as one idea; the follow-up note and notes link sit under a rule beneath the contribution copy. Mid-scroll frames between rate scenes never split a rate from its rationale. −1: desktop and tablet "The window" and "Grow together" scenes leave the group high on a long empty sheet, so the eye lands on empty paper below the colophon; this is composition rather than copy grouping and is not a defect for this category. |
| Proposal/resume/notes consistency | 19 | Served proposal text, notes page, PDF text and canonical source are identical for all seven sections, intro and endnote; rates, bases, 90-day rule and benefits language match across flyer, notes and PDF. Resume web and PDF text match; the 2025 B.S. and "Graduate coursework" wording match the content boundary; contribution areas are framed as proposals ("How I could contribute") and the resume closing mirrors the flyer's partnership line. −1: the 90-day idea is labelled three ways ("The window" chapter, "90 days to begin." sheet, "A 90-day opportunity" notes heading) and the link-preview wording drifts (C7-01, C7-04). |

**Total: 94 / 100.**

No P0–P2 defects were found in this specialty. Release is not blocked by copy or grouping.

## Findings

### C7-01 — P3 — Link-preview and metadata wording drifts from the page's lead line

- Impact: someone who receives the shared link sees "Commission paid from collected revenue" (og:image alt), "commissions paid from collected revenue" (meta description) or "Commissions follow collections." (social image) and then a page that says "Commission follows collected revenue." Same meaning, three phrasings; a first impression that does not repeat the page verbatim.
- Evidence: served `index.html` `<meta name="description">` and `og:image:alt`; `social.svg` text nodes; cover scene captures `evidence/*/scene-the-beginning.png`.
- Fix (bounded): set the default description and `og:image:alt` in `src/layouts/Page.astro` to reuse `flyerCopy.cover.statement`; regenerate `social.png`/`social.svg` with the same line when next touched.
- Recheck: grep the served HTML for the exact cover statement in both meta fields; social image text matches.

### C7-02 — P3 — "That start earns 20% on this client…" compresses the two rates

- Impact: the client-first rationale says "earns 20%" while the group above shows 20% build + 5% recurring; a fast reader can take 20% as the rate on everything from that client.
- Evidence: `evidence/phone/scene-client-first.png`, `evidence/desktop/scene-the-two-paths.png`, `evidence/small/scene-client-first.png`; source `flyerCopy.paths.clientReason`.
- Fix (bounded): "That start earns the 20% build rate on this client and all my future credited sales." (notes already state both rates correctly; no notes/PDF change needed).
- Recheck: rendered client-first scene at 390×844 and 320×740 still keeps the rationale inside the safe area with the shared-terms line beneath; `pnpm pdf:check` unaffected.

### C7-03 — P3 — Notes §6 second paragraph is a run-on list

- Impact: "We should confirm coverage where I live, the start date and my contribution, along with the tools and support I need and a practical policy for approved travel and selling expenses." stacks three lists in one sentence; the reader has to re-parse which items belong together.
- Evidence: `evidence/desktop/agreement-full.png`, `pdf/notes-2.png`, `pdf/agreement.txt` lines 51–53.
- Fix (bounded): split into two sentences, for example "My request includes a benefits package when I join. Before starting, we should confirm coverage where I live, the start date and my contribution. We should also agree the tools and support I need and a practical policy for approved travel and selling expenses." Keep the §7 checklist as is.
- Recheck: `pnpm pdf:check` passes with the new paragraph; PDF still fits two pages.

### C7-04 — P3 — Three labels for the 90-day idea

- Impact: the chapter control says "The window", the sheet says "90 days to begin.", the notes TOC and heading say "A 90-day opportunity". Each is clear alone; together they make the reader map one concept across three names when moving from tour to notes.
- Evidence: `evidence/desktop/scene-the-window.png`, `evidence/desktop/agreement-full.png` (TOC), `pdf/notes-2.png`.
- Fix (bounded): align the notes heading with the flyer's own vocabulary, for example "A 90-day window to begin" (keeps the chapter label and sheet unchanged, so no camera or test changes).
- Recheck: TOC, heading, PDF text and `pnpm pdf:check` agree.

## Observations that are not defects in this category

- Full-page reading-mode captures show the sticky header and the focused "Skip to content" link painted mid-page. That is a full-page screenshot protocol artifact of fixed elements, not a layout defect; the viewport captures show the header only at the top. Where focus lands after "Read normally" belongs to the interaction reviewer.
- Neighbouring panels show clipped peripheral copy in perspective (for example the rust collections column beside the two-paths scene). It is outside the active reading group and DESIGN.md permits it; it did not compete with the primary idea in any capture.
- Desktop/tablet "The window" and "Grow together" scenes sit high on a mostly empty sheet. Composition and whitespace are for the editorial and motion reviewers; the copy grouping itself is intact.
- "Bring me on before I land the qualifying client." reads as an imperative addressed to Handrail. It is concise and matches the notes' meaning; treating it as a defect would be preference.

## Untested limits

- No physical iPhone/Android device, no manual VoiceOver or other assistive-technology reading, no browser print dialog (only the generated PDFs were checked), no Safari/WebKit rendering.
- Forward/reverse motion was sampled only as a bounded four-frame native wheel sweep between the two rate scenes at phone and desktop; the whole journey's motion quality is the motion reviewer's scope.
- Reduced-motion and no-JavaScript reading paths were not rendered here; their content is the same semantic HTML by construction, but that is not rendered evidence from this review.
- Notes and resume routes were captured at desktop and phone only; the tour and reading mode covered all five core viewports.
- Chromium device emulation is not physical iPhone certification.

## Paths

- Report: `docs/final-design-review/r7-copy.md`
- Evidence: `qa-artifacts/final-design/r7/copy/` (`capture.mjs`, `evidence/{desktop,phone,small,short,tablet}/*.png`, `evidence/measurements.json`, `evidence/*/errors.json`, `pdf/agreement.txt`, `pdf/resume.txt`, `pdf/notes-*.png`, `pdf/resume-*.png`)

Own browser processes: all sessions launched by `capture.mjs` were closed by the script; the only Playwright Chromium still running at the end belonged to a concurrent editorial reviewer's own process, not this review.
