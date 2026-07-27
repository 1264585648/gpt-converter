export type ConversionKind = 'Extract' | 'Schema Map' | 'OAuth Exchange' | 'Impossible' | 'Self'

export type CompareReference = {
  label: string
  url: string
}

export type ConversionPage = {
  type: 'conversion'
  slug: string
  title: string
  source: string
  target: string
  sourceFormatSlug?: string
  targetFormatSlug?: string
  kind: ConversionKind
  local: boolean
  directAnswer: string
  summary: string
  requirements: string[]
  steps: string[]
  limitations: string[]
  security: string[]
  references?: CompareReference[]
}

export type ComparisonRow = {
  aspect: string
  left: string
  right: string
}

export type ComparisonPage = {
  type: 'comparison'
  slug: string
  title: string
  left: string
  right: string
  leftFormatSlug?: string
  rightFormatSlug?: string
  directAnswer: string
  rows: ComparisonRow[]
  guidance: string[]
  references?: CompareReference[]
}

const oauthReferences: CompareReference[] = [
  { label: 'OAuth 2.0 Authorization Framework — RFC 6749', url: 'https://www.rfc-editor.org/rfc/rfc6749' },
]

const sub2apiReferences: CompareReference[] = [
  { label: 'Sub2API official GitHub repository — Wei-Shaw/sub2api', url: 'https://github.com/Wei-Shaw/sub2api' },
]

const newApiReferences: CompareReference[] = [
  { label: 'New API official GitHub repository — QuantumNous/new-api', url: 'https://github.com/QuantumNous/new-api' },
  { label: 'New API official project introduction', url: 'https://docs.newapi.pro/en/docs/guide/wiki/basic-concepts/project-introduction' },
  { label: 'New API official channel management guide', url: 'https://docs.newapi.pro/en/docs/guide/feature-guide/admin/channel' },
]

