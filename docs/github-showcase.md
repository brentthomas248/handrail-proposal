# GitHub showcase handoff

Updated September 26, 2026. The user authorized publishing the proposal. The [public source repository](https://github.com/brentthomas248/handrail-proposal) and [live proposal](https://brentthomas248.github.io/handrail-proposal/) are available. The homepage returned HTTP 200 with the expected proposal heading. Profile README and pin changes remain unapplied.

The repository README documents the shipped architecture, local commands and live reading routes. The public-profile observations below retain the original audit snapshot from the same date; the proposal repository row reflects its later publication. HTTP availability is separate from browser QA.

## Current public evidence

| Surface | Verified observation | Implication |
| --- | --- | --- |
| [Profile](https://github.com/brentthomas248) | Display name Brent Showalter; bio describes AI-native software engineering, Python/FastAPI and deterministic evaluation. Twelve public repositories, nine of them forks. | Lead with a few inspectable examples rather than repository count. |
| Profile repository | `brentthomas248/brentthomas248` returned HTTP 404 through authenticated GitHub API. | The profile README draft is a new artifact, not an update to an existing README. |
| [Proposal repository](https://github.com/brentthomas248/handrail-proposal) | Published after explicit user authorization. The [live proposal](https://brentthomas248.github.io/handrail-proposal/) returned HTTP 200 with the expected heading. | The source and proposal links can now be used. Hosted browser findings are recorded separately. |
| [DFB Brand Studio](https://github.com/brentthomas248/dfb-brand) | Owned public repository; README describes interactive color and typography exploration. The [live page](https://brentthomas248.github.io/dfb-brand/) returned HTTP 200. | Strong visual example to place directly below the new proposal. HTTP availability does not establish browser QA. |
| [Demand forecasting](https://github.com/brentthomas248/shotgun-demand-forecasting) | Owned public repository with author attribution, source directories, reproducible setup and evaluation limitations. | Demonstrates analytical depth; retain its academic context. Do not claim production deployment. |
| [BOXMEOUT-STELLA #44](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44) | Authored by `brentthomas248`, merged July 16, 2026. Files and description cover property tests, CI and accounting corrections. | Credit the precise contribution; do not present the complete platform as an independently authored product. |
| [Open-Stellar #430](https://github.com/Bitcoindefi/Open-Stellar/pull/430) | Authored by `brentthomas248`, merged July 16, 2026. Files cover Playwright scenarios, CI and sidebar accessibility attributes. | A concrete example of verification work. Link the contribution directly from the profile. |

Current pins, verified through GitHub GraphQL: demand forecasting, `GruftNet/BOXMEOUT-STELLA`, then `Bitcoindefi/Open-Stellar`.

## Profile README

[github-profile-draft.md](github-profile-draft.md) is the proposed README body. It contains only currently inspectable public examples and accurate contribution attribution. It deliberately has no speculative proposal link or performance claim.

For a separately authorized profile update, use this as the first selected-work entry:

> **Handrail proposal** — An interactive agreement built around an unfolding paper scene. Read the commercial terms in semantic HTML, switch off motion or download the matching PDF. The source includes the contract content model, accessibility fallbacks and browser tests. [View proposal](https://brentthomas248.github.io/handrail-proposal/) · [Source](https://github.com/brentthomas248/handrail-proposal)

Only retain capabilities in that paragraph that actually ship and pass verification. Use a single optimized screenshot linked to the live proposal above the selected-work list; provide descriptive alt text. Do not add status badges, visitor counters, skill-logo grids, animated typing banners or unsupported impact metrics.

## Proposed pin order

1. `brentthomas248/handrail-proposal` — the published interactive proposal and source.
2. `brentthomas248/dfb-brand` — immediate visual proof from an existing project.
3. `brentthomas248/shotgun-demand-forecasting` — analytical engineering and documented evaluation.
4. `GruftNet/BOXMEOUT-STELLA` — keep the existing team-project pin; scope authorship in the README.
5. `Bitcoindefi/Open-Stellar` — keep the existing team-project pin; link the merged testing contribution.

Leave the sixth pin empty until another project offers equally clear evidence. The `dance-floor-bros-preview` repository currently adds less context than the brand studio, so it should not displace these examples without stronger documentation.

## Proposal repository presentation

Suggested repository description: **A scroll-driven contract proposal with an unfolding paper scene, readable agreement and accessible motion controls.**

The current repository README uses the inspected `docs/media/proposal-desktop.png` browser capture. It documents the two compensation paths, architecture, local commands, live reading routes and tool attribution.

The desktop screenshot was added after local visual review. Do not link directly to ignored `qa-artifacts/` or `test-results/` paths. The public-content review covered tracked source and the PDF and found no private company finances, client identifiers, credentials or private research.

The live GitHub Pages route is `/handrail-proposal/`, matching `astro.config.mjs`. Pages serves the root of the gh-pages branch over HTTPS. Initial publication used source commit 2028557 and static commit 94c25d09c26ffd3bad98205926764623a2a585d4; GitHub's built-in Pages job is [run 36265530452](https://github.com/brentthomas248/handrail-proposal/actions/runs/36265530452).

The current OAuth credential lacks workflow-write permission. The optional project workflows are therefore inactive templates under `docs/github-actions/`. The pages template would build and verify the site and PDF before deployment; the verify template would run checks on pushes and pull requests. Neither template ran remotely. The published output was validated locally, and GitHub's own Pages job handles branch deployment. Do not describe that deployment job as a remote project-test pass.

Describe AI assistance accurately: Brent supplied the business intent and negotiated proposal; AI tools assisted design, implementation and review. List completed validation separately from planned validation. Do not describe an installed tool, generated scaffold or an unexecuted workflow as successful end-to-end evidence.

## Publication and remaining work

1. Completed: local release validation, public-content review, explicit user authorization, public source push and gh-pages configuration. The homepage returns HTTP 200 with the expected heading.
2. Completed: hosted browser smoke checks at 2026-09-26T19:19:29.538Z verified actual wheel-driven paper animation, rate cards and disclosures, all 18 canonical agreement sections, the independently verified PDF, a 390px mobile layout without overflow, direct navigation, persisted motion preference and system reduced motion. Zero page errors or failed requests were observed. GitHub's built-in Pages run 36265530452 succeeded. These are live checks, separate from local tests and inactive workflow templates.
3. Pending separate profile work: create the profile repository using the reviewed README, add the proposal entry and screenshot, and apply the proposed pin order. No profile or pin mutation was included in this site publication.
4. After a profile update, inspect the rendered public profile as a visitor. Confirm project and contribution links resolve and that no text implies ownership of the team projects.

The DFB live page's visual quality and the current public portfolio link need a browser review before any recommendation to change the profile's website field. No change to that field is proposed here.

## Audit method

Read-only checks used GitHub REST and GraphQL for profile metadata, repository metadata, README content, source-directory presence, pins and merged authored pull requests. DFB availability was checked with an HTTP HEAD request. Existing project tests were not rerun, and their current production readiness was not audited.
