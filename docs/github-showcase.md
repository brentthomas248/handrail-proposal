# GitHub showcase handoff

Updated September 26, 2026. The [public source repository](https://github.com/brentthomas248/handrail-proposal) and [existing public URL](https://brentthomas248.github.io/handrail-proposal/) are available. The user rejected the first published edition and approved a redesigned camera journey across the actual proposal flyer. **The redesign is published and passed 19 hosted browser tests.** Profile README and pin changes remain unapplied.

The repository README documents the current working architecture and commands, with publication status explicitly separated. The public-profile observations below are the original September 26 audit snapshot, not a new profile audit. HTTP availability is separate from browser QA.

## Original public-profile audit snapshot

| Surface                                                                            | Verified observation                                                                                                                                                     | Implication                                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| [Profile](https://github.com/brentthomas248)                                       | Display name Brent Showalter; bio describes AI-native software engineering, Python/FastAPI and deterministic evaluation. Twelve public repositories, nine of them forks. | Lead with a few inspectable examples rather than repository count.                                               |
| Profile repository                                                                 | `brentthomas248/brentthomas248` returned HTTP 404 through authenticated GitHub API.                                                                                      | The profile README draft is a new artifact, not an update to an existing README.                                 |
| [Proposal repository](https://github.com/brentthomas248/handrail-proposal)         | The first edition was published after explicit user authorization. Its replacement uses an actual HTML flyer camera and revised business-proposal framing.               | Wait for redesign publication and fresh hosted verification before presenting the replacement as live.           |
| [DFB Brand Studio](https://github.com/brentthomas248/dfb-brand)                    | Owned public repository; README describes interactive color and typography exploration. The [live page](https://brentthomas248.github.io/dfb-brand/) returned HTTP 200.  | Strong visual example to place directly below the new proposal. HTTP availability does not establish browser QA. |
| [Demand forecasting](https://github.com/brentthomas248/shotgun-demand-forecasting) | Owned public repository with author attribution, source directories, reproducible setup and evaluation limitations.                                                      | Demonstrates analytical depth; retain its academic context. Do not claim production deployment.                  |
| [BOXMEOUT-STELLA #44](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44)         | Authored by `brentthomas248`, merged July 16, 2026. Files and description cover property tests, CI and accounting corrections.                                           | Credit the precise contribution; do not present the complete platform as an independently authored product.      |
| [Open-Stellar #430](https://github.com/Bitcoindefi/Open-Stellar/pull/430)          | Authored by `brentthomas248`, merged July 16, 2026. Files cover Playwright scenarios, CI and sidebar accessibility attributes.                                           | A concrete example of verification work. Link the contribution directly from the profile.                        |

Pins at that audit, verified through GitHub GraphQL: demand forecasting, `GruftNet/BOXMEOUT-STELLA`, then `Bitcoindefi/Open-Stellar`.

## Profile README

[github-profile-draft.md](github-profile-draft.md) is the proposed README body. It contains only currently inspectable public examples and accurate contribution attribution. It deliberately has no speculative proposal link or performance claim.

After the redesign is published and verified, a separately authorized profile update could use this first selected-work entry:

> **Handrail proposal** — A scroll-driven camera journey across a readable HTML flyer. Explore the cash-flow proposal, switch to ordinary reading or download matching proposal notes. The source includes the GSAP camera, canonical content, accessibility paths and browser tests. [View proposal](https://brentthomas248.github.io/handrail-proposal/) · [Source](https://github.com/brentthomas248/handrail-proposal)

Only retain capabilities in that paragraph that actually ship and pass verification. Use a single optimized screenshot linked to the live proposal above the selected-work list; provide descriptive alt text. Do not add status badges, visitor counters, skill-logo grids, animated typing banners or unsupported impact metrics.

## Proposed pin order

1. `brentthomas248/handrail-proposal` — the published interactive proposal and source.
2. `brentthomas248/dfb-brand` — immediate visual proof from an existing project.
3. `brentthomas248/shotgun-demand-forecasting` — analytical engineering and documented evaluation.
4. `GruftNet/BOXMEOUT-STELLA` — keep the existing team-project pin; scope authorship in the README.
5. `Bitcoindefi/Open-Stellar` — keep the existing team-project pin; link the merged testing contribution.

Leave the sixth pin empty until another project offers equally clear evidence. The `dance-floor-bros-preview` repository currently adds less context than the brand studio, so it should not displace these examples without stronger documentation.

## Proposal repository presentation

Suggested repository description: **A scroll-driven camera journey through a Handrail business proposal, with readable HTML, accessible controls and matching PDF notes.**

The repository README documents the actual HTML flyer, GSAP camera, two compensation paths, local commands and verified deployment. Its opening screenshot shows the current branded flyer and was rendered and reviewed before inclusion.

Handrail branding uses the official PNG wordmark, warm paper/rust palette and locally served Inter and Playfair Display. No Three.js, React Three Fiber or Lenis remains. Do not link directly to ignored `qa-artifacts/` or `test-results/` paths. Review the current source and regenerated PDF for private information before publishing.

The existing GitHub Pages route is `/handrail-proposal/`, matching `astro.config.mjs`. Pages serves the root of the gh-pages branch over HTTPS. The rejected first edition used source commit 2028557 and static commit 94c25d09c26ffd3bad98205926764623a2a585d4; GitHub's built-in Pages job is [run 36265530452](https://github.com/brentthomas248/handrail-proposal/actions/runs/36265530452).

The current OAuth credential lacks workflow-write permission. The optional project workflows are therefore inactive templates under `docs/github-actions/`. The pages template would build and verify the site and PDF before deployment; the verify template would run checks on pushes and pull requests. Neither template ran remotely. The first edition was validated locally; the redesign needs its own release checks. GitHub's own Pages job handles branch deployment. Do not describe that deployment job as a remote project-test pass.

Describe AI assistance accurately: Brent supplied the business intent and negotiated proposal; AI tools assisted design, implementation and review. List completed validation separately from planned validation. Do not describe an installed tool, generated scaffold or an unexecuted workflow as successful end-to-end evidence.

## Publication and remaining work

1. Historical: the first edition was published and its hosted smoke checks passed. The user subsequently rejected its visual treatment and legal-contract framing. Those checks do not validate the replacement.
2. Pending: complete current local build, PDF, browser, component and rendered checks; publish the redesigned static output; verify the hosted zoom/pan journey, notes, downloads and mobile behavior.
3. Pending separate profile work: create the profile repository using the reviewed README, add the published redesign and a current screenshot, and apply the proposed pin order. No profile or pin mutation is included in this redesign.
4. After a profile update, inspect the public profile as a visitor. Confirm project and contribution links resolve and that no text implies ownership of the team projects.

The DFB live page's visual quality and the current public portfolio link need a browser review before any recommendation to change the profile's website field. No change to that field is proposed here.

## Audit method

Read-only checks used GitHub REST and GraphQL for profile metadata, repository metadata, README content, source-directory presence, pins and merged authored pull requests. DFB availability was checked with an HTTP HEAD request. Existing project tests were not rerun, and their current production readiness was not audited.
