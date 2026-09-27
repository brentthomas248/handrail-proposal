# Research basis for the third adversarial review

Reviewed 27 September 2026. This is targeted primary-source research for the accepted Handrail direction, not a trend-driven reskin or a claim of standards conformance.

## Four independent specialties

**Spatial motion and material.** [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) supports purposeful, gesture-consistent, interruptible motion with an optional alternative. The reviewer inspected the live rendered guidance and tested three connected panels, changing perspective at real hinges, forward/reverse input, pause/cancellation and material coherence. Intermediate frames and headed captures were required; endpoints alone were insufficient.

**Editorial typography and document design.** [USWDS typography](https://designsystem.digital.gov/components/typography/) provides readable line-measure and context-sensitive line-height guidance. [NN/g visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) explains how scale, contrast and grouping direct attention. The reviewer measured actual line lengths, reviewed associated headings/body, compared small/short phones and desktop, and rendered every PDF page for pagination and watermark restraint. Guidance informs judgment; a CSS ch value alone is not proof.

**Interaction and inclusive design.** [WCAG 2.2 Focus Not Obscured AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), [Target Size Minimum AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [Reflow AA](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) inform focus, controls and the 320 CSS-pixel reading alternative. The reviewer used real Tab/Shift+Tab, actual links, browser Back, native scroll, reduced motion and no JavaScript. The AA target minimum is 24px subject to exceptions; the project preserves 44px chapter buttons. [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) is AAA, not an invented AA requirement. Ordinary reading and the 3D presentation are assessed distinctly.

**Narrative, hiring credibility and portfolio.** A [Harvard resume-guide search excerpt](https://cdn-careerservices.fas.harvard.edu/wp-content/uploads/sites/161/2024/10/2024-HES_resume-and-letter.pdf) recommends fact-based evidence; the full document returned HTTP 429, so no additional rules are attributed to it. [GitHub profile README guidance](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) and [pinning guidance](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/pinning-items-to-your-profile) establish actual profile surfaces. The reviewer inspected public first impressions, evidence hierarchy and exact contribution authorship, checked resume claims against private evidence, and distinguished demonstrated work from proposed Handrail responsibilities.

## Review and correction protocol

Each specialist received this basis and approved Telescope, Igloo, Exat, Stripe Press and Handrail references. They captured their own candidate evidence and separated measurable failures from aesthetic preference. Reports include severity, reproduction, user impact, bounded correction and recheck conditions. Root implemented actionable findings and returned the candidate for focused independent review. The spatial reviewer subsequently implemented a small shadow refinement; root separately inspected matched before/after images before retaining it.

Existing commercial terms, the wide Z-fold, phone resource limits and native reading access remained constraints. No new rendering library was needed. Material3's motion page returned a JavaScript shell; no uninspected spring or motion-token claim was used.

The history-return correction uses the documented [History scrollRestoration behavior](https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration) and [navigation-entry type](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming/type). Its browser regression failed before correction, then exact position restoration passed on the rendered candidate.

Physical iPhone stability, manual VoiceOver and field performance cannot be inferred from emulation, automated accessibility scans or Lighthouse. See the four review reports and [implementation record](portfolio-resume-motion-implementation.md) for evidence and remaining limits.
