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

[Open the updated proposal](https://brentthomas248.github.io/handrail-proposal/?v=33f64ef). Source `33f64ef7e648ec740cf443120663faba0d39d218` is published as static `4b11b12fc0063155b8af87265f3065a15b91a1a6`. [Pages run 36325370312](https://github.com/brentthomas248/handrail-proposal/actions/runs/36325370312) succeeded.

All 68 hosted browser checks passed in 1.2 minutes, with no failures/skips/retries. All 28 hosted files match the reviewed build byte for byte, including both unchanged PDFs. The [deployment receipt](agentic-ui/deployment-verification.json) records the current release. The temporary publishing worktree was removed after confirming a clean tree, pushed commit and no active process. This closeout changes documentation only.

## Remaining limits

Physical iPhone stability, manual VoiceOver and field INP remain unverified. The approved [local workflow](docs/local-workflow.md) applies. Private business/resume evidence stays outside this repository. Full global certification is not claimed.
