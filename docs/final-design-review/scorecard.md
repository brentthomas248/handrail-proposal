# Final design review scorecard

Status: candidate-v8 passes all six independent categories: copy 98, editorial 99, art 98, motion 100, interaction 100 and rendering 99. No unresolved P0–P2 finding remains. Published from source `5b06411` and static `3921256`. All 28 hosted files and both downloaded PDFs match; all 185 hosted checks pass.

Six independent specialties use five equally weighted criteria against the [neutral brief](brief.md). Copy/grouping and editorial typography/spacing are separate assignments. Each round uses fresh contexts without prior reports, scores or the requested target. The release owner separately applies at least 95/100 in every category, with no unresolved P0–P2 finding. These are internal specialist assessments of observed evidence, not external design certification.

| Category | Round 1 | Round 2 | Round 3 | Round 4 | Round 5 | Round 6 | Round 7 | Round 8 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Commercial copy and grouping | [94](r1-copy.md) | [98](r2-copy.md) | [100](r3-copy.md) | [100](r4-copy.md) | [91](r5-copy.md) | [93](r6-copy.md) | [94](r7-copy.md) | [98](r8-copy.md) |
| Editorial typography and spacing | [91](r1-editorial.md) | [89](r2-editorial.md) | [96](r3-editorial.md) | [99](r4-editorial.md) | [85](r5-editorial.md) | [87](r6-editorial.md) | [87](r7-editorial.md) | [99](r8-editorial.md) |
| Art direction and materials | [94](r1-art.md) | [96](r2-art.md) | [99](r3-art.md) | [89](r4-art.md) | [87](r5-art.md) | Not run | [97](r7-art.md) | [98](r8-art.md) |
| Motion and spatial choreography | [98](r1-motion.md) | [98](r2-motion.md) | [100](r3-motion.md) | [87](r4-motion.md) | [89](r5-motion.md) | Not run | [99](r7-motion.md) | [100](r8-motion.md) |
| Inclusive interaction and responsive UX | [90](r1-interaction.md) | [98](r2-interaction.md) | [97](r3-interaction.md) | [94](r4-interaction.md) | [90](r5-interaction.md) | Not run | [97](r7-interaction.md) | [100](r8-interaction.md) |
| Rendering and animation engineering | [99](r1-rendering.md) | [97](r2-rendering.md) | [98](r3-rendering.md) | Not run | Not run | Not run | Not run | [99](r8-rendering.md) |

“Not run” means earlier specialties had already rejected that candidate; it is not a passing assessment. The final release panel includes all six specialties.

## Current candidate and evidence

Candidate-v8 main HTML SHA-256: `4cfd4b0411d2abdf97221e88a912cef897f3c0cddba54ac7f9bd5f24813ddfe1`. The complete 28-file manifest is in `agentic-ui/local-verification.json`. Independent reviews verify the same bytes before and after inspection. Six different agents cover the current panel; rendering profiling runs after other browser workloads close.

The full Chromium suite passes 185/185 without retries. All 29 unit checks and three Storybook checks pass; typecheck covers 45 files with zero issues. Canonical Markdown and both two-page PDFs pass complete content checks. WebKit passes 29 reading positions. Its new wheel-driven tests required explicit native-input completion; original failures, investigations and scoped rechecks remain in the evidence directory. Current receipts are in `agentic-ui/local-verification.json`.

The two copy/spacing reviewers independently found the same P3 PDF continuation issue. Art identified minor low-density ink softness. Their reports retain the exact observations, deductions and limits. Rendering records a P3 evidence gap for true hidden-tab lifecycle, with no confirmed product defect. These minor findings and deductions are retained; no earlier assessment substitutes for current acceptance.

## Review history and corrections

Round 3 met the numeric threshold, but a material closing-type finding still prevented release. Subsequent layout changes were reviewed again and rejected when they introduced new readability or pacing weaknesses. [Remediation](remediation.md) preserves corrections and original outcomes.

Round 4 used two fresh Codex reviewers and three separate fresh Claude Companion sessions after the task-wide agent-session limit. Round 5 used five fresh Claude sessions; the interaction session continued after its wrapper's 30-minute limit, retaining the same independent review. No experienced reviewer was relabeled as fresh. Round 6 was rejected after its two copy/spacing assessments.

Round 7's editorial score was originally [84](r7-editorial-original.md). Its same reviewer corrected a glyph-height measurement error, a mixed CSS/device-pixel logo comparison and an unsupported PDF-viewer deduction after receiving specific contrary evidence. The [corrected 87](r7-editorial.md) still rejected that candidate. The original report is preserved; no target score was supplied.

Historical manifests and command receipts remain locally under ignored `qa-artifacts/final-design/`; public reports identify candidate hashes, reproducible scope and limitations. These local evidence paths are not hosted screenshots.

## Limits

Physical iPhone stability, genuine hidden-tab recovery, manual VoiceOver, actual GPU memory and field INP remain unverified. Full global lifecycle certification is not claimed. Emulation, laboratory timings and subjective scores do not establish those results. User aesthetic acceptance remains separate from the review panel. Full global/cloud lifecycle certification is not claimed under the approved local workflow.
