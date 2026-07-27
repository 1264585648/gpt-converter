# AuthAtlas

AuthAtlas is a local-first AI authentication format explorer, credential inspector, and schema converter.

It is designed to help developers understand the difference between OAuth access tokens, refresh tokens, API keys, and gateway-specific credential wrappers such as Sub2API and New API configurations.

## What is included

- Dark developer-tool landing page
- Browser-only credential detection
- Masked secret preview by default
- Canonical credential normalization
- Sub2API / New API adapter templates
- Compatibility matrix explaining extract / wrap / exchange / impossible paths
- Responsive UI for desktop and mobile

## Security model

AuthAtlas is designed as a static application. Credential parsing, masking, and normalization run in browser memory. The current implementation does not require a backend conversion endpoint.

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

## Roadmap

- Versioned schema adapters
- JWT payload inspector
- Shareable format documentation pages
- Import/export validation with Zod
- Offline/PWA mode
- Automated adapter fixtures and compatibility tests

## Repository

https://github.com/1264585648/gpt-converter
