import { siteIdentity } from './seo'

export type JsonLdNode = Record<string, unknown>

export function absoluteUrl(site: URL | undefined, path: string) {
  return site ? new URL(path, site).toString() : undefined
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
    author: {
      '@type': 'Organization',
      name: siteIdentity.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteIdentity.name,
    },
    ...(site ? { url: absoluteUrl(site, path), mainEntityOfPage: absoluteUrl(site, path) } : {}),
  }
}
