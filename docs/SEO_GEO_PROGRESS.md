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
├── Custom non-indexable 404 page
└── React client island
    ├── Workbench chunk
    │   ├── credential inspector
    │   ├── converter
    │   └── compatibility matrix
    └── Formats chunk
        └── formats workspace → src/content/formats.ts
```

The current site generates 29 indexable content/tool URLs before future guide expansion. The custom 404 page is intentionally excluded from the indexable URL count.

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| 0 — Measurement Baseline | Pending deployment | Production domain, Search Console, Bing Webmaster Tools, analytics, and baseline metrics still need to be configured. |
| 1 — Real URLs | Complete | Hash navigation replaced with `/converter`, `/formats`, `/compare`, and `/security`; legacy hash URLs redirect. |
| 2 — Static Generation | Complete | Astro static output is the primary build; React remains the interactive client island. |
| 3 — Language and Site Identity | Complete | Primary language is English and the canonical AuthAtlas product description is centralized. |
| 4 — SEO Metadata | Complete | Unique metadata, robots directives, canonical support, Open Graph, and Twitter Cards are generated from shared configuration. |
| 5 — robots / Sitemap / Canonical | Code complete; deployment validation pending | `/robots.txt` and `/sitemap.xml` are generated. Set `PUBLIC_SITE_URL` in production and verify crawler access through Cloudflare/WAF. |
| 6 — Format Content Layer | Complete for active UI | Static format pages and the interactive `/formats` workspace consume `src/content/formats.ts` for semantic format data. Obsolete legacy Formats code remains only as isolated source cleanup inside the workbench chunk. |
| 7 — Individual Format Pages | Complete | Six static format documentation pages exist with definitions, facts, fields, examples, conversion notes, security, FAQ, and related links. |
| 8 — Converter Landing Content | Complete | Persistent supported-format links, conversion-strategy explanations, local-processing guidance, and converter FAQ are present outside the React island. |
| 9 — Compare / Conversion Pages | Complete | Eight conversion pages and three comparison pages are static, internally linked, and included in sitemap generation. |
| 10 — Sub2API Topic Cluster | Complete | Format overview, fields, authentication structure, security, Canonical conversion, New API conversion, and comparison pages form the first focused cluster. |
| 11 — New API Topic Cluster | Complete | Format overview, channel fields, credential structure, security, Canonical conversion, Sub2API conversion, and comparison pages form the second focused cluster. |
| 12 — Internal Linking | Complete for current graph | Format pages link contextually into Guides, Compare pages, conversion pages, Converter, Security, and related formats. Main Home/Formats/Converter/Compare routes also surface the focused guides. |
| 13 — Breadcrumbs | Complete for current content | Format, Compare, and Guide detail pages expose visible breadcrumb navigation; the Guides index and hierarchical pages also expose machine-readable breadcrumb data. |
| 14 — Structured Data | Complete | Home uses WebSite + SoftwareApplication, Converter uses SoftwareApplication, Security and deep documentation pages use TechArticle where appropriate, and hierarchical pages use BreadcrumbList. AuthAtlas software metadata links back to the source repository. |
| 15 — Broader Guides | Deliberately deferred | Expand broad OAuth/authentication content after Sub2API/New API pages have been indexed and query data is available. |
| 16 — GitHub Entity / Discovery | In progress | Canonical positioning, recommended repository description/topics, README messaging, deployment checklist, and source-linked JSON-LD are implemented. Repository-level description/topics/homepage still need to be applied when supported and once the production URL is final. |
| 17 — 404 / Crawl Hardening | Complete | Astro emits a top-level custom `404.html` with `noindex,follow`, no canonical URL, useful recovery links, and no structured-data inference. This disables Cloudflare Pages' SPA catch-all behavior for unknown routes. |
| 18 — Authority / Evidence | Complete | OAuth pages cite RFC 6749; Sub2API/New API Format, Guide, Compare, and Conversion content links authoritative upstream repositories/docs and clearly distinguishes AuthAtlas modeling from upstream-defined behavior. |
| 19 — Browser / Brand Discovery | Complete | Shared favicon, web manifest, application name, and source-linked SoftwareApplication/WebSite/TechArticle identity are emitted from the common layout/content layer. |
| 20 — Route JS Splitting | Complete | Workbench and Formats React code are loaded as separate lazy chunks, so each primary route avoids eagerly loading the other workspace. |
| 21 — SEO Regression CI | Complete | CI builds with a deterministic site origin and verifies all 29 routes, canonical tags, JSON-LD, robots, sitemap, 404 behavior, favicon/manifest, and absence of legacy hash links. |
| 22 — Cloudflare Static Headers | Code complete; deployment validation pending | `_headers` is aligned with Astro `/_astro/*` assets, immutable hashed-asset caching, current legacy-route inline script behavior, and browser security policies. Verify final response headers after production deployment. |
| 23 — Frontend Performance Budget | Complete | CI measures generated JS/CSS raw and gzip sizes and fails when conservative chunk or aggregate gzip budgets are exceeded. Tighten budgets after production Core Web Vitals data is available. |
| 24+ | Deployment / data dependent | Production performance review, external authority building, Search Console iteration, automated share assets if useful, dependency-lock reproducibility, and later content expansion remain. |

## Structured data coverage

```text
/                         WebSite + SoftwareApplication
/converter                SoftwareApplication + BreadcrumbList
/security                 TechArticle + BreadcrumbList
/formats/<slug>            TechArticle + BreadcrumbList
/compare/<slug>            TechArticle + BreadcrumbList
/guides                    BreadcrumbList
/guides/<slug>             TechArticle + BreadcrumbList
/404                      intentionally none
```

Absolute structured-data URLs are emitted when `PUBLIC_SITE_URL` is configured. CI uses a reserved test origin so generated absolute URLs can be regression-tested without pretending that test origin is the production domain.

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

## Authority / evidence coverage

- Access Token, Refresh Token, OAuth comparisons, and Refresh Token → Access Token cite RFC 6749.
- Sub2API pages identify the upstream project as `Wei-Shaw/sub2api` and separate official gateway positioning from AuthAtlas's account/configuration modeling abstraction.
- New API pages cite `QuantumNous/new-api` and official New API documentation for project positioning, channels, authentication, and security/compliance context.
- Sub2API ↔ New API pages explicitly describe gateway-to-gateway conversion as conditional AuthAtlas schema mapping, not an upstream-defined universal conversion contract.

## Automated release checks

`npm run verify:seo` checks the built `dist/` output for:

- all 29 required indexable routes;
- English language declaration and page-level canonical URLs;
- descriptions, Open Graph metadata, and JSON-LD;
- robots.txt and sitemap coverage;
- custom 404 `noindex,follow` behavior with no canonical;
- favicon and web manifest output;
- no legacy `href="#/..."` links;
- Cloudflare `_headers` rules for Astro immutable assets and current security policies.

`npm run verify:performance` measures generated assets and currently enforces:

- largest JavaScript chunk ≤ 220 KiB gzip;
- total generated JavaScript ≤ 420 KiB gzip;
- largest CSS asset ≤ 90 KiB gzip;
- total generated CSS ≤ 160 KiB gzip.

These are pre-production regression budgets rather than Core Web Vitals targets. Recalibrate them after measuring the deployed site.

## Entity and deployment documentation

- [`ENTITY_POSITIONING.md`](./ENTITY_POSITIONING.md) defines the canonical product description, terminology, GitHub description, topics, and messaging rules.
- [`SEO_DEPLOYMENT_CHECKLIST.md`](./SEO_DEPLOYMENT_CHECKLIST.md) defines the production-domain, Cloudflare, sitemap, crawler, Search Console, Bing, analytics, and launch-baseline checks.

## Deployment tasks still required

These cannot be completed correctly until the production domain is known:

- Set `PUBLIC_SITE_URL` in Cloudflare Pages.
- Connect the final production website URL to the GitHub repository metadata.
- Apply the recommended GitHub repository description and topics.
- Verify canonical URLs use the production origin.
- Verify `/robots.txt` includes the production sitemap URL.
- Verify `/sitemap.xml` contains all generated production URLs.
- Validate JSON-LD against the deployed production URLs.
- Verify the custom 404 is served with an HTTP 404 status for unknown routes.
- Verify Cloudflare/WAF allows intended search and AI search crawlers.
- Verify production `_headers`, including security headers and immutable `/_astro/*` browser caching.
- Connect Google Search Console.
- Connect Bing Webmaster Tools.
- Submit the sitemap.
- Record the initial indexing, impression, click, CTR, ranking, and Core Web Vitals baseline.

## Build reproducibility note

The repository currently does not contain `package-lock.json`, so CI still uses `npm install`. Do not switch the workflow to `npm ci` until a real lockfile has been generated and committed from the declared dependency graph. Once present, use the lockfile for deterministic CI installs and dependency review.

## Next implementation target

Continue in this order:

1. Remove the obsolete dead `formatItems` / legacy `FormatsPage` source after the replacement workspace has been exercised in deployment previews; route splitting already prevents `/formats` from loading that old workbench chunk.
2. Generate and commit a real npm lockfile, then change CI from `npm install` to `npm ci`.
3. Apply GitHub description/topics/homepage metadata once repository-metadata write support and the production URL are available.
4. Run a production performance, response-header, and crawlability review after Cloudflare Pages deployment.
5. Wait for initial indexing/query data before expanding broad authentication guides.
