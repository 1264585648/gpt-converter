export type GuideSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  code?: string
}

export type GuideLink = {
  label: string
  href: string
}

export type GuideReference = {
  label: string
  url: string
}

export type Guide = {
  slug: string
  topic: 'Sub2API' | 'New API'
  title: string
  description: string
  directAnswer: string
  sections: GuideSection[]
  related: GuideLink[]
  references: GuideReference[]
}

const sub2apiOfficialReferences: GuideReference[] = [
  { label: 'Sub2API official GitHub repository — Wei-Shaw/sub2api', url: 'https://github.com/Wei-Shaw/sub2api' },
  { label: 'Sub2API official website', url: 'https://sub2api.org/' },
]

const newApiProjectReferences: GuideReference[] = [
  { label: 'New API official GitHub repository — QuantumNous/new-api', url: 'https://github.com/QuantumNous/new-api' },
  { label: 'New API official project introduction', url: 'https://docs.newapi.pro/en/docs/guide/wiki/basic-concepts/project-introduction' },
]

export const guides: Guide[] = [
  {
    slug: 'sub2api-credential-fields',
    topic: 'Sub2API',
    title: 'Sub2API Credential Fields',
    description: 'Understand the common credential fields AuthAtlas recognizes in Sub2API account/configuration data and why exact field names must be verified against the deployed version.',
    directAnswer: 'Sub2API is an AI API gateway platform. AuthAtlas models its version-dependent account/configuration data as a container that can expose provider metadata and upstream authentication material for inspection and mapping; the exact schema must be verified against the deployed version.',
    sections: [
      {
        heading: 'Common fields AuthAtlas looks for',
        paragraphs: ['The upstream Sub2API project is a gateway platform rather than a credential specification. AuthAtlas therefore treats recognized account/configuration fields as an inspection model, not as a claim that every Sub2API release exposes one universal import schema.'],
        bullets: ['provider — identifies the upstream provider when present', 'access_token — upstream bearer or OAuth access-token material when present', 'refresh_token — upstream OAuth refresh-token material when present', 'api_key — upstream provider API-key material when present', 'base_url — optional upstream endpoint metadata when present'],
      },
      {
        heading: 'Required fields depend on the adapter',
        paragraphs: ['A target mapping should declare which fields it requires instead of assuming every Sub2API deployment has one universal schema. Optional metadata should remain optional, and missing secrets must not be fabricated.'],
      },
      {
        heading: 'Safe normalization example',
        paragraphs: ['A recognized configuration can be normalized into Canonical format by extracting only credential material that is actually present and retaining source metadata.'],
        code: '{\n  "provider": "example",\n  "access_token": "token_example_redacted",\n  "refresh_token": "refresh_example_redacted"\n}',
      },
    ],
    related: [
      { label: 'Sub2API format overview', href: '/formats/sub2api' },
      { label: 'Sub2API → Canonical', href: '/compare/sub2api-to-canonical' },
      { label: 'Sub2API → New API', href: '/compare/sub2api-to-new-api' },
      { label: 'Sub2API vs New API', href: '/compare/sub2api-vs-new-api' },
    ],
    references: sub2apiOfficialReferences,
  },
  {
    slug: 'sub2api-authentication-structure',
    topic: 'Sub2API',
    title: 'Sub2API Authentication Structure',
    description: 'Learn how AuthAtlas separates Sub2API gateway account/configuration metadata from upstream credential material used for authentication.',
    directAnswer: 'The official Sub2API project is an AI API gateway platform that can manage upstream account types such as OAuth and API-key based access. AuthAtlas models the gateway account/configuration layer separately from the upstream token or key so conversion does not confuse wrapper metadata with the credential itself.',
    sections: [
      {
        heading: 'Gateway configuration versus credential',
        paragraphs: ['The gateway configuration and the upstream credential should not be treated as the same concept. A gateway can manage account metadata, routing context, provider settings, and authentication material at the same time.'],
        bullets: ['Gateway fields describe how the platform should use an account or provider.', 'OAuth or API-key values carry upstream authentication material.', 'Canonical normalization separates recognized credential material from source-wrapper metadata.'],
      },
      {
        heading: 'Why Canonical sits in the middle',
        paragraphs: ['Mapping Sub2API directly into every other gateway format creates many pairwise adapters. Normalizing recognized credentials first lets AuthAtlas reason about one intermediate model before applying a target-specific schema.'],
      },
      {
        heading: 'When a provider request is required',
        paragraphs: ['Schema mapping can stay local when the required secret is already present. A provider request is required when the target needs a newly issued credential, such as exchanging a refresh token for a new access token.'],
      },
    ],
    related: [
      { label: 'Sub2API credential fields', href: '/guides/sub2api-credential-fields' },
      { label: 'Canonical format', href: '/formats/canonical' },
      { label: 'Sub2API → Canonical', href: '/compare/sub2api-to-canonical' },
      { label: 'Refresh Token → Access Token', href: '/compare/refresh-token-to-access-token' },
    ],
    references: sub2apiOfficialReferences,
  },
  {
    slug: 'sub2api-credential-security',
    topic: 'Sub2API',
    title: 'Sub2API Credential Security',
    description: 'Security guidance for handling Sub2API gateway account/configuration data, upstream tokens, API keys, local conversion, and version-dependent imports.',
    directAnswer: 'Treat Sub2API account/configuration data as sensitive whenever it exposes live upstream credentials. Mask secrets in previews, verify the deployed schema before import, and keep compatible inspection or schema mapping local when possible.',
    sections: [
      {
        heading: 'Gateway configuration can contain secrets',
        paragraphs: ['Configuration data may look like ordinary JSON while still containing values that authorize upstream requests. The sensitivity comes from the contained credentials, not the file extension or gateway name.'],
        bullets: ['Do not paste live exports into untrusted sites.', 'Do not attach unmasked gateway data to public issues.', 'Rotate upstream credentials after suspected exposure.'],
      },
      {
        heading: 'Version verification is a security control',
        paragraphs: ['Importing fields into the wrong schema can place secrets in unintended locations or create broken configurations that operators later expose while debugging. Version-aware mappings reduce that risk.'],
      },
      {
        heading: 'Local mapping versus OAuth exchange',
        paragraphs: ['Field extraction and compatible schema mapping can run locally. OAuth exchange is different because it contacts a provider token endpoint and should be clearly separated from offline conversion.'],
      },
    ],
    related: [
      { label: 'AuthAtlas security model', href: '/security' },
      { label: 'Sub2API format overview', href: '/formats/sub2api' },
      { label: 'Sub2API → New API', href: '/compare/sub2api-to-new-api' },
      { label: 'Sub2API credential fields', href: '/guides/sub2api-credential-fields' },
    ],
    references: sub2apiOfficialReferences,
  },
  {
    slug: 'new-api-channel-authentication-fields',
    topic: 'New API',
    title: 'New API Channel Authentication Fields',
    description: 'Understand how AuthAtlas models authentication material in New API channels and why mappings are provider, channel-type, and version dependent.',
    directAnswer: 'Official New API documentation describes channels as the core configuration unit for connecting AI providers, commonly with provider-specific API keys and optional endpoint or routing settings. AuthAtlas inspects recognized authentication material from that channel context without assuming one universal schema for every provider or version.',
    sections: [
      {
        heading: 'Fields AuthAtlas may recognize',
        paragraphs: ['AuthAtlas extracts credential material only when a field is present and recognized. It does not assume every New API channel uses the same authentication model or exact field set.'],
        bullets: ['type — channel or adapter type when present', 'provider — upstream provider identity when present', 'key — provider or channel API-key material when present', 'access_token — OAuth or bearer material when present', 'refresh_token — OAuth refresh material when present', 'base_url — optional upstream endpoint metadata'],
      },
      {
        heading: 'Channel type changes the usable schema',
        paragraphs: ['New API supports many provider/channel types and advanced channel settings. A mapper therefore needs both credential detection and verified target-channel context instead of assuming one global set of required fields.'],
      },
      {
        heading: 'Illustrative channel credential shape',
        paragraphs: ['This AuthAtlas example is illustrative rather than a universal New API import schema.'],
        code: '{\n  "type": "example",\n  "provider": "example",\n  "key": "key_example_redacted"\n}',
      },
    ],
    related: [
      { label: 'New API format overview', href: '/formats/new-api' },
      { label: 'New API → Canonical', href: '/compare/new-api-to-canonical' },
      { label: 'New API → Sub2API', href: '/compare/new-api-to-sub2api' },
      { label: 'Sub2API vs New API', href: '/compare/sub2api-vs-new-api' },
    ],
    references: [
      ...newApiProjectReferences,
      { label: 'New API official channel management guide', url: 'https://docs.newapi.pro/en/docs/guide/feature-guide/admin/channel' },
      { label: 'New API management API authentication documentation', url: 'https://docs.newapi.pro/en/docs/api/management/auth' },
    ],
  },
  {
    slug: 'new-api-credential-structure',
    topic: 'New API',
    title: 'New API Credential Structure',
    description: 'Learn how AuthAtlas models New API channel configuration, provider metadata, upstream credentials, and Canonical normalization.',
    directAnswer: 'New API is an AI API gateway and usage-management system whose channels connect upstream providers. AuthAtlas models channel/routing metadata separately from recognized authentication material so Canonical normalization does not mistake provider configuration for a newly issued credential.',
    sections: [
      {
        heading: 'Channel metadata and authentication material',
        paragraphs: ['Official New API documentation treats a channel as the core configuration unit connecting a provider. During conversion, AuthAtlas separates routing/configuration context from any recognized secret material that may be used for upstream authentication.'],
        bullets: ['Channel metadata can include type, provider, endpoint, priority, weight, model mapping, or other routing settings.', 'Authentication material may include an API key or another provider-specific credential supported by the deployed channel type.', 'Canonical normalization preserves known credential material without pretending unknown fields are credentials.'],
      },
      {
        heading: 'Why schema mappings are versioned',
        paragraphs: ['Gateway projects evolve. Channel types, required fields, field names, validation rules, and advanced routing settings can change, so a mapping should declare which target behavior it was designed for.'],
      },
      {
        heading: 'Mapping to another gateway',
        paragraphs: ['The safest flow is source channel → Canonical → verified target schema. This separates extraction from target-specific field naming and makes unsupported fields easier to identify.'],
      },
    ],
    related: [
      { label: 'New API channel authentication fields', href: '/guides/new-api-channel-authentication-fields' },
      { label: 'Canonical format', href: '/formats/canonical' },
      { label: 'New API → Canonical', href: '/compare/new-api-to-canonical' },
      { label: 'New API → Sub2API', href: '/compare/new-api-to-sub2api' },
    ],
    references: [
      ...newApiProjectReferences,
      { label: 'New API official channel management guide', url: 'https://docs.newapi.pro/en/docs/guide/feature-guide/admin/channel' },
    ],
  },
  {
    slug: 'new-api-credential-security',
    topic: 'New API',
    title: 'New API Credential Security',
    description: 'Security guidance for New API channel configuration, provider keys, OAuth tokens, masked previews, local mapping, and schema verification.',
    directAnswer: 'Treat New API channel configuration as sensitive whenever it exposes live upstream provider credentials. Keep keys and tokens out of logs, validate mappings against the deployed channel behavior, and prefer local schema conversion when the required credential material is already present.',
    sections: [
      {
        heading: 'Channel configuration may authorize real upstream usage',
        paragraphs: ['A provider key or token contained in channel configuration can retain the same authority as the original credential. Moving it into another wrapper does not reduce its sensitivity.'],
        bullets: ['Mask provider keys and tokens by default.', 'Do not publish raw channel configuration in screenshots or issue reports.', 'Rotate upstream credentials after exposure.'],
      },
      {
        heading: 'Schema validation before import',
        paragraphs: ['A generated configuration should be reviewed against the target deployment before import. Unknown fields, changed channel types, and version differences should produce warnings rather than guessed values.'],
      },
      {
        heading: 'Separate local mapping from remote issuance',
        paragraphs: ['Local mapping reorganizes existing fields. OAuth exchange requests a provider to issue a new credential. Keeping those paths visibly separate helps users understand when data must leave the browser.'],
      },
    ],
    related: [
      { label: 'AuthAtlas security model', href: '/security' },
      { label: 'New API format overview', href: '/formats/new-api' },
      { label: 'New API → Sub2API', href: '/compare/new-api-to-sub2api' },
      { label: 'New API channel authentication fields', href: '/guides/new-api-channel-authentication-fields' },
    ],
    references: [
      ...newApiProjectReferences,
      { label: 'New API official channel management guide', url: 'https://docs.newapi.pro/en/docs/guide/feature-guide/admin/channel' },
      { label: 'New API compliance and acceptable use policy', url: 'https://docs.newapi.pro/en/docs/legal/acceptable-use' },
    ],
  },
]
