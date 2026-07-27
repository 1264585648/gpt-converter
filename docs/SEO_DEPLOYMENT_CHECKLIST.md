# AuthAtlas SEO + GEO Deployment Checklist

Use this checklist when the production domain is attached to Cloudflare Pages. It covers the deployment work that cannot be completed safely in source code before the final public origin is known.

## 1. Production origin

- [ ] Confirm the canonical public origin, including `https://` and preferred hostname.
- [ ] Decide whether the canonical host uses `www` or the apex domain.
- [ ] Redirect the non-canonical hostname to the canonical hostname.
- [ ] Avoid serving duplicate production content from multiple permanent hostnames.

Example:

```text
https://authatlas.example
```

## 2. Cloudflare Pages configuration

In the Cloudflare Pages project, configure:

```text
Build command: npm run build
Build output:  dist
PUBLIC_SITE_URL=https://<production-domain>
```

Cloudflare Pages supports custom build environment variables through the project settings. Keep `PUBLIC_SITE_URL` equal to the final public origin and do not set it to a preview deployment URL.

After changing the variable:

- [ ] Trigger a fresh production deployment.
- [ ] Confirm the build succeeds.
- [ ] Confirm the custom domain resolves to the latest deployment.
- [ ] Confirm HTTPS is active.

## 3. Canonical metadata verification

Inspect the rendered HTML for several representative pages:

```text
/
/converter
/formats/refresh-token
/formats/sub2api
/compare/sub2api-vs-new-api
/guides/sub2api-credential-fields
```

For every indexable page verify:

- [ ] `<link rel="canonical">` exists.
- [ ] Canonical URL uses the production origin.
- [ ] Canonical URL points to the current page, not the homepage.
- [ ] `og:url` uses the production origin.
- [ ] Open Graph image URL is absolute.
- [ ] No canonical URL contains a Cloudflare preview hostname.
- [ ] No canonical URL contains `localhost` or an example domain.

## 4. robots.txt

Open:

```text
https://<production-domain>/robots.txt
```

Verify:

- [ ] The file returns HTTP 200.
- [ ] Public content is not accidentally disallowed.
- [ ] The production sitemap URL is present.
- [ ] OAI-SearchBot is not blocked if ChatGPT Search discovery is desired.
- [ ] Cloudflare WAF or bot protection does not override the intended crawler access.

Expected sitemap line:

```text
Sitemap: https://<production-domain>/sitemap.xml
```

OpenAI currently recommends allowing `OAI-SearchBot` for content that should be discoverable and eligible for summaries/snippets in ChatGPT Search.

## 5. sitemap.xml

Open:

```text
https://<production-domain>/sitemap.xml
```

Verify:

- [ ] The file returns HTTP 200.
- [ ] All URLs use HTTPS.
- [ ] All URLs use the canonical production hostname.
- [ ] Main routes are present.
- [ ] Six format routes are present.
- [ ] Compare and conversion routes are present.
- [ ] `/guides` and guide routes are present.
- [ ] Preview or development URLs are absent.
- [ ] Every sitemap URL returns an indexable page.

Google and Bing both use XML sitemaps as discovery signals. A sitemap helps discovery but does not guarantee indexing.

## 6. Structured data

Test representative URLs with a structured-data validator and inspect the page source.

Expected coverage:

```text
/                         WebSite + SoftwareApplication
/converter                SoftwareApplication + BreadcrumbList
/security                 TechArticle + BreadcrumbList
/formats/<slug>            TechArticle + BreadcrumbList
/compare/<slug>            TechArticle + BreadcrumbList
/guides/<slug>             TechArticle + BreadcrumbList
```

Verify:

- [ ] JSON-LD is valid JSON.
- [ ] Absolute URLs use the production origin.
- [ ] Breadcrumb positions are ordered correctly.
- [ ] Article headline and description match visible page content.
- [ ] No structured data claims unsupported capabilities.

## 7. Google Search Console

- [ ] Create or verify the production property.
- [ ] Submit `https://<production-domain>/sitemap.xml` in the Sitemaps report.
- [ ] Use URL Inspection on the homepage.
- [ ] Inspect `/formats/sub2api`.
- [ ] Inspect `/formats/new-api`.
- [ ] Inspect `/compare/sub2api-vs-new-api`.
- [ ] Inspect at least one guide page.
- [ ] Request indexing for a small set of important pages after launch.
- [ ] Check Page Indexing and crawl issues after Google processes the sitemap.

Google recommends the URL Inspection tool for individual pages and a sitemap for requesting discovery of multiple URLs.

## 8. Bing Webmaster Tools

- [ ] Add and verify the production site, or import the verified site from Google Search Console.
- [ ] Submit the production sitemap.
- [ ] Check sitemap processing status.
- [ ] Inspect important URLs in Site Explorer / URL Inspection.
- [ ] Monitor crawl and indexing errors.

Bing Webmaster Tools supports XML sitemap submission and can import verified sites and sitemap information from Google Search Console.

## 9. AI search crawler verification

For ChatGPT Search visibility:

- [ ] Confirm `OAI-SearchBot` is not denied in `robots.txt`.
- [ ] Check Cloudflare bot/security rules for crawler blocks.
- [ ] Verify the crawler can fetch static HTML pages without authentication.
- [ ] Keep direct definitions, examples, comparisons, and references visible in generated HTML.

Do not treat crawler access as a ranking guarantee. It only removes a technical discovery blocker.

## 10. Analytics and referral tracking

Choose Cloudflare Web Analytics, GA4, or another privacy-appropriate analytics tool.

Record the launch baseline:

- [ ] Organic sessions
- [ ] Google organic sessions
- [ ] Bing organic sessions
- [ ] Referral sessions from ChatGPT where identifiable
- [ ] Landing pages
- [ ] Converter usage events if analytics are added without collecting credential values

Never send pasted credentials, raw token values, API keys, converted outputs, clipboard contents, or credential-field values to analytics.

## 11. Initial search baseline

Record metrics after the search tools begin collecting data:

```text
Indexed URLs
Impressions
Clicks
CTR
Average position
Top queries
Top landing pages
Core Web Vitals
```

Create a dated snapshot so future SEO/GEO work can be compared against a real baseline.

## 12. First pages to monitor

Prioritize these pages because they represent the project's strongest niche intent:

```text
/formats/sub2api
/formats/new-api
/compare/sub2api-vs-new-api
/compare/sub2api-to-new-api
/compare/new-api-to-sub2api
/guides/sub2api-credential-fields
/guides/new-api-channel-authentication-fields
```

Watch query impressions before expanding broad OAuth content. Search data should determine the next guide cluster.

## 13. Post-launch smoke test

- [ ] Homepage works with JavaScript enabled.
- [ ] Deep static routes work after direct refresh.
- [ ] Converter still runs locally in the browser.
- [ ] Credential values are not sent to a backend.
- [ ] Old hash routes redirect to the corresponding real path.
- [ ] No important page returns 404.
- [ ] No important page has `noindex` accidentally set.
- [ ] Sitemap and robots files are publicly reachable.
- [ ] Canonical and structured-data origins are correct.

## Official references

- Cloudflare Pages build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Pages bindings and environment variables: https://developers.cloudflare.com/pages/functions/bindings/
- Google Search Central sitemap overview: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google Search Console top tasks: https://support.google.com/webmasters/answer/10351509
- Bing Webmaster Tools sitemaps: https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed
- Bing add and verify site: https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b
- OpenAI Publishers and Developers FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
