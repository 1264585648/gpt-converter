export type ConversionKind = 'Extract' | 'Schema Map' | 'OAuth Exchange' | 'Impossible' | 'Self'

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
}

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
    directAnswer: 'A Sub2API wrapper can be normalized into AuthAtlas Canonical Format locally when its upstream credential fields are recognized.',
    summary: 'The conversion extracts credential material already present in the wrapper and separates it from gateway-specific container fields.',
    requirements: ['A recognized Sub2API account or credential wrapper', 'The relevant source-version field names', 'Credential fields that actually exist in the source'],
    steps: ['Identify the Sub2API wrapper version and provider fields.', 'Extract recognized access-token, refresh-token, or API-key material.', 'Normalize the extracted material and source metadata into Canonical fields.'],
    limitations: ['Exact Sub2API field names may vary by deployment version.', 'Unknown wrapper fields may require a version-specific adapter.', 'Missing upstream secrets cannot be inferred.'],
    security: ['Treat exported wrappers as secrets when they contain live credentials.', 'Verify version-specific schema before import or export.', 'Avoid sending live wrappers to untrusted services.'],
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
    directAnswer: 'A New API channel configuration can be normalized into AuthAtlas Canonical Format locally when its upstream authentication fields are recognized.',
    summary: 'Normalization separates upstream credential material from channel-specific configuration so it can be inspected through one common model.',
    requirements: ['A recognized New API channel configuration', 'Provider and channel-type context where available', 'Credential fields already present in the source'],
    steps: ['Identify the channel type and provider.', 'Extract recognized key or OAuth fields.', 'Normalize credential material and retain source metadata for later mapping.'],
    limitations: ['Authentication fields vary by provider, channel type, and project version.', 'Unknown channel-specific fields require a version-aware adapter.', 'Normalization does not validate credentials against the upstream provider.'],
    security: ['Channel exports can contain live provider secrets.', 'Mask credentials in logs and issue reports.', 'Verify the deployed New API schema before re-import.'],
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
    directAnswer: 'Sub2API can be mapped to a New API configuration locally when both deployed versions support the same required upstream credential material.',
    summary: 'This is a schema mapping between gateway wrappers, not a credential issuance flow. Existing upstream secrets are renamed or reorganized only when the target schema has corresponding fields.',
    requirements: ['Known Sub2API source schema', 'Known New API target schema', 'Required upstream credentials present in the source', 'A verified field mapping for the deployed versions'],
    steps: ['Extract upstream credential material from the Sub2API wrapper.', 'Normalize it through the Canonical representation.', 'Map compatible Canonical fields into the verified New API channel schema.'],
    limitations: ['Gateway schemas are version-dependent.', 'Some source fields may have no target equivalent.', 'AuthAtlas must not invent keys, refresh tokens, or provider values that are absent.'],
    security: ['Keep gateway exports local when possible.', 'Mask all upstream secrets in previews.', 'Review the generated configuration before importing it into a gateway.'],
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
    directAnswer: 'New API can be mapped to a Sub2API wrapper locally when the source contains the credential material required by the verified Sub2API target schema.',
    summary: 'The operation translates compatible gateway configuration fields while preserving the same upstream secret material.',
    requirements: ['Known New API source schema', 'Known Sub2API target schema', 'Required upstream credential fields present', 'A version-specific target mapping'],
    steps: ['Read provider and credential fields from the New API channel.', 'Normalize recognized credential material into Canonical form.', 'Map those Canonical fields into the verified Sub2API account schema.'],
    limitations: ['Not every channel field has a Sub2API equivalent.', 'Version changes can alter field names and requirements.', 'Missing secrets cannot be reconstructed from metadata alone.'],
    security: ['Treat both source and output as sensitive when they carry live secrets.', 'Verify target-version compatibility before import.', 'Do not log raw gateway exports.'],
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
  },
  {
    type: 'comparison',
    slug: 'sub2api-vs-new-api',
    title: 'Sub2API vs New API',
    left: 'Sub2API',
    right: 'New API',
    leftFormatSlug: 'sub2api',
    rightFormatSlug: 'new-api',
    directAnswer: 'Sub2API and New API are treated by AuthAtlas as version-dependent gateway configuration wrappers that may carry similar upstream credential material but use different container schemas.',
    rows: [
      { aspect: 'Role', left: 'Gateway account or credential wrapper', right: 'Gateway provider or channel configuration' },
      { aspect: 'Credential material', left: 'May contain OAuth or API-key fields', right: 'May contain key, OAuth, provider, and channel fields' },
      { aspect: 'Schema stability', left: 'Version-dependent', right: 'Version and channel-type dependent' },
      { aspect: 'Mapping approach', left: 'Extract → Canonical → target schema', right: 'Extract → Canonical → target schema' },
      { aspect: 'Direct conversion', left: 'Possible when required target fields exist', right: 'Possible when required target fields exist' },
    ],
    guidance: ['Verify both deployed versions before importing mapped output.', 'Use Canonical as the intermediate representation.', 'Never fabricate missing upstream secrets during gateway-to-gateway mapping.'],
  },
]

export const comparePages = [...conversionPages, ...comparisonPages]
