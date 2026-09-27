# Final design review contract

## Product and boundaries

Review the live rendered Handrail proposal at `http://127.0.0.1:4321/handrail-proposal/`, plus ordinary reading, `/agreement/`, `/resume/`, both linked PDFs and the public portfolio entry when relevant to your specialty. Audience: Handrail leadership considering Brent Showalter's proposed working relationship and engineering capability. This is a negotiable proposal, not an agreed contract. Handrail prepares the final contract.

The intended sequence is compact folded packet → all three panels unfolding within the frame → cover reading → collections → two rate paths → 90-day start window → contribution growing with Handrail. Terms are 15% build/5% recurring if hired first; 20%/5% if bringing the qualifying client first, including that client and future credited sales. No base salary; benefits requested. Commission follows customer collections. Retained cash is before costs, not profit. Do not invent terms or claims. Keep the confirmed 2025 graduation year. No private company figures or client names.

Preserve Handrail's actual identity, warm cream/rust/ink, matte wide Z-fold, current semantic HTML, native scroll, responsive reading, no-JS and reduced motion. No paperclip, emojis, neon, particles, stock SaaS cards or gratuitous libraries. Reviewer findings may challenge implementation choices, but must respect these explicit product constraints. Appearance must earn attention through the printed object and camera choreography.

## Evidence and independence

Read AGENTS.md, PROJECT.md, DESIGN.md and docs/local-workflow.md. The approved local workflow uses independent agents and actual Playwright/browser evidence. Credentialed services remain omitted by prior user authorization. Do not ask for credentials, edit the app, rebuild shared dist, publish or create PRs. Only write your assigned report and ignored evidence directory.

Capture your own rendered evidence; do not substitute old screenshots or passing tests. Use headed Chromium for CSS3D visual acceptance because a known headless capture anomaly can omit paint. Inspect original captures; a contact sheet alone can hide defects. WebKit protocol backface screenshots also have a documented limitation. Review actual forward/reverse scrolling, not just chapter endpoints, when judging motion. Desktop 1440×1000, phone 390×844, small 320×740, short 390×664, and tablet 768×1024 are the core matrix. Pick coverage appropriate to your specialty and state omissions.

Reviewers must not read other reviewers' findings/scores before submitting their independent report. Fresh rounds must not read earlier reports, implementation commentary or earlier scores. Give a candid independent score; never adjust a score to achieve a requested outcome. Separate observable defects from aesthetic preference. Every deduction needs user impact, evidence, a bounded suggested correction and a recheck condition. No defect quotas; do not manufacture findings. Conversely, a successful test does not establish good typography or compelling motion.

For quantitative type checks, state CSS pixels separately from screenshot/device pixels. Measure composed scale at a face-on reading pose from transformed border-box dimensions versus untransformed layout dimensions (checking both axes), or from the full transform projection. A glyph Range height divided by CSS line-height is not camera scale: line-height includes authored leading. Use Range boxes for line visibility, not as a font-size substitute. Primary definitions: [MDN element rectangles](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) and [MDN line height](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-height). These measurement rules refine evidence accuracy without changing scoring criteria.

## Scoring

Score the assigned category out of 100 as five named subcriteria, each 0–20. Use this common anchor: 20 exemplary within the stated brief with no actionable defect; 19 polished with only negligible residual refinements; 18 good but a noticeable correctable weakness; 16–17 multiple weaknesses; 13–15 material problems; 0–12 serious failure. Record exact deductions. Do not average away a blocker. Any uncorrected critical or major defect makes release ineligible regardless of score. Unknown physical-device or assistive-tech coverage must remain an explicit limitation, not invented evidence. Scores are this panel's design assessment, not an industry certification or external award.

| Specialty | Five equally weighted subcriteria |
| --- | --- |
| Commercial copy and information grouping | immediate proposition; compensation precision; concise persuasive language; hierarchy and related-copy spacing; proposal/resume/notes consistency |
| Editorial typography and spacing | type hierarchy; line measure and rhythm; microspacing and wrapping; macro composition and whitespace; responsive/document consistency |
| Motion direction and spatial choreography | folded reveal; camera/crease continuity; pacing and reading transitions; reversibility and input response; expressive restraint and spatial coherence |
| Art direction and material quality | identity and distinction; paper/edge/crease realism; light and shadow coherence; composition and visual hierarchy; finish across viewport sizes |
| Inclusive interaction and responsive UX | navigation and affordance; keyboard/focus; responsive/reflow/spacing resilience; reduced-motion/no-JS reading; links/history/document usability |
| Rendering and animation engineering | actual frame delivery; bounded memory/layers; load stability; resize/background/reversal resilience; implementation simplicity and evidence completeness |

Report format: category, candidate identity, scope/viewports, five scored criteria with reasons, total, findings with IDs/severity/evidence/fix/recheck, explicit untested limits. Use P0 critical, P1 major, P2 material, P3 minor. All P0–P2 require correction or an evidence-backed disposition before release.

## Reference basis

Accepted visual references: Telescope, Igloo, Exat and Stripe Press; original Handrail careers, sample MOU and pricing documents. Exact reference links are in the repository's design/research documents. Follow their material, composition and purposeful-motion ideas without copying branded artwork. Handrail's own identity is binding.

Primary-source principles checked 27 September 2026:

- [USWDS typography](https://designsystem.digital.gov/components/typography/): readable effective size, appropriate measure, text grouping and deliberate whitespace. Guidelines inform judgment; they do not mandate one size for every stage of a cinematic object tour.
- [WCAG2.2 Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html): user spacing overrides must preserve content/function; the listed values are a resilience test, not required authored styling.
- [WCAG2.2 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), and [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) inform interaction tests.
- [web.dev animation performance](https://web.dev/articles/animations-guide): favor transform/opacity, inspect paint/frame behavior, avoid gratuitous layer promotion. Profiling is required before calling an effect cheap or smooth.
- [Apple motion guidance](https://developer.apple.com/design/human-interface-guidelines/motion): render this JS-backed primary source in a browser when relying on it. Prior research emphasizes purposeful, interruptible, gesture-consistent motion; do not invent additional rules from the web reader's empty JS shell.

## Review sequence and release gate

Run six independent specialists in two waves, curate findings, implement bounded fixes and verify them. Then assign six different agents a fresh rendered candidate and this neutral brief, without prior grades. Repeat corrections and fresh review where needed. The integration owner separately applies the release gate; reviewers must grade the evidence independently. Do not conceal a lower score, redefine criteria after grading or keep polling reviewers for a higher number. An inaccessible verification surface stays a stated limit.
