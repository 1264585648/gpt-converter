export type PageKey = 'home' | 'converter' | 'formats' | 'compare' | 'security'

export const siteIdentity = {
  name: 'AuthAtlas',
  description: 'AuthAtlas is a local-first AI credential inspector and format converter for OAuth tokens, API keys, Sub2API, New API, and related gateway credential formats.',
  locale: 'en_US',
} as const

type PageSeo = {
  title: string
  description: string
  path: string
  ogImage: string
  robots?: string
}

export const pageSeo: Record<PageKey, PageSeo> = {
  home: {
    title: 'AuthAtlas — AI Credential Inspector & Format Converter',
    description: 'Inspect, compare, and convert OAuth tokens, API keys, Sub2API, New API, and related AI credential formats locally in your browser.',
    path: '/',
    ogImage: '/mockups/home.jpg',
  },
  converter: {
    title: 'AI Credential Converter — OAuth, Sub2API & New API | AuthAtlas',
    description: 'Convert supported OAuth tokens, API keys, Sub2API, New API, and canonical credential schemas locally in your browser.',
    path: '/converter',
    ogImage: '/mockups/converter.jpg',
  },
  formats: {
    title: 'AI Authentication Formats — OAuth, API Keys & Gateways | AuthAtlas',
    description: 'Explore access tokens, refresh tokens, API keys, Sub2API, New API, and canonical credential formats with security and compatibility guidance.',
    path: '/formats',
    ogImage: '/mockups/formats.jpg',
  },
  compare: {
    title: 'AI Credential Conversion Compatibility Matrix | AuthAtlas',
    description: 'Compare AI credential formats and identify local extraction, schema mapping, OAuth exchange, self, and impossible conversion paths.',
    path: '/compare',
    ogImage: '/mockups/compare.jpg',
  },
  security: {
    title: 'AI Credential Security & Local Processing | AuthAtlas',
    description: 'Learn how AuthAtlas keeps credential inspection and compatible schema mapping in browser memory and distinguishes local conversion from remote OAuth exchange.',
    path: '/security',
    ogImage: '/mockups/home.jpg',
  },
}
