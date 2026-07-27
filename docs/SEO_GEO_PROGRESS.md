# AuthAtlas SEO + GEO Progress

This file tracks implementation progress against [`SEO_GEO_ROADMAP.md`](./SEO_GEO_ROADMAP.md).

Last updated: 2026-07-27

## Current architecture

```text
Astro static site
├── Main routes
│   ├── /
│   ├── /converter
│   ├── /formats
│   ├── /compare
│   └── /security
├── Format documentation
│   └── /formats/<slug>
├── Comparison and conversion pages
│   └── /compare/<slug>
├── Topic guides
│   ├── /guides
│   └── /guides/<slug>
└── React client island
    ├── credential inspector
    ├── converter
    ├── formats workspace
    └── compatibility matrix
```

The current site generates 29 indexable content/tool URLs before future guide expansion.

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| 0 — Measurement Baseline | Pending deployment | Production domain, Search Console, Bing Webmaster Tools, analytics, and baseline metrics still need to be configured. |
| 1 — Real URLs | Complete | Hash navigation replaced with `/converter`, `/formats`, `/compare`, and `/security`; legacy hash URLs redirect. |
| 2 — Static Generation | Complete | Astro static output is the primary build; React remains the interactive client island. |
| 3 — Language and Site Identity | Complete | Primary language is English and the canonical AuthAtlas product description is centralized. |
| 4 — SEO Metadata | Complete | Unique metadata, robots directives, canonical support, Open Graph, and Twitter Cards are generated from shared configuration. |
| 5 — robots / Sitemap / Canonical | Code complete; deployment validation pending | `/robots.txt` and `/sitemap.xml` are generated. Set `PUBLIC_SITE_URL` in production and verify crawler access through Cloudflare/WAF. |
| 6 — Format Content Layer | Partial | Pure format content and stable slugs exist in `src/content/formats.ts`. The static format pages use it; the legacy React Formats workspace still has presentation data to migrate. |
| 7 — Individual Format Pages | Complete | Six static format documentation pages exist with definitions, facts, fields, examples, conversion notes, security, FAQ, and related links. |
| 8 — Converter Landing Content | Complete | Persistent supported-format links, conversion-strategy explanations, local-processing guidance, and converter FAQ are present outside the React island. |
| 9 — Compare / Conversion Pages | Complete | Eight conversion pages and three comparison pages are static, internally linked, and included in sitemap generation. |
| 10 — Sub2API Topic Cluster | Complete | Format overview, fields, authentication structure, security, Canonical conversion, New API conversion, and comparison pages form the first focused cluster. |
| 11 — New API Topic Cluster | Complete | Format overview, channel fields, credential structure, security, Canonical conversion, Sub2API conversion, and comparison pages form the second focused cluster. |
| 12 — Internal Linking | In progress | Format, Compare, Converter, and Guide pages link across major intent transitions; further contextual linking can be added as content expands. |
| 13 — Breadcrumbs | Complete for deep content | Format, Compare, and Guide detail pages expose visible breadcrumb navigation; breadcrumb hierarchy is also machine-readable. |
| 14 — Structured Data | Complete | Home uses WebSite + SoftwareApplication, Converter uses SoftwareApplication, Security and deep documentation pages use TechArticle where appropriate, and hierarchical pages use BreadcrumbList. |
| 15 — Broader Guides | Deliberately deferred | Expand broad OAuth/authentication content after Sub2API/New API pages have been indexed and query data is available. |
| 16+ | Not started / deployment dependent | GitHub entity metadata, automated OG assets, performance review, external authority, Search Console iteration, and other growth work remain. |

## Structured data coverage

```text
/                         WebSite + SoftwareApplication
/converter                SoftwareApplication + BreadcrumbList
/security                 TechArticle + BreadcrumbList
/formats/<slug>            TechArticle + BreadcrumbList
/compare/<slug>            TechArticle + BreadcrumbList
/guides/<slug>             TechArticle + BreadcrumbList
```

Absolute structured-data URLs are emitted when `PUBLIC_SITE_URL` is configured. Local and CI builds do not invent a production origin.

## Current generated content URLs

### Main

```text
/
/converter
/formats
/compare
/security
```

### Formats

```text
/formats/access-token
/formats/refresh-token
/formats/api-key
/formats/sub2api
/formats/new-api
/formats/canonical
```

### Comparisons and conversions

```text
/compare/access-token-vs-refresh-token
/compare/oauth-vs-api-key
/compare/sub2api-vs-new-api
/compare/refresh-token-to-access-token
/compare/access-token-to-canonical
/compare/refresh-token-to-canonical
/compare/api-key-to-canonical
/compare/sub2api-to-canonical
/compare/new-api-to-canonical
/compare/sub2api-to-new-api
/compare/new-api-to-sub2api
```

### Guides

```text
/guides
/guides/sub2api-credential-fields
/guides/sub2api-authentication-structure
/guides/sub2api-credential-security
/guides/new-api-channel-authentication-fields
/guides/new-api-credential-structure
/guides/new-api-credential-security
```

## Deployment tasks still required

These cannot be completed correctly until the production domain is known:

- Set `PUBLIC_SITE_URL` in Cloudflare Pages.
- Verify canonical URLs use the production origin.
- Verify `/robots.txt` includes the production sitemap URL.
- Verify `/sitemap.xml` contains all generated production URLs.
- Validate JSON-LD against the deployed production URLs.
- Verify Cloudflare/WAF allows intended search and AI search crawlers.
- Connect Google Search Console.
- Connect Bing Webmaster Tools.
- Submit the sitemap.
- Record the initial indexing, impression, click, CTR, ranking, and Core Web Vitals baseline.

## Next implementation target

Continue in this order:

1. Remove the remaining duplicated format content in the React workspace so static docs and interactive UI share one source of truth.
2. Improve GitHub entity/discovery signals and connect the production website URL once the domain is final.
3. Run a production performance and crawlability review after Cloudflare Pages deployment.
4. Wait for initial indexing/query data before expanding broad authentication guides.
