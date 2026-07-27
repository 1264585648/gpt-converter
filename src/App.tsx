import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Box,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Github,
  Grid2X2,
  Info,
  KeyRound,
  LockKeyhole,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Zap,
} from 'lucide-react'

type Detection = {
  label: string
  authType: string
  provider: string
  confidence: number
  risk: 'Low' | 'Sensitive' | 'Highly sensitive'
  fields: string[]
  accessToken?: string
  refreshToken?: string
  apiKey?: string
}

type Page = 'home' | 'converter' | 'formats' | 'compare' | 'security'
type Target = 'Canonical' | 'Sub2API' | 'New API'
type PathKind = 'Self' | 'Extract' | 'Schema Map' | 'OAuth Exchange' | 'Impossible'

type PathSelection = { source: string; target: string; kind: PathKind }

const demoValue = `{
  "provider": "openai",
  "credential_type": "oauth",
  "access_token": "sk-oat_v1-5M0...A1b2C3d4E5f6G7h8I9",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "rt-v1-2N0...Z9y8X7w6V5u4T3s2R1",
  "scope": "openid profile email offline_access",
  "issued_at": 1716489723,
  "client_id": "d9f3c2e1-6a7b-4d8c-9f1e-2a3b4c5d6e7f",
  "metadata": {
    "app": "ChatGPT",
    "device": "Chrome 124 / macOS"
  }
}`

const formatItems = [
  {
    title: 'Access Token', icon: KeyRound, tone: 'green', description: 'Short-lived credential used to access protected resources.', tags: ['OAuth 2.0', 'Bearer'],
    detail: 'A short-lived credential presented to an API or resource server to authorize requests on behalf of a user or application.', sensitivity: 'Sensitive', lifetime: 'Minutes to hours', usedFor: 'Authenticated API requests', transport: 'Authorization: Bearer', revocable: 'Provider-dependent', rotation: 'Refresh or re-authenticate', store: 'Memory or secure storage',
    fields: ['access_token', 'token_type', 'expires_in', 'scope'], conversion: 'Canonical format and compatible gateway wrappers when the target accepts the same token material.',
    security: ['Keep access tokens out of logs and URLs.', 'Prefer short lifetimes and minimum scopes.', 'Revoke or refresh after suspected exposure.'],
  },
  {
    title: 'Refresh Token', icon: RefreshCw, tone: 'violet', description: 'Long-lived credential used to obtain new access tokens.', tags: ['OAuth 2.0', 'Sensitive'],
    detail: 'A long-lived OAuth credential issued by an authorization server and used to obtain new access tokens without requiring the user to sign in again.', sensitivity: 'Highly sensitive', lifetime: 'Days to months', usedFor: 'Obtaining new access tokens', transport: 'OAuth token endpoint', revocable: 'Yes', rotation: 'Recommended', store: 'Secure server-side storage',
    fields: ['refresh_token', 'token_type', 'expires_in?', 'scope?', 'issued_at?'], conversion: 'Canonical format locally. Refresh Token → Access Token requires a provider OAuth exchange, not a local conversion.',
    security: ['Store encrypted and avoid exposing it to browser code.', 'Use refresh-token rotation where the provider supports it.', 'Revoke immediately after suspected exposure.'],
  },
  {
    title: 'API Key', icon: KeyRound, tone: 'amber', description: 'Simple credential used to identify and authorize API clients.', tags: ['API Key', 'Sensitive'],
    detail: 'A provider-issued secret used by applications to authenticate API requests. Unlike OAuth tokens, it usually represents an application or account rather than a delegated user session.', sensitivity: 'Highly sensitive', lifetime: 'Until rotated or revoked', usedFor: 'Direct API authentication', transport: 'Provider-specific header', revocable: 'Yes', rotation: 'Recommended', store: 'Secret manager / server-side',
    fields: ['api_key', 'provider?', 'base_url?'], conversion: 'Canonical format and compatible gateway wrappers. It cannot be converted into an OAuth refresh token.',
    security: ['Never embed production keys in public frontend bundles.', 'Use scoped keys when the provider offers them.', 'Rotate exposed keys instead of trying to hide leaked values.'],
  },
  {
    title: 'Sub2API', icon: Network, tone: 'blue', description: 'Gateway-side account wrapper for upstream credentials.', tags: ['Gateway', 'Versioned'],
    detail: 'A gateway-oriented account/configuration wrapper that can contain upstream OAuth or API-key material. Exact fields depend on the deployed Sub2API version and provider.', sensitivity: 'Depends on contents', lifetime: 'Mirrors upstream credential', usedFor: 'Gateway account configuration', transport: 'Admin/account configuration', revocable: 'Via upstream credential', rotation: 'Version/provider-dependent', store: 'Gateway secure storage',
    fields: ['provider', 'access_token?', 'refresh_token?', 'api_key?', 'base_url?'], conversion: 'Extract to Canonical locally or schema-map into another gateway format after verifying the exact deployment version.',
    security: ['Treat wrappers as secrets when they contain upstream credentials.', 'Verify version-specific schema before import.', 'Do not send credential wrappers to third-party conversion services.'],
  },
  {
    title: 'New API', icon: Sparkles, tone: 'pink', description: 'Provider/channel configuration for a unified model gateway.', tags: ['Gateway', 'Channel'],
    detail: 'A unified model-gateway channel configuration. Authentication fields vary by provider, channel type, and project version, so adapters should be treated as versioned schema mappings.', sensitivity: 'Depends on contents', lifetime: 'Mirrors upstream credential', usedFor: 'Provider/channel configuration', transport: 'Gateway admin configuration', revocable: 'Via upstream credential', rotation: 'Provider-dependent', store: 'Gateway secure storage',
    fields: ['type', 'provider', 'key?', 'access_token?', 'refresh_token?', 'base_url?'], conversion: 'Extract to Canonical or schema-map to another compatible gateway format after checking the target version.',
    security: ['Channel exports may contain live provider secrets.', 'Validate schema against the deployed project version.', 'Mask secrets in screenshots, logs, and issue reports.'],
  },
  {
    title: 'Canonical Format', icon: Box, tone: 'violet', description: 'Normalized, provider-agnostic representation of credentials.', tags: ['Canonical', 'Local'],
    detail: 'AuthAtlas’s provider-agnostic intermediate representation. It separates the credential material from source-format metadata so adapters can map through one normalized model.', sensitivity: 'Depends on contents', lifetime: 'Mirrors source credential', usedFor: 'Inspection and schema mapping', transport: 'Local JSON representation', revocable: 'Depends on source', rotation: 'Depends on source', store: 'Local memory or secure export',
    fields: ['provider', 'credential_type', 'auth', 'source'], conversion: 'Designed as the local intermediate format for mapping to supported target schemas without fabricating missing credentials.',
    security: ['Canonical does not make secrets less sensitive.', 'Keep exports masked unless the raw secret is explicitly needed.', 'Do not infer or generate credentials that are absent from the source.'],
  },
]

