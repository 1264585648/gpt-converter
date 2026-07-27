# AuthAtlas SEO + GEO Optimization Roadmap

> Repository: `1264585648/gpt-converter`
>
> Goal: turn AuthAtlas from a single-page developer tool into a crawlable, indexable, citation-friendly knowledge + utility site that can grow through traditional SEO and Generative Engine Optimization (GEO).

---

## Current State

AuthAtlas currently provides:

- Home / credential inspector
- Credential converter
- Authentication format knowledge base
- Compatibility matrix
- Security page
- Local-first browser processing
- Static Cloudflare Pages deployment

The current application is a Vite + React SPA using hash routes such as:

```text
#/
#/converter
#/formats
#/compare
#/security
```

The main SEO/GEO limitation is that the content is concentrated inside one client-rendered application instead of being exposed as independent, crawlable pages with their own URLs, metadata, headings, internal links, and structured content.

---

# Phase 0 — Measurement Baseline

Before large changes, establish a baseline so future improvements can be measured.

- [ ] Confirm production domain
- [ ] Connect Google Search Console
- [ ] Connect Bing Webmaster Tools
- [ ] Add analytics (Cloudflare Web Analytics or GA4)
- [ ] Record current indexed page count
- [ ] Record current organic impressions
- [ ] Record current organic clicks
- [ ] Record current top search queries
- [ ] Record current average search positions
- [ ] Record current Lighthouse / Core Web Vitals baseline

### Done when

We can compare traffic and indexing before and after each SEO phase.

---

# Phase 1 — Replace Hash Routing with Real URLs

## Goal

Move from hash-based SPA routes to real crawlable URLs.

### Current

```text
/#/
/#/converter
/#/formats
/#/compare
/#/security
```

### Target

```text
/
/converter
/formats
/compare
/security
```

### Tasks

- [ ] Remove `window.location.hash` routing
- [ ] Remove `hashchange` navigation logic
- [ ] Replace `href="#/..."` links with real paths
- [ ] Ensure direct navigation works
- [ ] Ensure browser refresh works on every route
- [ ] Configure Cloudflare Pages for the selected routing strategy
- [ ] Redirect old hash URLs where practical

### Done when

Opening and refreshing the following directly works:

```text
https://<domain>/converter
https://<domain>/formats
https://<domain>/compare
https://<domain>/security
```

---

# Phase 2 — Move Content Pages to Static Generation

## Recommended Architecture

Use Astro for static pages while preserving React for interactive tools.

```text
Astro
├── static SEO pages
├── format pages
├── compare pages
├── guides
│
└── React islands
    ├── Credential Inspector
    ├── Credential Converter
    └── Compatibility Matrix
```

### Tasks

- [ ] Add Astro
- [ ] Create shared site layout
- [ ] Move Home to a static page
- [ ] Move Formats index to a static page
- [ ] Move Security to a static page
- [ ] Keep Converter interaction in React
- [ ] Keep Inspector interaction in React
- [ ] Keep Compatibility Matrix interaction in React where needed
- [ ] Preserve Cloudflare Pages static deployment
- [ ] Confirm important page text is present in generated HTML

### Done when

Viewing page source for a content page shows the main heading and body text without requiring client-side JavaScript execution.

---

# Phase 3 — Language and Site Identity

The main site content is currently English, so the document language should match.

### Tasks

- [ ] Change root document language to `lang="en"`
- [ ] Keep primary site language consistently English
- [ ] Avoid mixing Chinese and English SEO content on the same canonical page
- [ ] Define a single product description for AuthAtlas
- [ ] Use consistent naming across website and GitHub

Recommended entity description:

> AuthAtlas is a local-first AI credential inspector and format converter for OAuth tokens, API keys, Sub2API, New API, and related gateway credential formats.

### Future multilingual option

```text
/
/zh/
```

If multilingual content is added later:

- [ ] Add `hreflang`
- [ ] Give each language its own URL
- [ ] Use localized metadata

---

# Phase 4 — SEO Metadata Infrastructure

Create one reusable SEO component/layout.

Every indexable page should support:

- [ ] Unique `<title>`
- [ ] Unique meta description
- [ ] Canonical URL
- [ ] Open Graph title
- [ ] Open Graph description
- [ ] Open Graph image
- [ ] Twitter card metadata
- [ ] Robots directives where needed

Example:

```text
/formats/refresh-token

Title:
What Is a Refresh Token? OAuth Lifecycle & Security | AuthAtlas

Description:
Learn how OAuth refresh tokens work, how they differ from access tokens, their security requirements, and supported conversion paths.
```

