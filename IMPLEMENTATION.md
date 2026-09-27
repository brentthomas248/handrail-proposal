# Final proposal design pass

## Current state

The user approved the design except for choppiness in the first opening. A bounded [opening refinement](docs/opening-smoothness-remediation.md) replaces independently fitted zoom beats with one continuous pullback. Four new cold-opening regressions failed against the published version; all eight opening/panel-framing checks now pass. Typecheck, all 29 unit tests and formatting pass. All 36 targeted Chromium and eight WebKit opening checks pass. Cold profiling and the independent rendered review across five viewports pass within their documented scope. Publication is next. The release below remains the currently published revision until the follow-up receipt is completed.

## Previous published design pass

Candidate-v8 passed all six fresh independent categories: copy 98, editorial 99, art 98, motion 100, interaction 100 and rendering 99. No unresolved P0–P2 finding remains. Main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`. The historical 28-file manifest remains in the release receipt at that commit. That revision was published. All 28 hosted files match the reviewed candidate; downloaded PDFs pass complete content checks. All 185 hosted browser checks pass without retries.

Six independent specialties cover commercial copy/grouping, editorial typography/spacing, art/material, motion, inclusive interaction and rendering engineering. Two scrutinize copy and spacing independently. Fresh reviewers receive the [neutral brief](docs/final-design-review/brief.md), original references and unchanged rendered app without prior grades or a requested target. All grades and failures remain in [the scorecard](docs/final-design-review/scorecard.md). The release owner separately applies the user's 95/100-per-category gate; no unresolved material defect is allowed regardless of score.

## Changes

The complete three-panel unfold, matte Z-fold material and camera orbits remain. This pass refines crease pacing, reversible input, mobile and tablet framing, supporting type, comparison hierarchy, whitespace and stable front ink. Camera fitting includes text-line overhang while preserving the paper-surface budget.

Desktop and tablet window steps now use aligned label/explanation rows. The quieter cover wordmark, clearer collection rule and consistent metadata support the printed hierarchy. The notes have stronger section headings, a restrained web reading measure and a verified two-page PDF. Commercial wording preserves both commission rates on the qualifying client and future credited sales, requested benefits, a 90-day window and room for the partnership to grow. Handrail prepares the final contract.

Complete semantic reading is independent of hidden paper faces. Keyboard navigation, section URLs, text-spacing recovery, a one-visit reading escape, loading fallback and prominent resume/GitHub links remain available. Returning from the bottom of normal reading now restores the closing chapter; the accessible window heading includes its number. A canceled mobile chapter shortcut restores the current chapter in the strip without overriding horizontal navigation or keyboard focus.

## Verification and release

- All 38 affected Chromium checks pass, including new tests that failed against the previous candidate.
- Typecheck covers 45 files with zero issues; all 29 unit checks and three Storybook checks pass. Component checks found no axe violations or browser errors.
- Canonical Markdown and both complete PDFs pass. The notes PDF is checked to remain two pages and both pages have been visually inspected after the print changes.
- All 185 full Chromium checks pass. WebKit passes 29 reading positions and 113 supplementary cases across the initial run and four corrected input-actuation rechecks. Original failures are retained; application bytes did not change. All six fresh reviews are complete. Isolated renderer profiling and Lighthouse passed within their documented scope; performance scores are 99 mobile and 100 desktop.
- A scan of 105 changed public files found no private company figures, private client identifiers, credential material or local machine paths. Public portfolio destinations and attributed contributions were verified during this task.

Source commit: `5b06411fb1788190088ce98a9f684da1029ce0f3`. Rebuilding that commit reproduced all 28 reviewed files byte for byte. Static commit: `3921256a56bf205f42f5cc32e2effec75d326e55`. [Pages deployment](https://github.com/brentthomas248/handrail-proposal/actions/runs/36349637874) succeeded; all 28 assets and both downloaded PDFs match, and all 185 hosted checks pass. Physical iPhone stability, genuine hidden-tab recovery, manual VoiceOver, actual GPU memory and field INP remain unverified. The [approved local workflow](docs/local-workflow.md) applies; full global lifecycle certification is not claimed.
