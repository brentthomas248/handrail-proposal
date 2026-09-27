# Implementation checkpoint — complete round-two revision

## What changed

All actionable findings from the [round-two review](docs/review-round-2.md) are implemented. The full proposal now uses stable printed ink, complete phone rate groups, local hinge travel, a composed 90-day scene and one closing with contribution, growth, discussion status and notes action. The broken highlight is replaced by clear rate-heading ownership. Both commission paths receive equal visual weight and shared terms.

The elementary diagram is replaced by one accessible comparison: each illustrated $10,000 customer installment produces $1,500 commission/$8,500 remaining at 15%, or $2,000/$8,000 at 20%. The $500 difference is per collected installment. Cash remaining is before delivery, benefits and other costs. The notes, generated Markdown and PDF use the same typed values; rates, future-sales scope, no base salary, requested benefits and the proposed 90-day window remain consistent.

Native keyboard navigation no longer forces an unwanted mode change. Idle settling cannot undo deliberate scroll direction. Reading mode follows the same narrative order as the tour, keeps the mode control visible and returns to the idea selected by the last reading gesture or paper-link focus. Held touch, stale focus and fractional section boundaries have explicit regressions. See [implementation and rejected-candidate evidence](docs/round-2-implementation.md).

## Verified candidate

- 55 Chromium browser checks passed in 56.2 seconds, with zero skips, failures or retries. Six partial forward/reverse tests measured 0px of movement against the user's direction after release.
- 26 typechecked files, zero issues; 21 unit tests and 3 component checks passed. Component axe reported zero violations or browser errors.
- Canonical Markdown, build, full PDF text and formatting checks passed. Both PDF pages were rasterized and visually inspected.
- WebKit: 29 reading positions across five sizes passed, minimum primary text 12.158px; no errors or failed requests. Known protocol/backface screenshot limits remain documented.
- Estimated paper surfaces peak at 59.26MiB with a 2877-device-pixel maximum edge, below the unchanged 64MiB/4096px limits. These are compositor estimates, not physical GPU measurements.
- Lighthouse page-load lab: 99 mobile/100 desktop performance, zero TBT/CLS; other categories 100. Not field performance or real-device scroll evidence.
- Independent [design/commercial](docs/round-2-candidate-design-review.md) and [interaction](docs/round-2-candidate-interaction-review.md) reviews accepted the complete bounded revision after rejected candidates and fresh rendered checks. The desktop source action is intentionally retained; redundant phone colophons are removed.

## Publication

The [updated public proposal](https://brentthomas248.github.io/handrail-proposal/?v=d3363fd) is published from source `d3363fd5e5e82cdd91890c72ce686db5034b3866` as static `18f262af8bdb212828749af080ea7844500ffabe`. [Pages run 36293281659](https://github.com/brentthomas248/handrail-proposal/actions/runs/36293281659) succeeded. All 55 hosted browser checks passed in 60.4 seconds, with zero failures, skips or retries. All 26 hosted files match the reviewed build byte for byte, including the PDF; the downloaded PDF passes the complete canonical check.

[Ordinary reading](https://brentthomas248.github.io/handrail-proposal/?view=read&v=d3363fd) remains available. Application publication and hosted verification are complete. This documentation checkpoint reconciles [local evidence](agentic-ui/local-verification.json) and the [deployment receipt](agentic-ui/deployment-verification.json); it changes no application code or deployed assets.

## Remaining limits

Physical iPhone stability, manual VoiceOver, field INP and an unbriefed business-reader comprehension exercise remain unverified. The [approved local workflow](docs/local-workflow.md) applies; credentialed services remain omitted and full global certification is not claimed. Raw QA captures stay ignored. Private business material remains outside the public repository. GitHub profile and pins remain unchanged.