### Done when

No major indexable page shares the same title and description by default.

---

# Phase 5 — robots.txt, Sitemap, Canonical URLs

### robots.txt

- [ ] Add `public/robots.txt`
- [ ] Allow normal search crawler access
- [ ] Verify Cloudflare / WAF does not unintentionally block crawlers
- [ ] Reference sitemap URL

### Sitemap

- [ ] Generate `/sitemap.xml` automatically
- [ ] Include Home
- [ ] Include Converter
- [ ] Include Formats index
- [ ] Include every Format page
- [ ] Include Compare index
- [ ] Include every Compare page
- [ ] Include Guides
- [ ] Include Security

### Canonical

- [ ] Add self-referencing canonical tags
- [ ] Prevent query-parameter duplicates where applicable
- [ ] Avoid duplicate hash and non-hash versions

---

# Phase 6 — Extract Format Data into a Content Layer

Current format definitions should become reusable content data instead of being embedded directly in the main application component.

Recommended structure:

```text
src/content/formats/
├── access-token.ts
├── refresh-token.ts
├── api-key.ts
├── sub2api.ts
├── new-api.ts
└── canonical.ts
```

Or use Astro Content Collections.

Each format should support fields such as:

```ts
{
  slug,
  title,
  shortDescription,
  definition,
  sensitivity,
  lifetime,
  usedFor,
  transport,
  revocable,
  rotation,
  storage,
  fields,
  example,
  conversions,
  security,
  faq,
  references
}
```

### Tasks

- [ ] Move format data out of `App.tsx`
- [ ] Create stable slugs
- [ ] Reuse one source of truth across pages
- [ ] Use the same data in Formats UI
- [ ] Use the same data in Compare pages
- [ ] Use the same data in internal links
- [ ] Use the same data for sitemap generation where useful

---

# Phase 7 — Create Individual Format Pages

Create dedicated crawlable pages for the existing format entities.

- [ ] `/formats/access-token`
- [ ] `/formats/refresh-token`
- [ ] `/formats/api-key`
- [ ] `/formats/sub2api`
- [ ] `/formats/new-api`
- [ ] `/formats/canonical`

## Standard Format Page Template

```text
H1

Direct definition

At a glance

How it works

Typical fields

Example

Conversion compatibility

Security considerations

Common questions

Related formats

References
```

### Done when

Every format has:

- its own URL
- unique title
- unique description
- unique H1
- direct answer block
- internal links
- conversion links
- source/reference section where appropriate

---

# Phase 8 — Improve the Converter Landing Page

Keep the interactive converter, but add indexable explanatory content around it.

Suggested structure:

```text
H1: AI Credential Converter

Intro

[Converter UI]

Supported credential formats

How credential conversion works

Extract vs Schema Map vs OAuth Exchange

Popular conversions

Security and local processing

FAQ

Related formats

Related comparison pages
```

### Tasks

- [ ] Add static introduction above or around converter
- [ ] Add supported format links
- [ ] Explain conversion strategies
- [ ] Add popular conversion links
- [ ] Explain local-only processing clearly
- [ ] Add FAQ content
- [ ] Add related format links
- [ ] Add related compare links

---

# Phase 9 — Create Compare and Conversion Landing Pages

The compatibility matrix should remain interactive, but important conversion paths need dedicated URLs.

## Comparison Pages

- [ ] `/compare/access-token-vs-refresh-token`
- [ ] `/compare/oauth-vs-api-key`
- [ ] `/compare/sub2api-vs-new-api`

## Conversion Pages

- [ ] `/compare/refresh-token-to-access-token`
- [ ] `/compare/access-token-to-canonical`
- [ ] `/compare/refresh-token-to-canonical`
- [ ] `/compare/api-key-to-canonical`
- [ ] `/compare/sub2api-to-canonical`
- [ ] `/compare/new-api-to-canonical`
- [ ] `/compare/sub2api-to-new-api`
- [ ] `/compare/new-api-to-sub2api`

## Conversion Page Template

```text
H1

Direct answer

Conversion type

Can it be done locally?

Requirements

How the conversion works

Field mapping / example

Limitations

Security notes

Open in Converter

Related formats

Related conversions
```

### Important

Do not claim a credential can be generated from another credential when required secret material is missing.

AuthAtlas should clearly distinguish:

```text
Self
Extract
Schema Map
OAuth Exchange
Impossible
```

