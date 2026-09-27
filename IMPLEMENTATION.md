# Visible fold-out opening

## Changed

The proposal begins as a folded packet. Both wings unfold through a whole-object camera sequence, keeping all three panels within the frame. Only after the spread opens does the camera approach the first reading composition. Both hinges open 108degrees before that approach. Later crease orbits, proposal terms, materials, resume and GitHub links remain unchanged.

See the [remediation record](docs/fold-opening-remediation.md) and [independent headed review](docs/fold-opening-independent-review.md). The [prior portfolio/resume checkpoint](docs/portfolio-resume-motion-implementation.md) retains the earlier feature and publication evidence.

## Verified locally

- Type check, 27 unit checks, production build and formatting passed.
- All 68 Chromium browser checks passed in 1.2 minutes with no failures/skips/retries. The new regression fails against the previous published opener and passes at four desktop/phone sizes.
- The focused run recorded 1,074 continuous forward/reverse frames with no clipped panel. Complete reading-group and 64MiB/4096px renderer-budget checks still pass.
- Independent headed review accepted the unfold, whole-spread framing, cover approach and reversal at 1440×1000, 390×844, 320×740 and 390×664. Root also inspected original desktop/phone frames.
- Supplementary WebKit verified 29 reading positions across five sizes; no browser errors or failed requests. Known font-preload warnings and protocol screenshot limitations remain documented.

## Publication

Local candidate accepted; publication and hosted verification are the next checkpoint. The currently published prior source is `dc99b79` as static `40c72dd`. The [deployment receipt](agentic-ui/deployment-verification.json) still records that prior release until hosted verification completes.

## Remaining limits

Physical iPhone stability, manual VoiceOver and field INP remain unverified. The approved [local workflow](docs/local-workflow.md) applies. Private business/resume evidence stays outside this repository. Full global certification is not claimed.
