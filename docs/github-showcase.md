# GitHub showcase handoff

Prepared September 26, 2026. This document records a read-only public-profile audit and a proposed publication sequence. No profile, pin, remote repository or deployment has been changed.

The local proposal is now implemented. The repository README documents its current architecture and commands; its status remains local preview with publication pending. The public-profile observations below are the audit snapshot from the same date, not proof of a later deployment.

## Current public evidence

| Surface | Verified observation | Implication |
| --- | --- | --- |
| [Profile](https://github.com/brentthomas248) | Display name Brent Showalter; bio describes AI-native software engineering, Python/FastAPI and deterministic evaluation. Twelve public repositories, nine of them forks. | Lead with a few inspectable examples rather than repository count. |
| Profile repository | `brentthomas248/brentthomas248` returned HTTP 404 through authenticated GitHub API. | The profile README draft is a new artifact, not an update to an existing README. |
| Proposal repository | `brentthomas248/handrail-proposal` returned HTTP 404 through authenticated GitHub API. | Do not present a repository or Pages URL as live until publication is verified. |
| [DFB Brand Studio](https://github.com/brentthomas248/dfb-brand) | Owned public repository; README describes interactive color and typography exploration. The [live page](https://brentthomas248.github.io/dfb-brand/) returned HTTP 200. | Strong visual example to place directly below the new proposal. HTTP availability does not establish browser QA. |
| [Demand forecasting](https://github.com/brentthomas248/shotgun-demand-forecasting) | Owned public repository with author attribution, source directories, reproducible setup and evaluation limitations. | Demonstrates analytical depth; retain its academic context. Do not claim production deployment. |
| [BOXMEOUT-STELLA #44](https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44) | Authored by `brentthomas248`, merged July 16, 2026. Files and description cover property tests, CI and accounting corrections. | Credit the precise contribution; do not present the complete platform as an independently authored product. |
| [Open-Stellar #430](https://github.com/Bitcoindefi/Open-Stellar/pull/430) | Authored by `brentthomas248`, merged July 16, 2026. Files cover Playwright scenarios, CI and sidebar accessibility attributes. | A concrete example of verification work. Link the contribution directly from the profile. |

Current pins, verified through GitHub GraphQL: demand forecasting, `GruftNet/BOXMEOUT-STELLA`, then `Bitcoindefi/Open-Stellar`.

## Profile README

[github-profile-draft.md](github-profile-draft.md) is the proposed README body. It contains only currently inspectable public examples and accurate contribution attribution. It deliberately has no speculative proposal link or performance claim.

After the proposal passes release checks and both public URLs resolve, add this as the first selected-work entry, replacing the two URL placeholders with the verified destinations:

> **Handrail proposal** — An interactive agreement built around an unfolding paper scene. Read the commercial terms in semantic HTML, switch off motion or download the matching PDF. The source includes the contract content model, accessibility fallbacks and browser tests. **View proposal · Source**

Only retain capabilities in that paragraph that actually ship and pass verification. Use a single optimized screenshot linked to the live proposal above the selected-work list; provide descriptive alt text. Do not add status badges, visitor counters, skill-logo grids, animated typing banners or unsupported impact metrics.

## Proposed pin order

1. `brentthomas248/handrail-proposal` — after public release and verification.
2. `brentthomas248/dfb-brand` — immediate visual proof from an existing project.
3. `brentthomas248/shotgun-demand-forecasting` — analytical engineering and documented evaluation.
4. `GruftNet/BOXMEOUT-STELLA` — keep the existing team-project pin; scope authorship in the README.
5. `Bitcoindefi/Open-Stellar` — keep the existing team-project pin; link the merged testing contribution.

Leave the sixth pin empty until another project offers equally clear evidence. The `dance-floor-bros-preview` repository currently adds less context than the brand studio, so it should not displace these examples without stronger documentation.

## Proposal repository presentation

Suggested repository description: **A scroll-driven contract proposal with an unfolding paper scene, readable agreement and accessible motion controls.**

The current repository README uses the inspected `docs/media/proposal-desktop.png` browser capture. It documents the two compensation paths, architecture, local commands, reading paths and tool attribution. It contains no broken screenshot links or unverified live-site claim.

The desktop screenshot has been added after local visual review. Do not link directly to ignored `qa-artifacts/` or `test-results/` paths. Inspect the screenshot for draft/debug UI and private data before publication. Add the live link and set the repository homepage only after the deployed URL resolves and the published workflow passes.

The intended GitHub Pages route is `/handrail-proposal/`, matching `astro.config.mjs`. The prepared manual `docs/github-actions/pages.yml` builds the static site and current PDF, verifies content and browser flows, uploads `dist/`, and deploys through GitHub Pages. `docs/github-actions/verify.yml` runs verification on pushes and pull requests. These workflows have not yet run on GitHub. Use the checked-in workflow's actual trigger and permissions when publishing; do not assume that creating a repository automatically enables Pages. Repository creation, Pages configuration, Actions deployment and profile/pin updates are separate external mutations.

Describe AI assistance accurately: Brent supplied the business intent and negotiated proposal; AI tools assisted design, implementation and review. List completed validation separately from planned validation. Do not describe an installed tool, generated scaffold or an unexecuted workflow as successful end-to-end evidence.

## Publication sequence and remaining verification

1. Complete final validation and reconcile the implementation record, generated agreement/PDF and README with observed behavior. Add measured results only after the corresponding checks pass.
2. Inspect the complete public diff and deployment workflow, including screenshots, PDF metadata and repository documents. Exclude private research, internal finances, client details, correspondence, personal local paths, credentials and raw service receipts.
3. Obtain the workspace-required publication approval, then publish the proposal repository and enable the tested Pages workflow.
4. Verify the deployed home page, direct contract links, PDF download, assets and reduced-motion behavior at the final base path. Check mobile and desktop screenshots.
5. Create the profile repository using the reviewed README. Add the verified proposal entry and screenshot, then apply the proposed pin order.
6. Inspect the rendered public profile and repository as a visitor. Confirm each project link and contribution link resolves and that no public text implies ownership of the team projects.

The DFB live page's visual quality and the current public portfolio link need a browser review before any recommendation to change the profile's website field. No change to that field is proposed here.

## Audit method

Read-only checks used GitHub REST and GraphQL for profile metadata, repository metadata, README content, source-directory presence, pins and merged authored pull requests. DFB availability was checked with an HTTP HEAD request. Existing project tests were not rerun, and their current production readiness was not audited.