---

# Phase 10 — Build the Sub2API Topic Cluster

Sub2API is a strong niche keyword and should be one of the first focused topic clusters.

### Core pages

- [ ] Sub2API format overview
- [ ] Sub2API credential fields
- [ ] Sub2API authentication structure
- [ ] Sub2API to Canonical
- [ ] Sub2API to New API
- [ ] Sub2API vs New API
- [ ] Sub2API credential security

Suggested graph:

```text
Sub2API
├── Format
├── Fields
├── Security
├── Canonical conversion
└── New API comparison
```

---

# Phase 11 — Build the New API Topic Cluster

### Core pages

- [ ] New API format overview
- [ ] New API channel authentication fields
- [ ] New API credential structure
- [ ] New API to Canonical
- [ ] New API to Sub2API
- [ ] New API vs Sub2API
- [ ] New API credential security

---

# Phase 12 — Internal Linking System

Every content page should connect to the next useful user intent.

Recommended relationship:

```text
Format
  ↕
Compare
  ↕
Guide
  ↕
Converter
```

### Tasks

- [ ] Add contextual links inside format pages
- [ ] Link conversion pages back to source and target formats
- [ ] Link guides to relevant formats
- [ ] Link guides to relevant converter workflows
- [ ] Add related content sections
- [ ] Avoid orphan pages
- [ ] Prefer descriptive anchor text

Example from `/formats/refresh-token`:

```text
Access Token
Refresh Token → Access Token
Access Token vs Refresh Token
OAuth vs API Key
Credential Converter
Credential Security
```

---

# Phase 13 — Breadcrumbs

Add visible breadcrumbs to all deep pages.

Example:

```text
Home > Formats > Refresh Token
```

### Tasks

- [ ] Add breadcrumb UI
- [ ] Add `BreadcrumbList` structured data
- [ ] Ensure parent pages exist and are linked

---

# Phase 14 — Structured Data

Use schema only where it accurately represents the page.

### Homepage

- [ ] `WebSite`
- [ ] `Organization` or appropriate software entity

### Converter

- [ ] `SoftwareApplication` where appropriate

### Format / Guide Pages

- [ ] `TechArticle` or suitable article schema

### Global

- [ ] `BreadcrumbList`

### Notes

- Do not add schema only for keyword stuffing
- Do not assume FAQ schema automatically improves GEO
- Structured data should match visible page content

---

# Phase 15 — Guide Topic Cluster

Do not mass-produce blog posts before Formats and Compare pages are complete.

Start with a small high-quality guide set:

- [ ] What Is an Access Token?
- [ ] What Is a Refresh Token?
- [ ] Access Token vs Refresh Token
- [ ] OAuth vs API Key
- [ ] How OAuth Token Refresh Works
- [ ] How to Store API Keys Securely
- [ ] What Is Bearer Authentication?
- [ ] What Is Credential Rotation?
- [ ] What Is an AI API Gateway?
- [ ] How Credential Schema Conversion Works

### Content role

```text
Formats = entities
Guides  = questions / concepts
Compare = decisions / compatibility
Tools   = actions
```

Avoid creating multiple pages that answer the same intent.

---

# Phase 16 — GEO Answer Blocks

Every important content page should be easy for humans and answer engines to parse.

## Recommended pattern

```text
Question
↓
Direct answer
↓
Explanation
↓
Evidence
↓
Example
↓
Related concepts
```

### Add where useful

- [ ] One-sentence definition near top
- [ ] Direct yes/no answer for compatibility questions
- [ ] Quick facts table
- [ ] Step-by-step explanation
- [ ] Input/output example
- [ ] Limitations
- [ ] Security implications
- [ ] References

Example:

```text
Can a refresh token be converted locally into an access token?

No. A refresh token normally has to be exchanged through the OAuth authorization server. It is not a pure local schema transformation.
```

---

# Phase 17 — References and Evidence

Important factual pages should cite authoritative sources where possible.

Potential references:

- OAuth RFCs
- Official provider documentation
- Official Sub2API project documentation
- Official New API project documentation
- Relevant GitHub repositories
- Security standards / official specifications

### Tasks

- [ ] Add reference section to technical pages
- [ ] Prefer primary sources
- [ ] Keep version-dependent gateway claims explicit
- [ ] Record relevant project version when schema differs by version
- [ ] Avoid presenting guessed schema fields as universal facts

---

# Phase 18 — Strengthen the Security Page

