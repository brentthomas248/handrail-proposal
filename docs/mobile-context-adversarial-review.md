# Independent mobile design review

Date: September 26, 2026

Verdict: **Accepted for mobile framing and visual hierarchy** after two candidate reviews and the final heading correction. This is a design review of rendered pages, not a certification of physical iPhone stability.

## Review contract

The user reported that the mobile camera was too close to read all the text. The requested result was a wider view with complete ideas in focus, intentional spacing, and surrounding text visibly secondary. The approved wide Z-fold, Handrail branding, paper material, and scroll motion were to remain.

This reviewer did not implement the application changes. I inspected the prior release captures, independently rendered each candidate in isolated Playwright browser contexts, and challenged the composition rather than accepting passing target rectangles as sufficient evidence.

## Findings and dispositions

| Finding | Evidence | Disposition |
| --- | --- | --- |
| The old camera framed individual paragraphs while related headings and neighboring columns were cut off. | `qa-artifacts/wide-paper-final/mobile-06.png`, `mobile-08.png`, and `mobile-13.png` | Resolved. Rates now include the full card and its associated explanation; the 90-day window includes its title and all three steps; the partnership scene includes its heading and both contribution paragraphs. |
| Fifteen reading stops fragmented short sections and caused the mobile navigation dots to overflow. | Prior mobile sequence, especially stops 08–15 | Resolved. There are eight reading scenes plus the opening view. All nine navigation targets fit at 320 pixels wide. |
| The first candidate made the content complete but left neighboring copy at competing contrast. | `qa-artifacts/mobile-context/critic-candidate-1/390x844-7.png` and `390x664-3.png` | Resolved. During a reading scene, surrounding ink recedes while the active group retains normal contrast. The change uses ink color rather than blur or additional opacity surfaces. |
| The first candidate's partnership scene became too small in a short viewport. | `qa-artifacts/mobile-context/critic-candidate-1/390x664-7.png`; separate QA measured 11.826 pixels | Resolved by reflowing the printed layout. The final short viewport retains a complete, readable partnership group. |
| A hidden mobile line break joined two words in the rates heading. | `qa-artifacts/mobile-context/critic-candidate-2/390x844-moving-forward.png` | Resolved. The final rendered heading reads “The commitment sets the rate.” See `rates-heading-corrected.png` in the same directory. |

## Independent visual evidence

Candidate 2 captures are in `qa-artifacts/mobile-context/critic-candidate-2/`. I rendered all eight reading scenes at **390 × 844**, **320 × 740**, and **390 × 664** CSS pixels. I also inspected forward and reverse scroll frames and their settled states.

The primary content is complete and readable in the reviewed rate, window, partnership, receipt, cover, and proposal-status scenes. Active text is clear of the fixed header and controls. Neighboring paper and text remain visible but no longer compete with the main idea. The smaller scale and additional gaps give the composition room without returning to isolated paragraph close-ups.

The separate geometry evidence in `qa-artifacts/mobile-editorial/final-proof.json` reports a 14.099-pixel minimum for the 320-pixel window scene, 14.039 pixels for the short receipt scene, and 14.316 pixels for the short partnership scene. These are supporting measurements; the acceptance decision also relied on the actual rendered images. The same evidence records 600 × 850 intrinsic paper faces, preserving the wider brochure proportions.

The final heading correction was independently re-rendered from the local build completed at 17:21 on September 26. Both its text content and visible word spacing were checked.

## Coverage limits

These checks used desktop Chromium with mobile viewport and touch settings. They establish the reviewed composition and browser behavior in that environment. They do not reproduce a physical iPhone browser process, its memory limits, or every browser toolbar state. The user's earlier physical-device crash remains a separate device verification boundary.

No remaining mobile composition blocker was found in this review. Subsequent changes to scene grouping, camera fit, paper typography, or fixed controls require fresh rendered review at narrow and short viewport sizes.