const matrixHeaders = ['Access Token', 'Refresh Token', 'Sub2API', 'New API', 'Canonical', 'API Key']
const matrixRows: { source: string; cells: PathKind[] }[] = [
  { source: 'Access Token', cells: ['Self', 'Impossible', 'Schema Map', 'Schema Map', 'Extract', 'Impossible'] },
  { source: 'Refresh Token', cells: ['OAuth Exchange', 'Self', 'Schema Map', 'Schema Map', 'Extract', 'Impossible'] },
  { source: 'Sub2API', cells: ['Extract', 'Extract', 'Self', 'Schema Map', 'Extract', 'Impossible'] },
  { source: 'New API', cells: ['Extract', 'Extract', 'Schema Map', 'Self', 'Extract', 'Impossible'] },
  { source: 'Canonical', cells: ['Schema Map', 'Impossible', 'Schema Map', 'Schema Map', 'Self', 'Schema Map'] },
  { source: 'API Key', cells: ['Impossible', 'Impossible', 'Schema Map', 'Schema Map', 'Extract', 'Self'] },
]

const defaultPath: PathSelection = { source: 'Refresh Token', target: 'Access Token', kind: 'OAuth Exchange' }

function pageFromHash(): Page {
  const route = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  if (route === 'converter' || route === 'formats' || route === 'compare' || route === 'security') return route
  return 'home'
}

function mask(value?: string) {
  if (!value) return '—'
  if (value.length <= 12) return '••••••••••••'
  return `${value.slice(0, 9)}••••••••••••${value.slice(-4)}`
}

