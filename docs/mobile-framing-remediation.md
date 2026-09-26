# Mobile contextual framing remediation

## Curated batch before implementation

MF-01: The user reports that the mobile tour zooms too closely to see all the text. They request wider camera framing, visible secondary neighboring copy, and stronger spacing. Independent adversarial review rejects the current 15-stop phone sequence: the tests frame child paragraphs while associated context is severed under chrome or at the sides. Baseline evidence is retained locally under qa-artifacts/mobile-context/baseline and qa-artifacts/wide-paper-final.

MF-02: A frozen initial mobile stage height can place content behind browser/interface chrome when the visible viewport shrinks. The prior height-change regression proves no jump but does not prove continued visibility.

Scope: mobile paper layout, semantic reading groups, camera fit and chrome-aware reframing. Preserve the wide 1200×1700 paper, brand, Z-fold motion, canonical business terms, PDF, reading/recovery paths and high-density rendering budget. No additional composited opacity or filter layers. The user-approved local workflow remains in force; credentialed semantic/cloud services remain omitted.

## Plan and acceptance

1. Independently inspect the baseline as a design critic; record specific failures rather than accepting previous test counts.
2. Consolidate toward 8–10 meaningful scenes including opening. Fit complete reading groups with visible negative space and secondary neighboring context. Add a consistent mobile optical zoom cap so a short sentence cannot become a giant isolated crop.
3. Reflow mobile paper typography and spacing rather than shrinking the existing layout until text is illegible. Measure actual header/control boundaries. Preserve native scroll and chapter identity while adapting the camera to a smaller visible viewport after input settles.
4. Add line-range visibility checks for complete reading groups, actual safe-area margins and all text nodes; include 320×740,390×844,430×932 and390×664 plus a live height change. Keep the existing 12px hard floor and seek 14px or better on narrow phone body copy. Preserve the 64 MiB/4096-device-pixel paper budget.
5. Independent adversarial critic inspects current screenshots and scroll transitions after implementation and may reject the candidate. Root addresses actionable findings before publication. Deterministic checks do not substitute for design review.
6. Run relevant type/unit/build, browser, supplementary WebKit and canonical-copy/PDF checks; publish under existing authorization; verify hosted behavior/assets and update the checkpoint.

Status: implemented and independently accepted after two candidate reviews and a heading correction. Final publication evidence is recorded in IMPLEMENTATION.md. Physical iPhone crash certification remains outside desktop emulation evidence.

## Adversarial review, candidate 1

Rejected. Complete-group framing was better, but neighboring cash headlines and rate columns competed at full ink strength. The small/short partnership scene also had an 11.83px eyebrow and a cramped body. The reviewer additionally caught a cover that appeared closer because typography enlarged during reflow despite the nominal camera reduction.

Revision: reduce the optical zoom cap, widen the partnership story to reduce line wrapping, and apply a restrained secondary ink color to nonactive mobile reading groups. This changes existing face paint rather than creating opacity/filter layers. Full original ink returns in the overview and between reading regions. The complete-group design stays intact.

## Final implementation and review

Eight complete reading scenes plus the opening view replace fifteen fragmented phone targets. Related headings, rate explanations, the complete window and the complete partnership story remain together. A mobile optical zoom cap and width/height fit reserve surrounding context; revised columns and spacing keep the primary copy readable. Inactive ink recedes during reading holds and returns during travel. Inactive groups are inert and hidden from the accessibility tree; the active group and ordinary reading expose their complete content.

The camera measures the actual fixed header and controls with a 24-pixel inset. On mobile height changes it refits after input settles, preserving the native scroll position, current chapter and navigation nodes. Updating the journey height while retaining its travel range keeps the final scene reachable after expansion.

The unchanged paper is 1200 × 1700 authored pixels, or 600 × 850 intrinsic pixels at high density. No additional composited opacity or filter layers were added. Canonical proposal copy and the PDF are unchanged.

The [independent adversarial review](mobile-context-adversarial-review.md) accepted the final composition after rejecting the first candidate. The final review covered every mobile scene at 320 × 740, 390 × 844 and 390 × 664, as well as forward/reverse transitions. It caught a joined-word heading that was corrected and added to the browser regression.

## Regression and evidence

Before implementation, the new framing checks failed against the prior release: the cover occupied 83.02% of phone width and the receipt lost about 106 pixels behind controls after a viewport-height reduction. Final coverage checks every text-node line, complete semantic groups, real control boundaries, a maximum 78% group width, primary text size, and viewport shrink/restore without losing the last chapter. Active/inactive accessibility semantics, keyboard restoration and the existing high-density rendering budgets are included.

Final capture contains 42 chapter images, 25 fold samples, 32 intermediate frames and five journey videos. Minimum captured primary text is 14.0374 pixels, with no browser errors, warnings or failed requests. Supplementary WebKit checks 37 reading positions at five sizes, with a 14.0792-pixel minimum and five font-preload warnings. Evidence remains local under `qa-artifacts/mobile-context/`; checked-in summaries and the current deployment receipt link the results to publication.

## Published checkpoint

Source `25e5680` is published as static `54cb926`; Pages run `36276285064` succeeded. All 32 hosted browser checks passed in 31.4 seconds. Eight public assets match the reviewed build byte-for-byte and the downloaded PDF passes complete canonical comparison. MF-01 and MF-02 are implemented and verified within the documented browser scope. User visual acceptance and the separate physical iPhone crash verification remain outside that closure.
