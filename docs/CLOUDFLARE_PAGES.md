# Cloudflare Pages Deployment

AuthAtlas is a static React + Vite application. No server runtime is required for the current local-first credential inspection and schema-mapping features.

## Recommended Pages settings

- Production branch: `main`
- Framework preset: React (Vite)
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Node.js: `22.16.0` (pinned by `.node-version`)

Cloudflare Pages officially documents `npm run build` and `dist` for React (Vite) projects.

## Security

`public/_headers` is copied into the final Vite output and applies the production response headers used by AuthAtlas, including CSP, `X-Frame-Options`, `Referrer-Policy`, and restricted browser permissions.

The current CSP sets `connect-src 'none'`, matching the local-first build: browser code must not make network requests. If a future feature intentionally performs an OAuth exchange, it must be implemented as an explicit opt-in network flow and the CSP must be reviewed at the same time.

## Routing

AuthAtlas currently uses hash routes such as `#/converter`, `#/formats`, and `#/compare`, so no SPA fallback rewrite is required on Pages.

## Verification

Before deploying a production revision, run:

```bash
npm install --no-audit --no-fund
npm run build
```

The GitHub `Build` workflow runs the same production build on pull requests and on pushes to `main`, and can also be started manually with `workflow_dispatch`.