function parseInput(raw: string): Detection {
  const value = raw.trim()
  if (!value) return { label: 'Waiting for input', authType: 'Unknown', provider: 'Unknown', confidence: 0, risk: 'Low', fields: [] }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    const accessToken = typeof parsed.access_token === 'string' ? parsed.access_token : undefined
    const refreshToken = typeof parsed.refresh_token === 'string' ? parsed.refresh_token : undefined
    const apiKey = typeof parsed.api_key === 'string' ? parsed.api_key : typeof parsed.key === 'string' ? parsed.key : undefined
    const provider = typeof parsed.provider === 'string' ? parsed.provider : 'Unknown'
    const fields = Object.keys(parsed)

    if (accessToken && refreshToken) return { label: `${provider === 'Unknown' ? 'OAuth' : provider} Credential`, authType: 'OAuth 2.0', provider, confidence: 98, risk: 'Highly sensitive', fields, accessToken, refreshToken }
    if (refreshToken) return { label: 'Refresh Token Config', authType: 'OAuth 2.0', provider, confidence: 93, risk: 'Highly sensitive', fields, refreshToken }
    if (apiKey) return { label: 'API Key Config', authType: 'API Key', provider, confidence: 91, risk: 'Sensitive', fields, apiKey }
    return { label: 'Generic credential configuration', authType: 'Structured config', provider, confidence: 72, risk: 'Sensitive', fields }
  } catch {
    if (value.startsWith('sk-')) return { label: 'API Key', authType: 'API Key', provider: 'Unknown', confidence: 94, risk: 'Sensitive', fields: ['api_key'], apiKey: value }
    if (/^(rt_|rt-|refresh[_-]?token[=:])/i.test(value)) {
      const token = value.includes('=') ? value.split('=').slice(1).join('=').trim() : value
      return { label: 'Refresh Token', authType: 'OAuth 2.0', provider: 'Unknown', confidence: 93, risk: 'Highly sensitive', fields: ['refresh_token'], refreshToken: token }
    }
    if (value.split('.').length === 3) return { label: 'JWT-like token', authType: 'Bearer / JWT', provider: 'Unknown', confidence: 84, risk: 'Sensitive', fields: ['token'], accessToken: value }
  }

  return { label: 'Unrecognized credential text', authType: 'Unknown', provider: 'Unknown', confidence: 36, risk: 'Sensitive', fields: [] }
}

