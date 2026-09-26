# Handrail brand sources

Recorded September 26, 2026. The user requested continuity with Handrail's careers page, sample MOU and supplied pricing material while keeping the previously approved animation references. This records provenance and implementation choices; it does not imply Handrail approved the proposal or the user accepted the final visual result.

## Official public references

| Source                                                                                                   | Observed role                                                                                                                                                                                                                                     | Application                                                                                                  |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Careers](https://handrail-daas.com/careers) and [career ladder](https://handrail-daas.com/careerladder) | Official company pages. The implementation lead inspected the pages and their [published stylesheet](https://handrail-daas.com/assets/index-CFWR83lt.css).                                                                                        | Warm editorial identity, company presentation and consistent use of its logo.                                |
| [Sample MOU](https://handrail-daas.com/careers/sample-mou.html)                                          | The implementation lead verified the live page returned HTTP 200 and captured it in the local QA artifacts. Its document uses Georgia at 15px/1.7 with ink `#24201c`, muted text `#5d574f`, rules `#d9d1c6`, rust `#ad4828` and ground `#eee9e1`. | Readable document hierarchy and warm cream/rust family. The proposal does not copy the MOU's legal drafting. |
| [Official logo PNG](https://handrail-daas.com/assets/handrail-logo-DX76znAp.png)                         | Official Handrail wordmark and “Support your climb” tagline. Local dimensions and SHA-256 were verified.                                                                                                                                          | Unchanged artwork in the header, flyer and notes; CSS changes displayed size only.                           |

The local logo is `public/handrail-logo.png`, 1397 × 392 pixels. SHA-256: `1e024d51ef5f28a6bcedfa90ff58c5f0481a81db81cbcd5efede50594766bb3a`. The logo remains Handrail's identity; this project does not claim ownership or a general license to redistribute it outside this proposal.

## Supplied documents

The implementation lead visually inspected the user-provided Handrail one-pager/pricing PDF and terms sheet. Their heavy sans-serif headline, serif introduction and document hierarchy informed the composition. Those source files remain private and are not redistributed in this repository. No local private paths, contact details or financial research are part of these public source notes.

## Implementation choices

The page adapts this material into cream `#fbfaf7`, ink `#1a1816`, rust `#c8502a`, warm ground `#ebe4d8` and muted brown `#6b6258`. These are the values in `src/styles/global.css`, not a representation that Handrail publishes an exact formal token specification.

Inter Variable supplies the sans-serif text. Playfair Display regular italic supplies the introductory accent. Both are locally bundled from version 5.3.0 of their Fontsource packages under OFL-1.1, with attribution and file hashes in `agentic-ui/assets.manifest.json`. They interpret the supplied materials; they are not asserted to be the company's exact licensed typefaces.

The motion references remain [Telescope](https://telescope.fyi/), [Igloo](https://www.igloo.inc/), [Exat](https://exat.hottype.co/) and [Stripe Press](https://press.stripe.com/). The user approved these references and the combined recommendation. Their assets, branding and proprietary code are not included. [Redesign research](redesign-research.md) records the original visual observations and public animation studies.

The actual implementation is one HTML flyer animated by GSAP ScrollTrigger, with ordinary document reading as an alternative. The previous clip/sculpture and the interim cobalt/Archivo treatment are superseded. Source approval, implementation verification and user visual acceptance remain distinct.
