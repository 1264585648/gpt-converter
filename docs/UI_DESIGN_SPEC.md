# AuthAtlas High Fidelity UI Design Specification

## Design direction

Premium developer-tool aesthetic inspired by Linear / Vercel / Raycast.

- Dark-first interface
- Deep navy background
- Purple/blue accent glow
- Inter typography
- JetBrains Mono for tokens and JSON
- Rounded cards with subtle borders

## Pages

### 1. Landing Page

Structure:

- Top navigation: Formats, Converter, Compare, Security, Docs, GitHub
- Hero headline: Understand your AI credentials.
- Primary CTA: Open Converter
- Secondary CTA: Explore Formats
- Security badge: 100% processed locally

Hero workspace:

Left:
- JSON/token editor
- Masked sensitive values

Right:
- Detected credential type
- Confidence score
- Provider
- Token fields
- Security risk

### 2. Converter Page

Three areas:

- Source credential input
- Conversion flow selector
- Target output preview

States:

- Extract
- Schema Map
- OAuth Exchange
- Impossible

Sensitive values must be masked by default.

### 3. Formats Knowledge Page

Layout:

- Category sidebar
- Format cards
- Detail inspector

Formats:

- Access Token
- Refresh Token
- API Key
- Sub2API
- New API
- Canonical Format

### 4. Compatibility Matrix

Matrix cells represent:

- Green: local extraction
- Yellow: schema mapping
- Blue: OAuth exchange
- Red: impossible
- Gray: same format

## Implementation notes

All credential parsing and conversion UI must remain client-side. No secrets should be uploaded to a server.
