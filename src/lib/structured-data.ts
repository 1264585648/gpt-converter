import { siteIdentity } from './seo'

export type JsonLdNode = Record<string, unknown>

export function absoluteUrl(site: URL | undefined, path: string) {
  return site ? new URL(path, site).toString() : undefined
}

function organizationIdentity(site: URL | undefined): JsonLdNode {
  return {
    '@type': 'Organization',
    name: siteIdentity.name,
    sameAs: [siteIdentity.repositoryUrl],
    ...(site ? { url: site.toString() } : {}),
  }
}

export function graph(nodes: JsonLdNode[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  }
}

export function breadcrumbSchema(
  site: URL | undefined,
  items: Array<{ name: string; path: string }>,
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(site ? { item: absoluteUrl(site, item.path) } : {}),
    })),
  }
}

export function websiteSchema(site: URL | undefined): JsonLdNode {
  return {
    '@type': 'WebSite',
    name: siteIdentity.name,
    description: siteIdentity.description,
    inLanguage: 'en',
    publisher: organizationIdentity(site),
    ...(site ? { url: site.toString() } : {}),
  }
}

export function softwareApplicationSchema(
  site: URL | undefined,
  path: string,
  name: string,
  description: string,
): JsonLdNode {
  return {
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web browser',
    isAccessibleForFree: true,
    inLanguage: 'en',
    creator: organizationIdentity(site),
    codeRepository: siteIdentity.repositoryUrl,
    sameAs: [siteIdentity.repositoryUrl],
    ...(site ? { url: absoluteUrl(site, path) } : {}),
  }
}

export function techArticleSchema(
  site: URL | undefined,
  path: string,
  headline: string,
  description: string,
  about: string | string[],
): JsonLdNode {
  return {
    '@type': 'TechArticle',
    headline,
    description,
    about,
    inLanguage: 'en',
    author: organizationIdentity(site),
    publisher: organizationIdentity(site),
    ...(site ? { url: absoluteUrl(site, path), mainEntityOfPage: absoluteUrl(site, path) } : {}),
  }
}

function labelFromSlug(slug: string) {
  return slug
    .split('-')
    .map((part) => part.length <= 3 ? part.toUpperCase() : `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
    .replace('Sub2api', 'Sub2API')
    .replace('Api ', 'API ')
}

export function defaultStructuredDataForPage(
  site: URL | undefined,
  path: string,
  title: string,
  description: string,
): JsonLdNode | undefined {
  const segments = path.split('/').filter(Boolean)
  if (segments.length < 2) return undefined

  const root = segments[0]
  if (root !== 'formats' && root !== 'compare' && root !== 'guides') return undefined

  const rootName = root === 'formats' ? 'Formats' : root === 'compare' ? 'Compare' : 'Guides'
  const headline = title.split(' — ')[0].split(' | ')[0]
  const about = root === 'formats'
    ? ['authentication credentials', headline]
    : root === 'compare'
      ? ['credential conversion', 'authentication comparison', headline]
      : ['developer documentation', headline]

  return graph([
    techArticleSchema(site, path, headline, description, about),
    breadcrumbSchema(site, [
      { name: 'Home', path: '/' },
      { name: rootName, path: `/${root}` },
      { name: headline || labelFromSlug(segments.at(-1) ?? ''), path },
    ]),
  ])
}
