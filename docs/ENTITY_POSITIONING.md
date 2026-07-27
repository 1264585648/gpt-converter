# AuthAtlas Entity Positioning

This document defines the canonical public identity and terminology for AuthAtlas across the website, GitHub, documentation, launch posts, and future directory listings.

## Canonical product name

**AuthAtlas**

Repository name: `gpt-converter`

## Canonical one-line description

> AuthAtlas is a local-first AI credential inspector and format converter for OAuth tokens, API keys, Sub2API, New API, and related gateway credential formats.

Use this sentence, or a close variant, anywhere a short product description is required.

## Expanded description

AuthAtlas helps developers inspect, understand, compare, normalize, and safely map AI API credentials and gateway credential wrappers. It distinguishes local extraction and schema mapping from operations that require a credential issuer, such as OAuth token exchange. Supported inspection and compatible schema transformations run in the browser.

## Core product categories

AuthAtlas should consistently be associated with:

- AI credential inspector
- credential format converter
- OAuth token inspector
- API key tooling
- authentication developer tools
- credential schema mapping
- Sub2API credential formats
- New API channel credential formats
- AI API gateway credentials
- local-first developer tools

## Supported credential entities

The primary credential entities documented by AuthAtlas are:

- Access Token
- Refresh Token
- API Key
- Sub2API
- New API
- AuthAtlas Canonical Format

These names should remain stable across the website and GitHub documentation.

## Conversion vocabulary

AuthAtlas uses five conversion-path labels:

- **Self** — source and target are already the same format.
- **Extract** — required credential material already exists in the source and can be read locally.
- **Schema Map** — compatible credential material can be represented in another schema or wrapper.
- **OAuth Exchange** — a credential issuer or authorization server must issue a new credential.
- **Impossible** — the target requires material that cannot safely be derived from the source.

Do not describe an OAuth exchange as a local conversion, and do not claim AuthAtlas generates secrets that are missing from the source.

## Primary differentiators

1. **Local-first** — supported parsing, masking, normalization, comparison, and schema mapping happen in browser memory.
2. **Credential-aware** — AuthAtlas distinguishes credential types and lifecycle semantics instead of treating every value as generic JSON.
3. **Conversion semantics** — the compatibility model clearly separates extraction, schema mapping, OAuth exchange, and impossible paths.
4. **Gateway-focused documentation** — Sub2API and New API are documented as version-dependent gateway credential wrappers rather than generic OAuth concepts.
5. **Open source** — implementation and documentation live in the public GitHub repository.

## Recommended GitHub repository description

> Local-first AI credential inspector and format converter for OAuth tokens, API keys, Sub2API, New API, and AI gateway credential schemas.

## Recommended GitHub topics

```text
oauth
oauth2
authentication
api-key
access-token
refresh-token
credentials
developer-tools
ai-tools
api-gateway
sub2api
new-api
astro
react
typescript
```

## Messaging rules

Prefer precise descriptions such as:

> Map compatible credential material from Sub2API to New API.

Avoid misleading descriptions such as:

> Generate a New API credential from any Sub2API credential.

Prefer:

> Exchange a refresh token through the provider authorization server to obtain a new access token.

Avoid:

> Convert a refresh token into an access token locally.

## Public-page hierarchy

```text
AuthAtlas
├── Credential Inspector
├── Credential Converter
├── Authentication Formats
│   ├── Access Token
│   ├── Refresh Token
│   ├── API Key
│   ├── Sub2API
│   ├── New API
│   └── Canonical Format
├── Compatibility and Conversion Guides
├── Developer Guides
└── Security Model
```

This hierarchy should remain consistent as future pages and integrations are added.