export const conversionPages: ConversionPage[] = [
  {
    type: 'conversion',
    slug: 'refresh-token-to-access-token',
    title: 'Refresh Token to Access Token',
    source: 'Refresh Token',
    target: 'Access Token',
    sourceFormatSlug: 'refresh-token',
    targetFormatSlug: 'access-token',
    kind: 'OAuth Exchange',
    local: false,
    directAnswer: 'A refresh token cannot be transformed into an access token locally. It must be exchanged with the provider authorization server, which issues a new access token.',
    summary: 'The refresh token is an input to an OAuth token endpoint. The resulting access token is newly issued by the authorization server rather than derived by changing the refresh-token string.',
    requirements: ['A valid refresh token', 'The provider token endpoint', 'Any client authentication required by the provider', 'An explicit network request to the authorization server'],
    steps: ['Send the refresh token to the provider token endpoint using the provider-required grant flow.', 'Authenticate the client when the provider requires client credentials or another client-auth method.', 'Receive and validate the newly issued access token and any rotated refresh token returned by the provider.'],
    limitations: ['The exchange cannot be completed offline.', 'Provider-specific scopes, client rules, token rotation, and expiry policies still apply.', 'AuthAtlas should not simulate issuance or fabricate an access token.'],
    security: ['Treat refresh tokens as highly sensitive.', 'Do not expose client secrets in public frontend code.', 'Store newly issued credentials according to provider guidance.'],
    references: oauthReferences,
  },
  {
    type: 'conversion',
    slug: 'access-token-to-canonical',
    title: 'Access Token to Canonical Format',
    source: 'Access Token',
    target: 'Canonical Format',
    sourceFormatSlug: 'access-token',
    targetFormatSlug: 'canonical',
    kind: 'Extract',
    local: true,
    directAnswer: 'An access token can be represented in AuthAtlas Canonical Format locally when the source already contains the credential material and any available metadata.',
    summary: 'Canonical normalization preserves the existing access token and places it into a provider-agnostic structure for inspection and later schema mapping.',
    requirements: ['Recognized access-token material', 'Any available provider or token-type metadata', 'No provider network request'],
    steps: ['Detect the access token and available metadata.', 'Place the existing token material into the Canonical auth structure.', 'Preserve source metadata without inventing refresh tokens or other missing fields.'],
    limitations: ['Normalization does not extend token lifetime.', 'Missing provider metadata may remain unknown.', 'Canonical representation does not change the security sensitivity of the token.'],
    security: ['Mask exported token values by default.', 'Keep access tokens out of logs and URLs.', 'Revoke exposed tokens according to provider controls.'],
    references: oauthReferences,
  },
  {
    type: 'conversion',
    slug: 'refresh-token-to-canonical',
    title: 'Refresh Token to Canonical Format',
    source: 'Refresh Token',
    target: 'Canonical Format',
    sourceFormatSlug: 'refresh-token',
    targetFormatSlug: 'canonical',
    kind: 'Extract',
    local: true,
    directAnswer: 'A refresh token can be normalized into AuthAtlas Canonical Format locally because normalization preserves existing credential material instead of issuing a new token.',
    summary: 'The refresh token is stored in the Canonical auth structure together with source metadata that is already present.',
    requirements: ['Recognized refresh-token material', 'Optional provider, scope, or issue metadata when available', 'No OAuth exchange for normalization itself'],
    steps: ['Detect the refresh token and related fields.', 'Normalize those values into Canonical fields.', 'Keep absent access-token or provider fields absent rather than generating them.'],
    limitations: ['Canonical normalization does not validate the token with the provider.', 'It does not produce an access token.', 'Token expiry and rotation behavior remain provider-dependent.'],
    security: ['Treat Canonical output containing a refresh token as highly sensitive.', 'Avoid storing live refresh tokens in browser persistence.', 'Mask credentials in screenshots and logs.'],
    references: oauthReferences,
  },
  {
    type: 'conversion',
    slug: 'api-key-to-canonical',
    title: 'API Key to Canonical Format',
    source: 'API Key',
    target: 'Canonical Format',
    sourceFormatSlug: 'api-key',
    targetFormatSlug: 'canonical',
    kind: 'Extract',
    local: true,
    directAnswer: 'An API key can be normalized into AuthAtlas Canonical Format locally by preserving the existing key and any provider metadata already present.',
    summary: 'Canonical normalization gives API-key credentials a consistent intermediate structure for inspection and gateway mapping.',
    requirements: ['An API key or recognized API-key configuration', 'Optional provider or base URL metadata', 'No provider network request'],
    steps: ['Detect the API-key field.', 'Preserve the key in the Canonical auth structure.', 'Attach only metadata that exists in the source.'],
    limitations: ['Normalization does not validate whether the key is active.', 'It cannot create OAuth refresh tokens or delegated user context.', 'Provider-specific restrictions remain unchanged.'],
    security: ['Do not expose production API keys in public frontend bundles.', 'Mask raw values in previews and exports.', 'Rotate keys after suspected exposure.'],
  },
  {
    type: 'conversion',
    slug: 'sub2api-to-canonical',
    title: 'Sub2API to Canonical Format',
    source: 'Sub2API',
    target: 'Canonical Format',
    sourceFormatSlug: 'sub2api',
    targetFormatSlug: 'canonical',
    kind: 'Extract',
    local: true,
    directAnswer: 'AuthAtlas can normalize recognized upstream credential material from Sub2API account/configuration data into Canonical Format locally when the deployed source structure is understood.',
    summary: 'Sub2API itself is an AI API gateway platform, not a universal credential schema. AuthAtlas models recognized gateway account/configuration data and extracts credential material already present without treating every Sub2API field as a credential.',
    requirements: ['A known or recognized Sub2API source structure', 'The relevant source-version field names', 'Credential material that actually exists in the source'],
    steps: ['Identify the deployed Sub2API structure and provider/account context.', 'Extract only recognized access-token, refresh-token, or API-key material that is present.', 'Normalize the extracted material and source metadata into Canonical fields.'],
    limitations: ['Sub2API can evolve and deployed structures may differ.', 'AuthAtlas examples are not a universal Sub2API import/export specification.', 'Unknown fields may require a version-specific adapter.', 'Missing upstream secrets cannot be inferred.'],
    security: ['Treat gateway configuration as sensitive when it contains live credentials.', 'Verify version-specific structure before import or export.', 'Avoid sending live gateway data to untrusted services.'],
    references: sub2apiReferences,
  },
  {
    type: 'conversion',
    slug: 'new-api-to-canonical',
    title: 'New API to Canonical Format',
    source: 'New API',
    target: 'Canonical Format',
    sourceFormatSlug: 'new-api',
    targetFormatSlug: 'canonical',
    kind: 'Extract',
    local: true,
    directAnswer: 'AuthAtlas can normalize recognized authentication material from a New API channel configuration into Canonical Format locally when the deployed channel behavior and fields are understood.',
    summary: 'Official New API documentation describes channels as the core configuration unit for connecting AI providers. AuthAtlas separates recognized credential material from channel/routing context so it can be inspected through one intermediate model.',
    requirements: ['A recognized New API channel configuration', 'Provider and channel-type context where available', 'Credential material already present in the source'],
    steps: ['Identify the deployed channel type and provider.', 'Extract recognized authentication material that is actually present.', 'Normalize credential material and retain source metadata for later mapping.'],
    limitations: ['Channel behavior and fields vary by provider, channel type, and project version.', 'AuthAtlas examples are not a universal New API channel import schema.', 'Unknown channel-specific fields require a version-aware adapter.', 'Normalization does not validate credentials against the upstream provider.'],
    security: ['Channel configuration can expose live provider secrets.', 'Mask credentials in logs and issue reports.', 'Verify the deployed New API behavior before re-import.'],
    references: newApiReferences,
  },
  {
    type: 'conversion',
    slug: 'sub2api-to-new-api',
    title: 'Sub2API to New API',
    source: 'Sub2API',
    target: 'New API',
    sourceFormatSlug: 'sub2api',
    targetFormatSlug: 'new-api',
    kind: 'Schema Map',
    local: true,
    directAnswer: 'AuthAtlas can schema-map recognized Sub2API account/configuration data into a New API channel representation only when a verified source/target adapter exists and the required upstream credential material is already present.',
    summary: 'This is an AuthAtlas schema-mapping workflow between two different AI gateway projects, not an official universal conversion protocol provided by Sub2API or New API. Existing upstream secrets are reorganized only when the verified target representation has corresponding fields.',
    requirements: ['Known Sub2API source structure', 'Known New API target channel behavior', 'Required upstream credentials present in the source', 'A verified adapter for the deployed versions'],
    steps: ['Read recognized upstream credential material from the Sub2API account/configuration data.', 'Normalize it through the AuthAtlas Canonical representation.', 'Map only compatible Canonical fields into the verified New API channel representation.'],
    limitations: ['Neither upstream project defines a universal Sub2API ↔ New API conversion contract.', 'Gateway behavior and schemas are version-dependent.', 'Some source fields may have no target equivalent.', 'AuthAtlas must not invent keys, refresh tokens, provider values, or routing settings that are absent.'],
    security: ['Keep gateway configuration local when possible.', 'Mask all upstream secrets in previews.', 'Review generated configuration against the actual target deployment before import.'],
    references: [...sub2apiReferences, ...newApiReferences],
  },
  {
    type: 'conversion',
    slug: 'new-api-to-sub2api',
    title: 'New API to Sub2API',
    source: 'New API',
    target: 'Sub2API',
    sourceFormatSlug: 'new-api',
    targetFormatSlug: 'sub2api',
    kind: 'Schema Map',
    local: true,
    directAnswer: 'AuthAtlas can schema-map recognized New API channel data into a Sub2API representation only when a verified adapter exists and the source contains the upstream credential material required by the target deployment.',
    summary: 'This is an AuthAtlas schema-mapping workflow, not an official universal conversion protocol between the upstream projects. It preserves existing secret material while translating only verified configuration fields.',
    requirements: ['Known New API source channel behavior', 'Known Sub2API target structure', 'Required upstream credential material present', 'A verified version-specific adapter'],
    steps: ['Read provider/channel context and recognized credential material from New API.', 'Normalize recognized credential material into Canonical form.', 'Map only verified Canonical fields into the target Sub2API representation.'],
    limitations: ['Neither upstream project defines a universal New API ↔ Sub2API conversion contract.', 'Not every channel or routing field has a target equivalent.', 'Version changes can alter requirements.', 'Missing secrets cannot be reconstructed from metadata alone.'],
    security: ['Treat both source and output as sensitive when they carry live secrets.', 'Verify target-version compatibility before import.', 'Do not log raw gateway exports or channel configuration.'],
    references: [...newApiReferences, ...sub2apiReferences],
  },
]