function inputMeta(raw: string, detection: Detection) {
  const trimmed = raw.trim()
  let isJson = false
  if (trimmed) {
    try {
      JSON.parse(trimmed)
      isJson = true
    } catch {
      isJson = false
    }
  }
  const bytes = new TextEncoder().encode(raw).length
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`
  const status = !trimmed ? 'Waiting for input' : isJson ? 'JSON detected' : detection.authType !== 'Unknown' ? `${detection.authType} detected` : 'Unrecognized input'
  return { isJson, size, status, hasCredential: Boolean(detection.accessToken || detection.refreshToken || detection.apiKey) }
}

function canonicalOutput(detection: Detection) {
  return JSON.stringify({
    provider: detection.provider === 'Unknown' ? null : detection.provider,
    credential_type: detection.refreshToken || detection.accessToken ? 'oauth' : detection.apiKey ? 'api_key' : 'unknown',
    auth: { type: detection.authType, access_token: detection.accessToken ?? null, refresh_token: detection.refreshToken ?? null, api_key: detection.apiKey ?? null },
    source: { format: 'auto-detected', processed_locally: true },
  }, null, 2)
}

function gatewayOutput(detection: Detection, target: Exclude<Target, 'Canonical'>) {
  return JSON.stringify({
    format: target === 'Sub2API' ? 'sub2api' : 'new-api',
    provider: detection.provider === 'Unknown' ? null : detection.provider,
    auth: {
      type: detection.refreshToken ? 'oauth2' : detection.apiKey ? 'api_key' : detection.accessToken ? 'bearer' : 'unknown',
      token_type: detection.accessToken ? 'Bearer' : null,
      access_token: detection.accessToken ?? null,
      refresh_token: detection.refreshToken ?? null,
      api_key: detection.apiKey ?? null,
    },
    metadata: { converted_by: 'AuthAtlas', local_only: true, adapter_note: 'Verify fields against the exact target project version.' },
  }, null, 2)
}

function maskedJson(value: string) {
  return value.replace(/("(?:access_token|refresh_token|api_key)":\s*")([^"\n]+)(")/g, (_m, a: string, b: string, c: string) => `${a}${b === 'null' ? b : mask(b)}${c}`)
}

async function copyText(value: string) {
  if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
  await navigator.clipboard.writeText(value)
}

function pathDetails(selection: PathSelection) {
  const { source, target, kind } = selection
  if (kind === 'OAuth Exchange') return {
    summary: "This path requires the provider's OAuth server. It is not a pure local transformation.",
    why: `${target} must be issued by the authorization server; ${source} can only be exchanged through the provider token endpoint.`,
    requirements: ['Valid refresh credential', 'Provider token endpoint', 'Required client authentication', 'Explicit network request'],
  }
  if (kind === 'Extract') return {
    summary: 'The target fields can be read from the source locally without contacting a provider.',
    why: `${source} already contains credential material that can be represented as ${target}; AuthAtlas only extracts the relevant fields.`,
    requirements: ['Recognized source structure', 'Required target fields present', 'No provider network request'],
  }
  if (kind === 'Schema Map') return {
    summary: 'This path is a local schema mapping or wrapper transformation.',
    why: `${source} and ${target} can carry compatible credential material but use different field names or container structures.`,
    requirements: ['Recognized source fields', 'Target schema/version known', 'No missing secret fabricated'],
  }
  if (kind === 'Self') return {
    summary: 'Source and target are already the same format.',
    why: 'No conversion is required; the safest operation is to preserve the source value as-is.',
    requirements: ['No transformation needed', 'Preserve secret value', 'Keep handling local'],
  }
  return {
    summary: 'No safe or meaningful direct conversion path is known.',
    why: `${target} requires credential material that cannot be derived from ${source} alone. AuthAtlas will not invent missing secrets.`,
    requirements: ['Choose a compatible target', 'Use Canonical for inspection', 'Obtain required credentials from the provider'],
  }
}

function Brand() {
  return <a className="brand" href="#/" aria-label="AuthAtlas home"><span className="brand-glyph"><i /><b /></span><span>AuthAtlas</span></a>
}

function Header({ page }: { page: Page }) {
  return <header className="topbar"><div className="nav-inner"><Brand /><nav className="nav-links" aria-label="Main navigation"><a className={page === 'formats' ? 'active' : ''} href="#/formats">Formats</a><a className={page === 'converter' ? 'active' : ''} href="#/converter">Converter</a><a className={page === 'compare' ? 'active' : ''} href="#/compare">Compare</a><a className={page === 'security' ? 'active' : ''} href="#/security">Security</a><a href="https://github.com/1264585648/gpt-converter#readme" target="_blank" rel="noreferrer">Docs</a><a href="https://github.com/1264585648/gpt-converter" target="_blank" rel="noreferrer">GitHub <ExternalLink size={13} /></a></nav></div></header>
}

function LocalBadge() { return <div className="local-badge"><LockKeyhole size={14} /> 100% processed locally</div> }

function CodeBlock({ value }: { value: string }) {
  return <div className="code-block">{value.split('\n').map((row, index) => <div className="code-line" key={`${index}-${row}`}><span className="line-number">{index + 1}</span><code>{row || ' '}</code></div>)}</div>
}

function AnalysisPanel({ detection, onClear }: { detection: Detection; onClear: () => void }) {
  const tokenType = detection.apiKey ? 'API Key' : detection.accessToken || detection.refreshToken ? 'Bearer' : '—'
  const riskLabel = detection.risk === 'Highly sensitive' ? 'High sensitivity' : detection.risk === 'Sensitive' ? 'Sensitive' : 'Low risk'
  return <div className="analysis-panel"><div className="window-head"><span><Sparkles size={15} /> Analysis</span><button type="button" onClick={onClear}>Clear <Trash2 size={14} /></button></div><div className="analysis-hero"><span className="analysis-logo"><Network size={27} /></span><div className="analysis-title"><strong>Detected: {detection.label}</strong><span>Confidence: {detection.confidence}%</span></div></div><div className="confidence-bar"><i style={{ width: `${detection.confidence}%` }} /></div><dl className="facts-list"><div><dt>Provider</dt><dd>{detection.provider}</dd></div><div><dt>Auth Type</dt><dd>{detection.authType}</dd></div><div><dt>Contains</dt><dd className="contains">{detection.accessToken && <span><CheckCircle2 /> Access Token</span>}{detection.refreshToken && <span><CheckCircle2 /> Refresh Token</span>}{detection.apiKey && <span><CheckCircle2 /> API Key</span>}{detection.fields.length === 0 && <span>—</span>}</dd></div><div><dt>Token Type</dt><dd>{tokenType}</dd></div><div><dt>Detected Fields</dt><dd>{detection.fields.length ? detection.fields.slice(0, 4).join(', ') : '—'}</dd></div><div><dt>Risk Assessment</dt><dd><span className="risk-badge">● {riskLabel}</span></dd></div></dl><div className="analysis-note"><Info size={15} /><span>{detection.risk === 'Low' ? 'Paste a credential or configuration to inspect it locally.' : 'Credentials may authorize requests. Store them securely and never share live secrets.'}</span></div></div>
}

function HomePage({ input, setInput, detection }: { input: string; setInput: (value: string) => void; detection: Detection }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const meta = useMemo(() => inputMeta(input, detection), [input, detection])
  const copyInput = async () => {
    try { await copyText(input); setCopyState('copied') } catch { setCopyState('error') }
    window.setTimeout(() => setCopyState('idle'), 1200)
  }
  return <main className="home-page page-shell"><section className="hero-section content-width"><LocalBadge /><h1>Understand your <span>AI credentials.</span></h1><p>Inspect, compare and convert OAuth tokens, API keys, Sub2API and New API formats locally in your browser.</p><div className="hero-actions"><a className="button primary" href="#/converter"><Zap size={17} /> Open Converter</a><a className="button secondary" href="#/formats"><Grid2X2 size={17} /> Explore Formats</a></div></section><section className="hero-workbench content-width"><div className="input-window"><div className="window-head"><span>&lt;/&gt; Input</span><div className="head-tools"><span className="select-pill">Auto-detect <ChevronDown size={13} /></span><button type="button" onClick={copyInput} aria-label="Copy input" title={copyState === 'error' ? 'Copy failed' : copyState === 'copied' ? 'Copied' : 'Copy input'}><Copy size={14} /></button><button type="button" onClick={() => setInput('')} aria-label="Clear input" title="Clear input"><Trash2 size={14} /></button></div></div><textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} aria-label="Credential input" /><div className="window-foot"><span>{meta.status === 'Unrecognized input' ? <CircleAlert size={15} /> : <CheckCircle2 size={15} />} {meta.status}</span><span>{meta.size} &nbsp; · &nbsp; {detection.label}</span></div></div><AnalysisPanel detection={detection} onClear={() => setInput('')} /></section><section className="feature-grid content-width"><Feature icon={<ShieldCheck />} title="Local-first processing" copy="Everything runs in your browser. Your data never leaves your device." badge="100% Private" tone="violet" /><Feature icon={<Grid2X2 />} title="Compatibility Matrix" copy="Compare format support across providers and authentication types." badge="Clear conversion paths" tone="blue" /><Feature icon={<Box />} title="Canonical Format" copy="Convert supported credentials into one clean, portable representation." badge="Consistent & portable" tone="violet" /><Feature icon={<LockKeyhole />} title="Secure Masked Preview" copy="Sensitive values are masked automatically in previews and exports." badge="Safety by default" tone="green" /></section></main>
}

function Feature({ icon, title, copy, badge, tone }: { icon: ReactNode; title: string; copy: string; badge: string; tone: string }) {
  return <article className={`feature-card tone-${tone}`}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{copy}</p><span className="feature-badge">{badge}</span></article>
}

function ConverterPage({ input, setInput, detection }: { input: string; setInput: (value: string) => void; detection: Detection }) {
  const [showSecret, setShowSecret] = useState(false)
  const [selectedTarget, setSelectedTarget] = useState<Target>('Sub2API')
  const [target, setTarget] = useState<Target>('Sub2API')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const meta = useMemo(() => inputMeta(input, detection), [input, detection])
  const output = useMemo(() => target === 'Canonical' ? canonicalOutput(detection) : gatewayOutput(detection, target), [detection, target])
  const visibleOutput = showSecret ? output : maskedJson(output)
  const copyOutput = async () => {
    try { await copyText(output); setCopyState('copied') } catch { setCopyState('error') }
    window.setTimeout(() => setCopyState('idle'), 1200)
  }
  const downloadOutput = () => { const blob = new Blob([output], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `authatlas-${target.toLowerCase().replaceAll(' ', '-')}.json`; anchor.click(); URL.revokeObjectURL(url) }

  return <main className="page-shell inner-page converter-page"><section className="content-width page-heading converter-heading"><div><span className="breadcrumb">Home <ArrowRight /> Converter</span><h1>Credential <span>Converter</span></h1><p>Convert OAuth tokens, API keys, and credentials between formats locally — your data never leaves your device.</p></div><LocalBadge /></section><section className="content-width conversion-strip"><div className="format-select"><small>Source format</small><strong><RefreshCw size={16} /> Auto-detect <ChevronDown size={14} /></strong></div><div className="detected-chip"><CheckCircle2 size={16} /> Detected: {detection.label}</div><ArrowRight className="strip-arrow" /><div className="format-select"><small>Target format</small><strong><Box size={16} /> {selectedTarget} <ChevronDown size={14} /></strong><select aria-label="Target format" value={selectedTarget} onChange={(event) => setSelectedTarget(event.target.value as Target)}><option>Sub2API</option><option>New API</option><option>Canonical</option></select></div><ArrowRight className="strip-arrow" /><button className="button primary convert-button" type="button" onClick={() => setTarget(selectedTarget)}><Zap size={17} /> Convert</button></section><section className="content-width converter-workspace"><article className="workspace-card input-card"><div className="workspace-head"><strong><span>1</span> Input</strong><div><button type="button" onClick={() => setShowSecret((v) => !v)}>{showSecret ? <EyeOff /> : <Eye />} {showSecret ? 'Mask' : 'Reveal'}</button><button type="button" onClick={() => setInput('')}><Trash2 /> Clear</button></div></div><textarea value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} aria-label="Credential source" className={showSecret ? '' : 'mask-soft'} /><div className="workspace-status"><span>{meta.status === 'Unrecognized input' ? <CircleAlert /> : <CheckCircle2 />} {meta.status}</span><span>{meta.size} · {detection.label}</span></div></article><article className="workspace-card output-card"><div className="workspace-head"><strong><span>2</span> Output ({target})</strong><button type="button" onClick={copyOutput}><Copy /> {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy'}</button></div><CodeBlock value={visibleOutput} /><div className="workspace-status"><span><CheckCircle2 /> Generated {target}</span><span>JSON</span></div></article><aside className="converter-aside"><div className="side-card compatibility-note"><div className="side-title"><strong><Info /> Compatibility note</strong><span className="chip purple">Schema map</span></div><p>This conversion maps fields into the target schema. No tokens are exchanged.</p><dl><div><dt>Strategy</dt><dd>Schema map</dd></div><div><dt>Confidence</dt><dd><span className="green-text">{meta.hasCredential ? 'High' : 'Low'}</span></dd></div><div><dt>Fidelity</dt><dd><span className="green-text">{meta.hasCredential ? 'High' : 'Unknown'}</span></dd></div><div><dt>Data leaves device</dt><dd><span className="green-text">Never</span></dd></div></dl></div><div className="side-card warning-card"><div className="side-title"><strong><CircleAlert /> Warnings</strong><span className="chip amber">{meta.hasCredential ? 1 : 2}</span></div>{!meta.hasCredential && <div className="warning-item"><CircleAlert /><div><strong>No recognized credential</strong><p>Paste a supported token or credential object before exporting.</p></div></div>}<div className="warning-item"><CircleAlert /><div><strong>Version-dependent schema</strong><p>Verify field names against the deployment version.</p></div></div></div></aside></section><section className="content-width converter-support-grid"><article className="support-card"><div className="support-title"><Eye /> Masked preview <span className="chip purple">Masked</span></div><SecretRow label="access_token" value={detection.accessToken} /><SecretRow label="refresh_token" value={detection.refreshToken} /><p className="support-foot"><CheckCircle2 /> Sensitive values are masked locally.</p></article><article className="support-card"><div className="support-title"><ShieldCheck /> Validation</div><ValidationRow label="JSON syntax" value={meta.isJson ? 'Valid JSON' : input.trim() ? 'Text credential' : 'Empty'} /><ValidationRow label="Recognized credential" value={meta.hasCredential ? 'Yes' : 'No'} /><ValidationRow label="Schema" value={`${target} target`} /><ValidationRow label="Processing" value="Browser only" /></article><article className="support-card export-card"><div className="support-title"><Box /> Export</div><p>Save your converted credential as a local file or copy it to the clipboard.</p><div className="export-actions"><button className="button primary" onClick={downloadOutput}><Download /> Download JSON</button><button className="button secondary" onClick={copyOutput}><Copy /> Copy to clipboard</button></div></article></section></main>
}

function SecretRow({ label, value }: { label: string; value?: string }) { return <div className="secret-row"><span><small>{label}</small><code>{mask(value)}</code></span><button type="button" aria-label={`Copy ${label}`} onClick={() => value && copyText(value).catch(() => undefined)}><Copy size={16} /></button></div> }
function ValidationRow({ label, value }: { label: string; value: string }) { return <div className="validation-row"><span><CheckCircle2 /> {label}</span><strong>{value}</strong></div> }

function FormatsPage() {
  const [selected, setSelected] = useState('Refresh Token')
  const [query, setQuery] = useState('')
  const filtered = formatItems.filter((item) => `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const item = formatItems.find((entry) => entry.title === selected) ?? formatItems[1]
  const Icon = item.icon
  const isRefreshToken = item.title === 'Refresh Token'

  return <main className="page-shell inner-page formats-page"><section className="content-width formats-heading"><div><span className="knowledge-pill"><Box size={13} /> Knowledge</span><h1>Explore <span>Authentication Formats</span></h1><p>Learn the purpose, sensitivity, and compatibility of common authentication formats.</p></div><label className="search-box"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search formats, fields, or concepts..." /><kbd>⌘ K</kbd></label></section><section className="content-width formats-layout"><aside className="category-rail"><strong>Browse by category</strong><Category active title="Authentication" copy="Tokens, keys & API credentials" count="6" icon={<KeyRound />} /><Category title="Gateway Formats" copy="Proxy & gateway wrappers" count="3" icon={<Network />} /><Category title="CLI Formats" copy="CLI config & credential files" count="2" icon={<Box />} /><Category title="Security Concepts" copy="Core ideas & best practices" count="6" icon={<ShieldCheck />} /><strong className="filter-title">Filter by tags</strong><div className="tag-cloud"><span>OAuth 2.0&nbsp; 4</span><span>Bearer&nbsp; 4</span><span>Gateway wrapper&nbsp; 3</span><span>API Key&nbsp; 2</span><span>Sub2API&nbsp; 1</span><span>New API&nbsp; 1</span><span>Canonical&nbsp; 1</span></div><div className="rail-callout"><Zap /><strong>Not sure what a format is?</strong><p>Formats define how credentials are structured, transported, and verified.</p><a href="#/security">Learn the basics <ArrowRight /></a></div></aside><div className="format-list-pane"><div className="list-toolbar"><span>Show <Grid2X2 /> ≡</span><small>Showing {filtered.length} of 6 formats</small></div>{filtered.map((entry) => { const RowIcon = entry.icon; return <button className={`format-list-item ${selected === entry.title ? 'selected' : ''}`} key={entry.title} onClick={() => setSelected(entry.title)}><span className={`format-list-icon tone-${entry.tone}`}><RowIcon /></span><span className="format-list-copy"><strong>{entry.title}</strong><small>{entry.description}</small><span>{entry.tags.map((tag) => <i key={tag}>{tag}</i>)}</span></span><ArrowRight /></button> })}</div><article className="format-detail"><div className="detail-header"><div><span className={`detail-icon tone-${item.tone}`}><Icon /></span><span><h2>{item.title} <i>{item.sensitivity}</i></h2><div className="detail-tags">{item.tags.map((tag) => <b key={tag}>{tag}</b>)}</div></span></div><a className="button secondary purple-outline" href="#/converter"><Zap /> Open in Converter</a></div><p className="detail-intro">{item.detail}</p><div className="detail-primary-grid"><div className="lifecycle-card"><strong>{isRefreshToken ? 'Lifecycle:' : 'Workflow:'} <span>How it works</span></strong><div className="lifecycle-flow">{isRefreshToken ? <><FlowStep icon={<User />} title="Login" copy="User authenticates with the provider" /><ArrowRight /><FlowStep icon={<LockKeyhole />} title="Access Token + Refresh Token" copy="Access token for API calls, refresh token stored securely" /><ArrowRight /><FlowStep icon={<RefreshCw />} title="New Access Token" copy="Use refresh token through the provider token endpoint" /></> : <><FlowStep icon={<Icon />} title={item.title} copy="Inspect the source format and fields" /><ArrowRight /><FlowStep icon={<Box />} title="Canonical" copy="Normalize credential material locally" /><ArrowRight /><FlowStep icon={<Network />} title="Target schema" copy="Map only when the target supports the required fields" /></>}</div><div className="tip-line"><ShieldCheck /> {isRefreshToken ? 'Tip: Rotation is recommended where the provider supports it.' : 'Tip: Never fabricate secret fields that are absent from the source.'}</div></div><div className="glance-card"><strong>At a glance</strong><Glance label="Sensitivity" value={item.sensitivity} danger={item.sensitivity !== 'Low'} /><Glance label="Typical lifetime" value={item.lifetime} /><Glance label="Used for" value={item.usedFor} /><Glance label="Transport" value={item.transport} /><Glance label="Revocable" value={item.revocable} /><Glance label="Rotation" value={item.rotation} /><Glance label="Store" value={item.store} /></div></div><div className="detail-bottom-grid"><InfoTile title="What it is"><p>{item.detail}</p><a href="#/security">Learn more <ArrowRight /></a></InfoTile><InfoTile title="Typical fields"><pre>{item.fields.join('\n')}</pre></InfoTile><InfoTile title="Can convert to"><p>{item.conversion}</p><span className="chip purple"><Box /> Canonical Format</span></InfoTile><InfoTile title="Security notes"><ul>{item.security.map((note) => <li key={note}>{note}</li>)}</ul></InfoTile></div></article></section></main>
}

