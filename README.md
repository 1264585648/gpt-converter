# AuthAtlas

AuthAtlas is a local-first AI authentication format explorer, credential inspector, and schema converter.

It helps developers understand OAuth access tokens, refresh tokens, API keys, and gateway-specific wrappers such as Sub2API and New API configurations, while keeping credential inspection and schema mapping in the browser.

## UI reference

The current frontend is being implemented against four high-fidelity reference screens stored directly in the repository.

### Home

![AuthAtlas home reference](public/mockups/home.jpg)

### Converter

![AuthAtlas converter reference](public/mockups/converter.jpg)

### Formats

![AuthAtlas formats reference](public/mockups/formats.jpg)

### Compatibility Matrix

![AuthAtlas compatibility matrix reference](public/mockups/compare.jpg)

## Routes

The static app uses hash routes so it deploys cleanly on Cloudflare Pages without rewrite rules.

- `#/` — landing page and credential inspector
- `#/converter` — credential conversion workspace
- `#/formats` — authentication format knowledge base
- `#/compare` — compatibility matrix
- `#/security` — local-first security model

## What is included

- High-fidelity dark developer-tool interface
- Browser-only credential detection
- Masked secret preview by default
- Canonical credential normalization
- Sub2API / New API adapter templates
- Compatibility matrix for extract / schema-map / OAuth-exchange / impossible paths
- Responsive desktop and mobile layouts
- GitHub Actions build verification

## Security model

AuthAtlas is designed as a static application. Credential parsing, masking, comparison, and normalization run in browser memory. The current implementation does not require a backend conversion endpoint.

Do not paste credentials into untrusted deployments. Gateway adapter templates should be verified against the exact version of the target project before import.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The generated `dist/` directory can be deployed directly to Cloudflare Pages.

### Cloudflare Pages settings

- Build command: `npm run build`
- Build output directory: `dist`

## Design assets

Reference images live under:

```text
public/mockups/
├── home.jpg
├── converter.jpg
├── formats.jpg
└── compare.jpg
```

The implementation specification lives in `docs/UI_DESIGN_SPEC.md`.

## Roadmap

- Versioned schema adapters
- JWT payload inspector
- Per-format shareable documentation pages
- Import/export validation
- Offline/PWA mode
- Visual regression snapshots against the reference screens

## Repository

https://github.com/1264585648/gpt-converter