AuthAtlas local-first processing is a strong trust and differentiation signal.

Expand `/security` to explain:

- [ ] What happens in browser memory
- [ ] What does not leave the browser
- [ ] Whether any telemetry sees credential contents
- [ ] How masked preview works
- [ ] Clipboard risks
- [ ] Export risks
- [ ] What OAuth Exchange means
- [ ] Difference between local mapping and network exchange
- [ ] How users can verify behavior from source code
- [ ] Recommendations for handling real credentials safely

---

# Phase 19 — GitHub Entity Optimization

Make GitHub and the production site describe the same product consistently.

### Repository

- [ ] Improve GitHub repository description
- [ ] Add production Homepage URL
- [ ] Add relevant repository topics
- [ ] Improve README hero section
- [ ] Add live demo link
- [ ] Add architecture overview
- [ ] Add supported formats section
- [ ] Add compatibility explanation
- [ ] Add security model
- [ ] Add screenshots
- [ ] Add documentation links
- [ ] Add release/version information

Recommended repository description:

> Local-first AI credential inspector and format converter for OAuth tokens, API keys, Sub2API and New API.

Suggested topics:

```text
oauth
oauth2
authentication
api-key
access-token
refresh-token
credential
developer-tools
sub2api
new-api
react
typescript
```

---

# Phase 20 — Open Graph and Share Assets

Create shareable social previews for major page families.

- [ ] Homepage OG image
- [ ] Format OG template
- [ ] Compare OG template
- [ ] Guide OG template

Examples:

```text
AuthAtlas
Refresh Token
OAuth Credential Guide
```

```text
AuthAtlas
Sub2API → New API
Schema Mapping Guide
```

---

# Phase 21 — Performance and Core Web Vitals

After the structural SEO work is stable:

- [ ] Run Lighthouse
- [ ] Measure LCP
- [ ] Measure CLS
- [ ] Measure INP
- [ ] Reduce unnecessary JS
- [ ] Lazy-hydrate interactive components
- [ ] Optimize images
- [ ] Optimize fonts
- [ ] Check cache headers
- [ ] Check Cloudflare caching behavior
- [ ] Test mobile layout

---

# Phase 22 — External Authority and GEO Signals

After the website structure is complete, build external references naturally.

Potential channels:

```text
GitHub
Dev.to
Hacker News
Reddit
Product Hunt
Developer blogs
Community documentation
```

Prefer educational content over pure promotion.

Example angle:

> Why converting a refresh token into an access token is not a local conversion

Then explain the problem accurately and reference AuthAtlas as a practical inspection / compatibility tool.

---

# Phase 23 — Search Data Driven Expansion

Do not guess the next 100 pages.

Use Search Console and Bing Webmaster data to decide what to build next.

Track:

```text
Query
Impressions
Clicks
CTR
Average Position
Landing Page
```

Example:

```text
sub2api token
sub2api oauth
sub2api refresh token
new api channel key
```

If these queries begin getting impressions, create or improve pages around those exact intents.

---

# Recommended Execution Order

Use this order unless technical constraints require otherwise:

```text
01. Hash routes → real URLs
02. Astro / static generation
03. Language consistency
04. Page-level metadata
05. robots.txt + sitemap + canonical
06. Format content data layer
07. Six format pages
08. Converter SEO content
09. Compare / conversion landing pages
10. Sub2API topic cluster
11. New API topic cluster
12. Internal links
13. Breadcrumbs
14. Structured data
15. Guide cluster
16. GEO answer blocks
17. References / evidence
18. Security page expansion
19. GitHub entity optimization
20. OG / sharing assets
21. Performance
22. External authority
23. Search-data iteration
```

---

# Immediate Next Milestone

Complete these before creating large amounts of new content:

- [ ] Real URLs working without hash routing
- [ ] Static HTML output for main content pages
- [ ] Unique metadata per page
- [ ] Sitemap + robots + canonical
- [ ] Format data extracted into reusable content layer
- [ ] Six format pages published
- [ ] Converter landing page expanded
- [ ] First high-value compare pages published

Once this milestone is complete, AuthAtlas will have a solid technical foundation for both SEO discovery and GEO citation.

---

# Progress Notes

Use this section to record decisions, blockers, and completed milestones.

## Decisions

- Primary language: English
- Hosting: Cloudflare Pages
- Product positioning: local-first AI credential inspector and format converter
- Priority niche: Sub2API + New API + credential format compatibility

## Changelog

- [x] SEO + GEO roadmap created