function Category({ active, title, copy, count, icon }: { active?: boolean; title: string; copy: string; count: string; icon: ReactNode }) { return <button className={`category-item ${active ? 'active' : ''}`}><span>{icon}</span><span><strong>{title}</strong><small>{copy}</small></span><i>{count}</i></button> }
function FlowStep({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) { return <div className="flow-step"><span>{icon}</span><strong>{title}</strong><small>{copy}</small></div> }
function Glance({ label, value, danger }: { label: string; value: string; danger?: boolean }) { return <div className="glance-row"><span>{label}</span><strong className={danger ? 'danger-text' : ''}>{value}</strong></div> }
function InfoTile({ title, children }: { title: string; children: ReactNode }) { return <section className="info-tile"><strong>{title}</strong>{children}</section> }

function ComparePage() {
  const [selected, setSelected] = useState<PathSelection>(defaultPath)
  const details = pathDetails(selected)
  return <main className="page-shell inner-page compare-page"><section className="content-width compare-heading"><h1>Compatibility <span>Matrix</span></h1><p>See which credential formats can be converted into which targets. Understand when conversion is local, requires schema mapping, needs OAuth exchange, or is impossible.</p></section><section className="content-width compare-main-grid"><article className="matrix-panel"><div className="matrix-title"><strong>Conversion Compatibility Matrix</strong><span>View: <b>All Paths</b> <ChevronDown /></span></div><div className="matrix-wrap"><table><thead><tr><th>From \ To</th>{matrixHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{matrixRows.map((row) => <tr key={row.source}><th>{row.source}</th>{row.cells.map((cell, index) => <td key={`${row.source}-${matrixHeaders[index]}`}><button className={`path-chip ${cell.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setSelected({ source: row.source, target: matrixHeaders[index], kind: cell })}>{cell}</button></td>)}</tr>)}</tbody></table></div><p className="matrix-hint">Click a cell to inspect that conversion path.</p></article><aside className="selected-path"><div className="selected-head"><strong>Selected Path</strong><button type="button" onClick={() => setSelected(defaultPath)}>Reset &nbsp; ×</button></div><div className="path-display"><div><RefreshCw /><strong>{selected.source}</strong><small>Source</small></div><ArrowRight /><div><KeyRound /><strong>{selected.target}</strong><small>Target</small></div></div><span className={`chip path-kind ${selected.kind.toLowerCase().replaceAll(' ', '-')}`}>{selected.kind}</span><p>{details.summary}</p><h3>Why</h3><p>{details.why}</p><h3>Requirements</h3><ul>{details.requirements.map((requirement) => <li key={requirement}>{selected.kind === 'Impossible' ? <CircleAlert /> : <CheckCircle2 />} {requirement}</li>)}</ul><a className="button primary" href="#/converter"><Zap /> Open in Converter</a></aside></section><section className="content-width matrix-legend-card"><strong>Legend</strong><Legend kind="Extract" copy="Pure local extraction. No transformation needed." /><Legend kind="Schema Map" copy="Requires schema mapping or field translation." /><Legend kind="OAuth Exchange" copy="Requires provider OAuth server interaction." /><Legend kind="Impossible" copy="No known safe conversion path exists." /><Legend kind="Self" copy="Source and target are the same." /></section><section className="content-width compare-support-grid"><InfoPanel icon={<Box />} title="Recommended Canonical Workflow"><div className="canonical-flow"><span>Any Format</span><ArrowRight /><span>Canonical</span><ArrowRight /><span>Target Format</span></div><p>Normalize to Canonical first for consistent, reversible conversions across providers and formats.</p><a href="#/formats">Learn about Canonical Format</a></InfoPanel><InfoPanel icon={<ShieldCheck />} title="Security Reminder"><p>Local conversions stay in your browser. OAuth exchange is intentionally labeled as remote.</p><ul><li>✓ No secret database</li><li>✓ No credential analytics</li><li>✓ Masked by default</li><li>✓ Static deployable</li></ul></InfoPanel><InfoPanel icon={<ArrowRight />} title="Popular Paths"><PathList label="Refresh Token → Access Token" kind="OAuth Exchange" /><PathList label="Access Token → Canonical" kind="Extract" /><PathList label="Sub2API → Canonical" kind="Extract" /><PathList label="New API → Canonical" kind="Extract" /></InfoPanel></section></main>
}

function Legend({ kind, copy }: { kind: PathKind; copy: string }) { return <div className="legend-item"><span className={`path-chip ${kind.toLowerCase().replaceAll(' ', '-')}`}>{kind}</span><small>{copy}</small></div> }
function InfoPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) { return <article className="info-panel"><div className="support-title">{icon}{title}</div>{children}</article> }
function PathList({ label, kind }: { label: string; kind: PathKind }) { return <div className="path-list-row"><span>{label}</span><span className={`path-chip ${kind.toLowerCase().replaceAll(' ', '-')}`}>{kind}</span></div> }

function SecurityPage() {
  return <main className="page-shell inner-page security-page"><section className="content-width security-hero"><span className="security-lock"><ShieldCheck /></span><LocalBadge /><h1>Your secret should <span>stay yours.</span></h1><p>AuthAtlas is designed as a static, local-first inspector. Parsing, masking, normalization, comparison, and export happen in browser memory.</p></section><section className="content-width security-grid"><InfoPanel icon={<LockKeyhole />} title="No credential backend"><p>The converter does not need an API endpoint to inspect or map credential schemas.</p></InfoPanel><InfoPanel icon={<EyeOff />} title="Masked by default"><p>Secrets stay visually masked until you explicitly reveal them.</p></InfoPanel><InfoPanel icon={<Network />} title="Remote means remote"><p>OAuth exchanges are labeled separately because they require provider network requests and are not local conversions.</p></InfoPanel></section></main>
}

function Footer() { return <footer className="footer"><div className="content-width footer-inner"><Brand /><p>Your local toolkit for understanding and converting AI credentials.</p><span>© 2026 AuthAtlas</span><nav><a href="#/security">Privacy</a><a href="https://github.com/1264585648/gpt-converter" target="_blank" rel="noreferrer">GitHub <Github /></a></nav></div></footer> }

function App() {
  const [page, setPage] = useState<Page>(pageFromHash)
  const [input, setInput] = useState(demoValue)
  const detection = useMemo(() => parseInput(input), [input])

  useEffect(() => {
    const onHashChange = () => { setPage(pageFromHash()); window.scrollTo({ top: 0, behavior: 'auto' }) }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return <div className="app-shell"><div className="ambient ambient-left" /><div className="ambient ambient-right" /><Header page={page} />{page === 'home' && <HomePage input={input} setInput={setInput} detection={detection} />}{page === 'converter' && <ConverterPage input={input} setInput={setInput} detection={detection} />}{page === 'formats' && <FormatsPage />}{page === 'compare' && <ComparePage />}{page === 'security' && <SecurityPage />}<Footer /></div>
}

export default App
