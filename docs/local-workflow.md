# Approved local workflow

The user explicitly approved continuing this Handrail implementation locally after the supported 1Password authorization request was denied. This decision is limited to this repository and this delivery. Global Agentic UI defaults and credential boundaries remain unchanged.

## Tool scope

Stitch and Magic generation, Stagehand semantic QA, and Browserbase hosted replay are omitted with user authorization. Their credentials and live tool calls remain unverified; this project must not claim full credentialed or cloud lifecycle certification. No retry of 1Password authentication, direct secret recovery, or static credential workaround is part of this scope.

Local design and implementation follow DESIGN.md and the frontend-design skill. Required evidence is local Storybook component/API/state proof, the Storybook MCP endpoint, deterministic Playwright browser interactions and screenshots, axe accessibility checks, type checking, a production build, contract scenario tests, and local performance measurement. Product QA and publication are separate: local tests do not imply the site has been published or the contract accepted.

## Local services

- App: `pnpm dev`, bound to `127.0.0.1:4321`, route `/handrail-proposal/`.
- Storybook: `pnpm storybook`, bound to `127.0.0.1:6006`; MCP endpoint `http://127.0.0.1:6006/mcp`.
- Static output: no backend, databases, accounts, signatures, external message delivery, or remote data mutation.
- Isolated local browser contexts only. No personal browser profile or credentialed service access is needed.

## Evidence status

The lifecycle ledger and workflow feed record actual checks. Configuration and stories are preparation, not evidence of passed component interactions or product quality. Build output, live endpoint validation, interaction/accessibility results and screenshots must exist before their corresponding phases are marked passed.

Publication remains subject to the review and approval boundary recorded in PROJECT.md. Manual assistive-technology certification and hosted replay must not be represented as completed by automated local tests.

## Verified component workshop

`pnpm build-storybook` completed successfully with the normal large-chunk warning for Storybook/Three.js tooling. The required live endpoint validator passed at `http://127.0.0.1:6006/mcp`. Real MCP initialize and tools/list returned `@storybook/addon-mcp` 10.6.0; docs-list, docs-show, stories-changed and stories-preview calls succeeded.

`node .storybook/verify-components.mjs` passed seven behavior scenarios with zero axe violations and zero uncaught browser errors: employment-first terms; mobile client-first terms and no overflow; keyboard/persisted motion preference; static fallback without canvas; folded and unfolded scene rendering; SceneHost promotion after renderer readiness; and system reduced-motion overriding an enabled saved preference. Rendered desktop/mobile/folded/unfolded screenshots were inspected. Generated receipts and images remain under ignored `qa-artifacts/storybook/`.

Storybook contains documentation and stories for DealPath, MotionToggle, PaperFallback, PaperScene and SceneHost. Internal Three.js components are covered through PaperScene rather than artificial public props. These checks do not replace app-level no-JavaScript, WebGL failure, responsive, download and accessibility testing.

Local review links while Storybook is running:

- [Changed stories](http://localhost:6006/?statuses=affected;modified;new)
- [Folded scene](http://localhost:6006/?path=/story/proposal-folding-paper-scene--folded)
- [Keyboard motion control](http://localhost:6006/?path=/story/proposal-motion-preference--keyboard-toggle)

## Static-app policy and validator limits

This app has no database or business mutation endpoints. Its project policy uses the schema-supported `read-only` mode with zero allowed mutations. The current global autonomy and professional-readiness scripts nevertheless hardcode `broad-sandbox` and require database/cleanup evidence. Their failures are retained as a validator compatibility limitation; no database, mutation authorization, or cleanup proof is fabricated.

The global design-governance scan also checks literal CSS dimensions and decorative graphics colors without applying its configured approved-pattern fields. The project records real design lint/export and rendered evidence, while any outstanding literal-scan findings remain visible. This is not a claim of a passing unmodified full-stack certification.

## Local performance and remaining certification gaps

Lighthouse 13.5.0 measured the built local homepage at 99 performance on mobile (optimized mobile runs varied 93–99) and 100 on desktop; accessibility, best practices and SEO scored 100 for both. Mobile LCP was 1962 ms and CLS 0.000042; desktop LCP was 445 ms and CLS 0.000011. TBT was 44 ms on mobile and zero on desktop. These are lab measurements, not field INP. See agentic-ui/performance-evidence.json for exact values.

The original 250 KB route JavaScript budget remains unmet: Lighthouse observed 365,963 transferred script bytes, including the lazy 3D scene. The design literal scan also retains four findings. Manual VoiceOver, physical touch-device review, deployed performance and cloud adapters remain unverified. These limitations are recorded openly in blockers.json and the scorecard; a working local release is not full global lifecycle certification.

Component receipts now live under ignored qa-artifacts/storybook/ so the app test runner cannot erase them when it resets test-results/.

## Final local verification

The final sequenced app/check/build/PDF/browser/component pipeline completed with exit 0: 30 files checked without issues, 31 scenario tests, two built static routes, a three-page PDF with all 18 sections and 29 canonical paragraphs independently checked, 13 browser tests and seven component scenarios. The app suite covers exact clause text, four viewport widths, keyboard/motion behavior, no-JavaScript, WebGL failure, PDF availability and zero axe violations on both routes. See agentic-ui/local-verification.json. The local scope is complete; strict certification, deployment and agreement execution remain separate.
