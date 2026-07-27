export type FormatSlug =
  | 'access-token'
  | 'refresh-token'
  | 'api-key'
  | 'sub2api'
  | 'new-api'
  | 'canonical'

export type FormatReference = {
  label: string
  url: string
}

export type FormatFaq = {
  question: string
  answer: string
}

export type CredentialFormat = {
  slug: FormatSlug
  title: string
  shortDescription: string
  definition: string
  sensitivity: string
  lifetime: string
  usedFor: string
  transport: string
  revocable: string
  rotation: string
  storage: string
  fields: string[]
  example: string
  conversions: string
  security: string[]
  faq: FormatFaq[]
  references: FormatReference[]
}

export const credentialFormats: CredentialFormat[] = [
  {
    slug: 'access-token',
    title: 'Access Token',
    shortDescription: 'Short-lived credential used to access protected resources.',
    definition: 'An access token is a credential presented to an API or resource server to authorize requests on behalf of a user or application.',
    sensitivity: 'Sensitive',
    lifetime: 'Minutes to hours',
    usedFor: 'Authenticated API requests',
    transport: 'Usually an Authorization: Bearer header',
    revocable: 'Provider-dependent',
    rotation: 'Refresh or re-authenticate',
    storage: 'Memory or secure storage',
    fields: ['access_token', 'token_type', 'expires_in', 'scope'],
    example: '{\n  "access_token": "token_example_redacted",\n  "token_type": "Bearer",\n  "expires_in": 3600\n}',
    conversions: 'Access-token material can be represented in AuthAtlas Canonical format and mapped into compatible gateway wrappers when the target accepts the same credential material.',
    security: ['Keep access tokens out of logs and URLs.', 'Prefer short lifetimes and minimum scopes.', 'Revoke or refresh after suspected exposure.'],
    faq: [
      { question: 'Is an access token the same as a refresh token?', answer: 'No. An access token authorizes resource requests, while a refresh token is used with an authorization server to obtain new access tokens.' },
      { question: 'Can an access token be converted into a refresh token?', answer: 'No. A refresh token must be issued by an authorization server; it cannot be derived locally from an access token.' },
    ],
    references: [{ label: 'OAuth 2.0 Authorization Framework — RFC 6749', url: 'https://www.rfc-editor.org/rfc/rfc6749' }],
  },
  {
    slug: 'refresh-token',
    title: 'Refresh Token',
    shortDescription: 'Long-lived OAuth credential used to obtain new access tokens.',
    definition: 'A refresh token is a long-lived OAuth credential issued by an authorization server and used to obtain new access tokens without requiring the user to sign in again.',
    sensitivity: 'Highly sensitive',
    lifetime: 'Days to months',
    usedFor: 'Obtaining new access tokens',
    transport: 'OAuth token endpoint',
    revocable: 'Yes',
    rotation: 'Recommended',
    storage: 'Secure server-side storage',
    fields: ['refresh_token', 'token_type', 'expires_in?', 'scope?', 'issued_at?'],
    example: '{\n  "refresh_token": "refresh_example_redacted",\n  "token_type": "Bearer",\n  "scope": "openid profile"\n}',
    conversions: 'A refresh token can be normalized into Canonical format locally. Refresh Token → Access Token requires a provider OAuth exchange and is not a local transformation.',
    security: ['Store refresh tokens securely and avoid exposing them to browser code when possible.', 'Use refresh-token rotation where the provider supports it.', 'Revoke immediately after suspected exposure.'],
    faq: [
      { question: 'Can a refresh token become an access token locally?', answer: 'No. The refresh token must be exchanged with the provider authorization server, which issues a new access token.' },
      { question: 'Why is a refresh token highly sensitive?', answer: 'Because it can often be used to obtain new access tokens for a longer period than a single access token remains valid.' },
    ],
    references: [{ label: 'OAuth 2.0 Authorization Framework — RFC 6749', url: 'https://www.rfc-editor.org/rfc/rfc6749' }],
  },
  {
    slug: 'api-key',
    title: 'API Key',
    shortDescription: 'Provider-issued secret used to identify and authorize API clients.',
    definition: 'An API key is a provider-issued secret used by an application to authenticate API requests, commonly representing an application, project, or account rather than a delegated user session.',
    sensitivity: 'Highly sensitive',
    lifetime: 'Until rotated or revoked',
    usedFor: 'Direct API authentication',
    transport: 'Provider-specific header or request field',
    revocable: 'Yes',
    rotation: 'Recommended',
    storage: 'Secret manager or secure server-side storage',
    fields: ['api_key', 'provider?', 'base_url?'],
    example: '{\n  "provider": "example",\n  "api_key": "key_example_redacted"\n}',
    conversions: 'API-key material can be normalized into Canonical format and mapped into compatible gateway wrappers. An API key cannot be converted into an OAuth refresh token.',
    security: ['Never embed production API keys in public frontend bundles.', 'Use scoped keys when the provider offers them.', 'Rotate exposed keys instead of attempting to hide leaked values.'],
    faq: [
      { question: 'Is an API key an OAuth token?', answer: 'No. API keys and OAuth tokens are different authentication mechanisms with different issuance, scope, and lifecycle models.' },
      { question: 'Can an API key be mapped into a gateway configuration?', answer: 'Yes, when the gateway target has a field for the same upstream API-key material. This is schema mapping, not generation of a new secret.' },
    ],
    references: [],
  },
  {
    slug: 'sub2api',
    title: 'Sub2API',
    shortDescription: 'Gateway-side account wrapper for upstream credentials.',
    definition: 'A Sub2API credential configuration is a gateway-oriented account or configuration wrapper that may contain upstream OAuth or API-key material. Exact fields depend on the deployed Sub2API version and provider.',
    sensitivity: 'Depends on contents',
    lifetime: 'Mirrors upstream credential',
    usedFor: 'Gateway account configuration',
    transport: 'Admin or account configuration',
    revocable: 'Via upstream credential',
    rotation: 'Version and provider dependent',
    storage: 'Gateway secure storage',
    fields: ['provider', 'access_token?', 'refresh_token?', 'api_key?', 'base_url?'],
    example: '{\n  "provider": "example",\n  "access_token": "token_example_redacted",\n  "refresh_token": "refresh_example_redacted"\n}',
    conversions: 'Compatible credential material can be extracted into Canonical format locally or schema-mapped into another gateway format after verifying the exact source and target versions.',
    security: ['Treat wrappers as secrets when they contain upstream credentials.', 'Verify version-specific schema before import.', 'Do not send live credential wrappers to untrusted conversion services.'],
    faq: [
      { question: 'Is Sub2API itself a new credential type?', answer: 'Not necessarily. It is treated here as a gateway wrapper that can carry upstream credential material in a version-dependent schema.' },
      { question: 'Can Sub2API be converted to New API?', answer: 'Potentially through schema mapping when both formats can represent the required upstream credential fields. Exact mappings must be verified against deployed versions.' },
    ],
    references: [],
  },
  {
    slug: 'new-api',
    title: 'New API',
    shortDescription: 'Provider or channel configuration for a unified model gateway.',
    definition: 'A New API credential configuration is a unified model-gateway channel configuration whose authentication fields vary by provider, channel type, and project version.',
    sensitivity: 'Depends on contents',
    lifetime: 'Mirrors upstream credential',
    usedFor: 'Provider or channel configuration',
    transport: 'Gateway admin configuration',
    revocable: 'Via upstream credential',
    rotation: 'Provider-dependent',
    storage: 'Gateway secure storage',
    fields: ['type', 'provider', 'key?', 'access_token?', 'refresh_token?', 'base_url?'],
    example: '{\n  "type": "example",\n  "provider": "example",\n  "key": "key_example_redacted"\n}',
    conversions: 'Compatible credential material can be extracted into Canonical format or schema-mapped to another gateway format after checking the exact target version.',
    security: ['Channel exports may contain live provider secrets.', 'Validate schema against the deployed project version.', 'Mask secrets in screenshots, logs, and issue reports.'],
    faq: [
      { question: 'Does every New API channel use the same credential fields?', answer: 'No. Authentication fields can vary by provider, channel type, and project version, so mappings should be treated as versioned adapters.' },
      { question: 'Can New API be converted to Sub2API?', answer: 'Potentially through schema mapping when the required upstream credential material exists in the source and the target schema supports it.' },
    ],
    references: [],
  },
  {
    slug: 'canonical',
    title: 'Canonical Format',
    shortDescription: 'Normalized provider-agnostic representation used by AuthAtlas.',
    definition: 'AuthAtlas Canonical Format is a provider-agnostic intermediate representation that separates credential material from source-format metadata so adapters can map through one normalized model.',
    sensitivity: 'Depends on contents',
    lifetime: 'Mirrors source credential',
    usedFor: 'Inspection and schema mapping',
    transport: 'Local JSON representation',
    revocable: 'Depends on source',
    rotation: 'Depends on source',
    storage: 'Local memory or secure export',
    fields: ['provider', 'credential_type', 'auth', 'source'],
    example: '{\n  "provider": "example",\n  "credential_type": "oauth",\n  "auth": {\n    "access_token": "token_example_redacted"\n  }\n}',
    conversions: 'Canonical Format is the local intermediate representation for mapping into supported target schemas without fabricating credential material that is absent from the source.',
    security: ['Canonical representation does not make secrets less sensitive.', 'Keep exports masked unless raw secret material is explicitly needed.', 'Never infer or generate credentials that are absent from the source.'],
    faq: [
      { question: 'Does Canonical Format create new credentials?', answer: 'No. It normalizes credential material that already exists in the source and must not fabricate missing secrets.' },
      { question: 'Why normalize through a canonical representation?', answer: 'A canonical model reduces pairwise adapter complexity and gives inspection, validation, and target mappings a consistent intermediate structure.' },
    ],
    references: [],
  },
]

export function getCredentialFormat(slug: string) {
  return credentialFormats.find((format) => format.slug === slug)
}
