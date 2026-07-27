import { readFile, access, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url)
const ORIGIN = (process.env.PUBLIC_SITE_URL || '').replace(/\/$/, '')

if (!ORIGIN) {
  throw new Error('PUBLIC_SITE_URL must be set when running verify:seo')
}

const requiredPaths = [
  '/',
  '/converter',
  '/formats',
  '/compare',
  '/security',
  '/formats/access-token',
  '/formats/refresh-token',
  '/formats/api-key',
  '/formats/sub2api',
  '/formats/new-api',
  '/formats/canonical',
  '/compare/access-token-vs-refresh-token',
  '/compare/oauth-vs-api-key',
  '/compare/sub2api-vs-new-api',
  '/compare/refresh-token-to-access-token',
  '/compare/access-token-to-canonical',
  '/compare/refresh-token-to-canonical',
  '/compare/api-key-to-canonical',
  '/compare/sub2api-to-canonical',
  '/compare/new-api-to-canonical',
  '/compare/sub2api-to-new-api',
  '/compare/new-api-to-sub2api',
  '/guides',
  '/guides/sub2api-credential-fields',
  '/guides/sub2api-authentication-structure',
  '/guides/sub2api-credential-security',
  '/guides/new-api-channel-authentication-fields',
  '/guides/new-api-credential-structure',
  '/guides/new-api-credential-security',
]

function htmlFileForPath(path) {
  return path === '/'
    ? new URL('index.html', DIST)
    : new URL(`${path.replace(/^\//, '')}/index.html`, DIST)
}

async function read(path) {
  return readFile(path, 'utf8')
}

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

for (const path of requiredPaths) {
  const file = htmlFileForPath(path)
  await access(file)
  const html = await read(file)
  const canonical = `${ORIGIN}${path === '/' ? '/' : path}`

  expect(html.includes('<html lang="en">'), `${path}: missing lang=en`)
  expect(html.includes(`rel="canonical" href="${canonical}"`), `${path}: missing canonical ${canonical}`)
  expect(html.includes('<meta name="description"'), `${path}: missing meta description`)
  expect(html.includes('<meta property="og:title"'), `${path}: missing Open Graph title`)
  expect(html.includes('<script type="application/ld+json"'), `${path}: missing JSON-LD`)
  expect(!html.includes('href="#/'), `${path}: legacy hash route link found`)
}

const robots = await read(new URL('robots.txt', DIST))
expect(robots.includes('User-agent: *'), 'robots.txt: missing wildcard user agent')
expect(robots.includes('Allow: /'), 'robots.txt: site is not explicitly crawlable')
expect(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), 'robots.txt: production sitemap URL missing')

const sitemap = await read(new URL('sitemap.xml', DIST))
for (const path of requiredPaths) {
  const expectedUrl = `${ORIGIN}${path === '/' ? '/' : path}`
  expect(sitemap.includes(`<loc>${expectedUrl}</loc>`), `sitemap.xml: missing ${expectedUrl}`)
}
expect(!sitemap.includes('#/'), 'sitemap.xml: legacy hash URL found')
expect(!sitemap.includes('/404'), 'sitemap.xml: 404 page must not be indexed')

const notFound = await read(new URL('404.html', DIST))
expect(notFound.includes('noindex,follow'), '404.html: missing noindex,follow')
expect(!notFound.includes('rel="canonical"'), '404.html: canonical must be omitted')

await access(new URL('favicon.svg', DIST))
await access(new URL('site.webmanifest', DIST))
const home = await read(new URL('index.html', DIST))
expect(home.includes('href="/favicon.svg"'), 'Home: favicon link missing')
expect(home.includes('href="/site.webmanifest"'), 'Home: web manifest link missing')

async function collectHtml(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl)
    if (entry.isDirectory()) files.push(...await collectHtml(child))
    else if (entry.name.endsWith('.html')) files.push(child)
  }

  return files
}

for (const file of await collectHtml(DIST)) {
  const html = await read(file)
  expect(!html.includes('href="#/'), `${file.pathname}: legacy hash href found`)
}

console.log(`SEO verification passed for ${requiredPaths.length} indexable routes.`)
