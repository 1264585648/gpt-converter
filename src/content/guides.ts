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

export type Guide = {
  slug: string
  topic: 'Sub2API' | 'New API'
  title: string
  description: string
  directAnswer: string
  sections: GuideSection[]
  related: GuideLink[]
}

export const guides: Guide[] = [
  {
    slug: 'sub2api-credential-fields',
    topic: 'Sub2API',
    title: 'Sub2API Credential Fields',
    description: 'Understand the common credential fields AuthAtlas recognizes in Sub2API-style account wrappers and why exact field names must be verified against the deployed version.',
    directAnswer: 'A Sub2API account wrapper may carry provider metadata plus upstream access-token, refresh-token, API-key, or base-URL fields. The exact schema is version-dependent, so field mapping should be verified before import.',
    sections: [
      {
        heading: 'Common fields AuthAtlas looks for',
        paragraphs: ['AuthAtlas treats Sub2API as a gateway wrapper rather than a new secret type. The useful part of the wrapper is the upstream credential material already present inside it.'],
        bullets: ['provider — identifies the upstream provider when present', 'access_token — upstream bearer or OAuth access-token material', 'refresh_token — upstream OAuth refresh-token material', 'api_key — upstream provider API-key material', 'base_url — optional upstream endpoint metadata'],
      },
      {
        heading: 'Required fields depend on the adapter',
        paragraphs: ['A target mapping should declare which fields it requires instead of assuming every Sub2API deployment has one universal schema. Optional metadata should remain optional, and missing secrets must not be fabricated.'],
      },
      {
        heading: 'Safe normalization example',
        paragraphs: ['A wrapper can be normalized into Canonical format by extracting only recognized credential material and retaining source metadata.'],
        code: '{\n  "provider": "example",\n  "access_token": "token_example_redacted",\n  "refresh_token": "refresh_example_redacted"\n}',
      },
    ],
    related: [
      { label: 'Sub2API format overview', href: '/formats/sub2api' },
      { label: 'Sub2API → Canonical', href: '/compare/sub2api-to-canonical' },
      { label: 'Sub2API → New API', href: '/compare/sub2api-to-new-api' },
      { label: 'Sub2API vs New API', href: '/compare/sub2api-vs-new-api' },
    ],
  },
  {
    slug: 'sub2api-authentication-structure',
    topic: 'Sub2API',
    title: 'Sub2API Authentication Structure',
    description: 'Learn how AuthAtlas separates Sub2API gateway wrapper metadata from the upstream credential material used for authentication.',
    directAnswer: 'AuthAtlas models Sub2API as a container around upstream authentication material. The gateway wrapper describes provider or account configuration, while the contained token or API key remains the credential that authorizes upstream requests.',
    sections: [
      {
        heading: 'Wrapper versus credential',
        paragraphs: ['The wrapper and the upstream credential should not be treated as the same concept. A gateway configuration can contain provider names, endpoints, account metadata, and one or more secrets.'],
        bullets: ['Wrapper fields describe how the gateway should use an account.', 'OAuth or API-key fields carry the actual upstream authentication material.', 'Canonical normalization separates credential material from source-wrapper metadata.'],
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
  },
  {
    slug: 'sub2api-credential-security',
    topic: 'Sub2API',
    title: 'Sub2API Credential Security',
    description: 'Security guidance for handling Sub2API gateway exports, upstream tokens, API keys, local conversion, and version-dependent imports.',
    directAnswer: 'Treat a Sub2API wrapper as sensitive whenever it contains live upstream credentials. Mask secrets in previews, verify the deployed schema before import, and keep compatible conversion local when possible.',
    sections: [
      {
        heading: 'Gateway exports can be secrets',
        paragraphs: ['A configuration file may look like ordinary JSON while still containing values that authorize upstream requests. The sensitivity comes from the contained credentials, not the file extension or wrapper name.'],
        bullets: ['Do not paste live exports into untrusted sites.', 'Do not attach unmasked gateway exports to public issues.', 'Rotate upstream credentials after suspected exposure.'],
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
  },
  {
    slug: 'new-api-channel-authentication-fields',
    topic: 'New API',
    title: 'New API Channel Authentication Fields',
    description: 'Understand the common authentication fields AuthAtlas recognizes in New API channel configurations and why mappings are provider and version dependent.',
    directAnswer: 'A New API channel configuration may contain channel type, provider, key, OAuth token, refresh-token, or base-URL fields. Which fields are valid depends on the provider, channel type, and deployed project version.',
    sections: [
      {
        heading: 'Common fields AuthAtlas recognizes',
        paragraphs: ['AuthAtlas extracts credential material only when a field is present and recognized. It does not assume every channel uses the same authentication model.'],
        bullets: ['type — channel or adapter type', 'provider — upstream provider identity when present', 'key — provider or channel API-key material', 'access_token — upstream OAuth or bearer material', 'refresh_token — upstream OAuth refresh material', 'base_url — optional upstream endpoint metadata'],
      },
      {
        heading: 'Channel type changes the schema',
        paragraphs: ['Two New API channels can require different authentication fields even inside the same deployment. A mapper therefore needs both credential detection and target-channel context.'],
      },
      {
        heading: 'Example channel credential shape',
        paragraphs: ['This example is illustrative rather than a universal import schema.'],
        code: '{\n  "type": "example",\n  "provider": "example",\n  "key": "key_example_redacted"\n}',
      },
    ],
    related: [
      { label: 'New API format overview', href: '/formats/new-api' },
      { label: 'New API → Canonical', href: '/compare/new-api-to-canonical' },
      { label: 'New API → Sub2API', href: '/compare/new-api-to-sub2api' },
      { label: 'Sub2API vs New API', href: '/compare/sub2api-vs-new-api' },
    ],
  },
  {
    slug: 'new-api-credential-structure',
    topic: 'New API',
    title: 'New API Credential Structure',
    description: 'Learn how AuthAtlas models New API channel configuration, provider metadata, upstream credentials, and Canonical normalization.',
    directAnswer: 'AuthAtlas models New API as a channel configuration that combines routing metadata with upstream authentication material. Canonical normalization extracts recognized secrets while retaining source context for later schema mapping.',
    sections: [
      {
        heading: 'Channel metadata and authentication material',
        paragraphs: ['A New API channel can describe both where requests should go and how the upstream provider should be authenticated. Those concerns should remain distinguishable during conversion.'],
        bullets: ['Channel metadata can include type, provider, endpoint, or other routing fields.', 'Authentication material can include an API key, access token, refresh token, or provider-specific secret.', 'Canonical normalization preserves known credential material without pretending unknown fields are credentials.'],
      },
      {
        heading: 'Why schema mappings are versioned',
        paragraphs: ['Gateway projects evolve. Channel types, required fields, field names, and validation rules can change, so a static mapping should declare which target schema it was designed for.'],
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
  },
  {
    slug: 'new-api-credential-security',
    topic: 'New API',
    title: 'New API Credential Security',
    description: 'Security guidance for New API channel exports, provider keys, OAuth tokens, masked previews, local mapping, and schema verification.',
    directAnswer: 'Treat New API channel exports as secrets whenever they contain live provider credentials. Keep raw keys and tokens out of logs, validate mappings against the deployed version, and prefer local schema conversion for compatible fields.',
    sections: [
      {
        heading: 'Channel exports may authorize real upstream usage',
        paragraphs: ['Provider keys and tokens embedded in channel configuration can have the same impact as the original credential. Exporting them into another wrapper does not reduce their sensitivity.'],
        bullets: ['Mask provider keys and tokens by default.', 'Do not publish raw channel exports in screenshots or issue reports.', 'Rotate upstream credentials after exposure.'],
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
  },
]