export const comparisonPages: ComparisonPage[] = [
  {
    type: 'comparison',
    slug: 'access-token-vs-refresh-token',
    title: 'Access Token vs Refresh Token',
    left: 'Access Token',
    right: 'Refresh Token',
    leftFormatSlug: 'access-token',
    rightFormatSlug: 'refresh-token',
    directAnswer: 'An access token authorizes requests to protected resources, while a refresh token is used with an authorization server to obtain new access tokens.',
    rows: [
      { aspect: 'Primary purpose', left: 'Authorize API or resource requests', right: 'Obtain new access tokens' },
      { aspect: 'Typical lifetime', left: 'Short-lived', right: 'Longer-lived' },
      { aspect: 'Sent to', left: 'Resource server or API', right: 'Authorization server token endpoint' },
      { aspect: 'Exposure impact', left: 'Can authorize requests until expiry or revocation', right: 'Can often mint new access tokens until expiry or revocation' },
      { aspect: 'Local conversion', left: 'Cannot become a refresh token locally', right: 'Requires OAuth exchange to obtain an access token' },
    ],
    guidance: ['Use access tokens for resource requests.', 'Protect refresh tokens with stronger storage controls.', 'Do not treat the two token types as interchangeable strings.'],
    references: oauthReferences,
  },
  {
    type: 'comparison',
    slug: 'oauth-vs-api-key',
    title: 'OAuth vs API Key',
    left: 'OAuth',
    right: 'API Key',
    rightFormatSlug: 'api-key',
    directAnswer: 'OAuth is an authorization framework that can issue scoped access and refresh tokens, while an API key is typically a provider-issued secret identifying an application, project, or account.',
    rows: [
      { aspect: 'Credential model', left: 'Token-based authorization flow', right: 'Provider-issued static or rotatable secret' },
      { aspect: 'Delegated user access', left: 'Commonly supported', right: 'Usually not represented directly' },
      { aspect: 'Expiry', left: 'Access tokens are commonly time-limited', right: 'Often valid until rotated or revoked' },
      { aspect: 'Scopes', left: 'Often explicit in the authorization flow', right: 'Provider-specific' },
      { aspect: 'Conversion', left: 'OAuth credentials cannot be derived from an API key', right: 'An API key cannot be turned into a refresh token locally' },
    ],
    guidance: ['Use the authentication mechanism required by the provider.', 'Do not convert between models by renaming fields.', 'Preserve provider-specific scope, rotation, and storage rules.'],
    references: oauthReferences,
  },
  {
    type: 'comparison',
    slug: 'sub2api-vs-new-api',
    title: 'Sub2API vs New API',
    left: 'Sub2API',
    right: 'New API',
    leftFormatSlug: 'sub2api',
    rightFormatSlug: 'new-api',
    directAnswer: 'Sub2API and New API are separate AI API gateway projects. AuthAtlas compares the account/configuration and channel data that can expose upstream authentication material, but there is no upstream-defined universal credential schema or conversion contract shared by the two projects.',
    rows: [
      { aspect: 'Official project role', left: 'AI API gateway platform for subscription quota distribution and management', right: 'AI API gateway and usage-management system with provider channels' },
      { aspect: 'AuthAtlas modeling scope', left: 'Recognized account/configuration data plus upstream credential material', right: 'Recognized channel/configuration data plus upstream credential material' },
      { aspect: 'Configuration stability', left: 'Deployment and version dependent', right: 'Provider, channel-type, deployment, and version dependent' },
      { aspect: 'AuthAtlas mapping approach', left: 'Recognized source → Canonical → verified target adapter', right: 'Recognized source → Canonical → verified target adapter' },
      { aspect: 'Gateway-to-gateway mapping', left: 'Conditional; requires a verified adapter and compatible fields', right: 'Conditional; requires a verified adapter and compatible fields' },
    ],
    guidance: ['Verify both deployed projects and versions before importing mapped output.', 'Treat Canonical as an AuthAtlas intermediate representation, not an upstream standard.', 'Never fabricate missing upstream secrets or routing settings during gateway-to-gateway mapping.'],
    references: [...sub2apiReferences, ...newApiReferences],
  },
]

export const comparePages = [...conversionPages, ...comparisonPages]
