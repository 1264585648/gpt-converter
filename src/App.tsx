import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  Eye,
  EyeOff,
  Github,
  KeyRound,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  X,
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

const demoValue = `{
  "provider": "openai",
  "access_token": "eyJhbGciOi...demo-access-token",
  "refresh_token": "rt_demo-refresh-token",
  "expires_at": 1780000000
}`

function mask(value?: string) {
  if (!value) return '—'
  if (value.length <= 12) return '••••••••••••'
  return `${value.slice(0, 5)}••••••••••••${value.slice(-4)}`
}

function parseInput(raw: string): Detection {
  const value = raw.trim()
  if (!value) {
    return {
      label: 'Waiting for input',
      authType: 'Unknown',
      provider: 'Unknown',
      confidence: 0,
      risk: 'Low',
      fields: [],
    }
  }

  try {
    const parsed = JSON.parse(value) as Record<string, unknown>
    const accessToken = typeof parsed.access_token === 'string' ? parsed.access_token : undefined
    const refreshToken = typeof parsed.refresh_token === 'string' ? parsed.refresh_token : undefined
    const apiKey = typeof parsed.api_key === 'string' ? parsed.api_key : typeof parsed.key === 'string' ? parsed.key : undefined
    const provider = typeof parsed.provider === 'string' ? parsed.provider : 'Unknown'
    const fields = Object.keys(parsed)

    if (accessToken && refreshToken) {
      return {
        label: 'OAuth Credential Bundle',
        authType: 'OAuth 2.0',
        provider,
        confidence: 96,
        risk: 'Highly sensitive',
        fields,
        accessToken,
        refreshToken,
      }
    }

    if (refreshToken) {
      return {
        label: 'Refresh Token Config',
        authType: 'OAuth 2.0',
        provider,
        confidence: 91,
        risk: 'Highly sensitive',
        fields,
        refreshToken,
      }
    }

    if (apiKey) {
      return {
        label: 'API Key Config',
        authType: 'API Key',
        provider,
        confidence: 89,
        risk: 'Sensitive',
        fields,
        apiKey,
      }
    }

    return {
      label: 'Generic credential configuration',
      authType: 'Structured config',
      provider,
      confidence: 72,
      risk: 'Sensitive',
      fields,
    }
  } catch {
    if (value.startsWith('sk-')) {
      return {
        label: 'API Key',
        authType: 'API Key',
        provider: 'Unknown',
        confidence: 94,
        risk: 'Sensitive',
        fields: ['api_key'],
        apiKey: value,
      }
    }

    if (/^(rt_|refresh[_-]?token[=:])/i.test(value)) {
      const token = value.includes('=') ? value.split('=').slice(1).join('=').trim() : value
      return {
        label: 'Refresh Token',
        authType: 'OAuth 2.0',
        provider: 'Unknown',
        confidence: 93,
        risk: 'Highly sensitive',
        fields: ['refresh_token'],
        refreshToken: token,
      }
    }

    if (value.split('.').length === 3) {
      return {
        label: 'JWT-like token',
        authType: 'Bearer / JWT',
        provider: 'Unknown',
        confidence: 84,
        risk: 'Sensitive',
        fields: ['token'],
        accessToken: value,
      }
    }
  }

  return {
    label: 'Unrecognized credential text',
    authType: 'Unknown',
    provider: 'Unknown',
    confidence: 36,
    risk: 'Sensitive',
    fields: [],
  }
}

function canonicalOutput(detection: Detection) {
  return JSON.stringify(
    {
      provider: detection.provider === 'Unknown' ? null : detection.provider,
      auth_type: detection.authType,
      credentials: {
        access_token: detection.accessToken ?? null,
        refresh_token: detection.refreshToken ?? null,
        api_key: detection.apiKey ?? null,
      },
      source: {
        format: 'auto-detected',
      },
    },
    null,
    2,
  )
}

function gatewayOutput(detection: Detection, target: 'Sub2API' | 'New API') {
  return JSON.stringify(
    {
      _note: `${target} adapter template — verify field names against the version you deploy`,
      provider: detection.provider === 'Unknown' ? 'openai' : detection.provider,
      auth_type: detection.refreshToken ? 'oauth' : detection.apiKey ? 'api_key' : 'unknown',
      access_token: detection.accessToken ?? null,
      refresh_token: detection.refreshToken ?? null,
      api_key: detection.apiKey ?? null,
    },
    null,
    2,
  )
}

const compatibility = [
  ['Access Token', '—', 'Impossible', 'Local wrap', 'Conditional', 'Impossible'],
  ['Refresh Token', 'OAuth exchange', '—', 'Local wrap', 'Conditional', 'Impossible'],
  ['Sub2API', 'Extract', 'Extract', '—', 'Schema map', 'Impossible'],
  ['New API', 'Conditional', 'Conditional', 'Schema map', '—', 'Impossible'],
  ['API Key', 'Impossible', 'Impossible', 'Conditional', 'Local wrap', '—'],
]

const formatCards = [
  {
    title: 'Access Token',
    kicker: 'OAuth · Bearer',
    description: 'Short-lived credential used to authorize resource requests.',
    risk: 'Sensitive',
  },
  {
    title: 'Refresh Token',
    kicker: 'OAuth · Long-lived',
    description: 'Used by an OAuth client to request fresh access credentials.',
    risk: 'Critical',
  },
  {
    title: 'API Key',
    kicker: 'Static credential',
    description: 'Service-issued secret commonly used by API clients and gateways.',
    risk: 'Sensitive',
  },
  {
    title: 'Sub2API',
    kicker: 'Gateway schema',
    description: 'A gateway-side representation that can wrap upstream credentials.',
    risk: 'Versioned',
  },
  {
    title: 'New API',
    kicker: 'Channel config',
    description: 'Provider/channel configuration used by a unified model gateway.',
    risk: 'Versioned',
  },
  {
    title: 'Canonical',
    kicker: 'AuthAtlas internal',
    description: 'A normalized shape that keeps parsers and exporters decoupled.',
    risk: 'Local only',
  },
]

function App() {
  const [input, setInput] = useState(demoValue)
  const [showSecret, setShowSecret] = useState(false)
  const [target, setTarget] = useState<'Canonical' | 'Sub2API' | 'New API'>('Canonical')
  const [copied, setCopied] = useState(false)

  const detection = useMemo(() => parseInput(input), [input])
  const output = useMemo(() => {
    if (target === 'Canonical') return canonicalOutput(detection)
    return gatewayOutput(detection, target)
  }, [detection, target])

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="AuthAtlas home">
          <span className="brand-mark"><Network size={17} /></span>
          <span>AuthAtlas</span>
          <span className="beta">alpha</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#formats">Formats</a>
          <a href="#converter">Converter</a>
          <a href="#compare">Compare</a>
          <a href="#security">Security</a>
        </nav>
        <a className="github-button" href="https://github.com/1264585648/gpt-converter" target="_blank" rel="noreferrer">
          <Github size={17} /> GitHub
        </a>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="eyebrow"><Sparkles size={14} /> AI authentication format lab</div>
          <h1>Understand your<br /><span>AI credentials.</span></h1>
          <p className="hero-copy">
            Inspect, compare and normalize OAuth tokens, API keys and gateway credential formats — without sending secrets to a server.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#converter">Open converter <ArrowRight size={17} /></a>
            <a className="secondary-button" href="#formats">Explore formats</a>
          </div>
          <div className="privacy-line"><ShieldCheck size={15} /> 100% browser-side parsing · no backend required</div>

          <div className="flow-card">
            <div className="flow-node"><span>RAW</span><strong>rt_xxxxxx</strong></div>
            <ArrowRight className="flow-arrow" size={21} />
            <div className="flow-node active"><span>DETECTED</span><strong>Refresh Token</strong></div>
            <ArrowRight className="flow-arrow" size={21} />
            <div className="flow-node"><span>NORMALIZED</span><strong>Canonical</strong></div>
            <ArrowRight className="flow-arrow" size={21} />
            <div className="flow-node"><span>EXPORT</span><strong>Gateway config</strong></div>
          </div>
        </section>

        <section id="converter" className="section-wrap converter-section">
          <div className="section-heading">
            <div><span className="section-index">01</span><h2>Credential Inspector</h2></div>
            <p>Paste a credential or configuration. Detection and transformation stay inside this browser tab.</p>
          </div>

          <div className="inspector-grid">
            <div className="panel editor-panel">
              <div className="panel-head">
                <div><span className="status-dot" /> INPUT</div>
                <div className="panel-actions">
                  <button onClick={() => setShowSecret((v) => !v)}>{showSecret ? <EyeOff size={15} /> : <Eye size={15} />} {showSecret ? 'Mask' : 'Reveal'}</button>
                  <button onClick={() => setInput('')}>Clear</button>
                </div>
              </div>
              <textarea
                aria-label="Credential input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                spellCheck={false}
                className={showSecret ? '' : 'masked-editor'}
              />
              <div className="editor-foot"><LockKeyhole size={14} /> Never sent over the network by this app.</div>
            </div>

            <div className="panel detection-panel">
              <div className="panel-head"><div><Zap size={14} /> DETECTED</div><span className="pill">live</span></div>
              <div className="detected-type">
                <span className="token-icon"><KeyRound size={20} /></span>
                <div><strong>{detection.label}</strong><small>{detection.authType}</small></div>
              </div>

              <div className="confidence-row"><span>Confidence</span><strong>{detection.confidence}%</strong></div>
              <div className="meter"><span style={{ width: `${detection.confidence}%` }} /></div>

              <div className="meta-grid">
                <div><span>Provider</span><strong>{detection.provider}</strong></div>
                <div><span>Risk</span><strong className={detection.risk === 'Highly sensitive' ? 'danger-text' : ''}>{detection.risk}</strong></div>
              </div>

              <div className="field-list">
                <span className="field-title">Detected fields</span>
                {detection.fields.length ? detection.fields.slice(0, 6).map((field) => (
                  <div className="field-item" key={field}><Check size={14} /> <code>{field}</code></div>
                )) : <div className="empty-state">No structured fields detected yet.</div>}
              </div>

              {(detection.accessToken || detection.refreshToken || detection.apiKey) && (
                <div className="secret-preview">
                  <span>Secret preview</span>
                  <code>{showSecret ? detection.refreshToken ?? detection.accessToken ?? detection.apiKey : mask(detection.refreshToken ?? detection.accessToken ?? detection.apiKey)}</code>
                </div>
              )}
            </div>
          </div>

          <div className="convert-card panel">
            <div className="convert-topline">
              <div>
                <span className="mini-label">EXPORT TARGET</span>
                <div className="target-tabs">
                  {(['Canonical', 'Sub2API', 'New API'] as const).map((item) => (
                    <button key={item} className={target === item ? 'selected' : ''} onClick={() => setTarget(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <button className="copy-button" onClick={copyOutput}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy'}</button>
            </div>
            <pre>{showSecret ? output : output.replace(/("(?:access_token|refresh_token|api_key)":\s*")([^"]+)(")/g, (_match, a, b, c) => `${a}${b === 'null' ? b : mask(b)}${c}`)}</pre>
            {target !== 'Canonical' && <div className="adapter-warning"><CircleAlert size={15} /> Adapter template only. Gateway schemas can change between releases; verify the target version before import.</div>}
          </div>
        </section>

        <section id="formats" className="section-wrap formats-section">
          <div className="section-heading">
            <div><span className="section-index">02</span><h2>Explore Formats</h2></div>
            <p>Separate credentials from wrappers, exchange operations and gateway configuration.</p>
          </div>
          <div className="format-grid">
            {formatCards.map((format) => (
              <article className="format-card" key={format.title}>
                <div className="format-card-top"><span className="format-symbol">◇</span><span className="tiny-pill">{format.risk}</span></div>
                <h3>{format.title}</h3>
                <span className="kicker">{format.kicker}</span>
                <p>{format.description}</p>
                <button className="text-button">Learn model <ArrowRight size={14} /></button>
              </article>
            ))}
          </div>
        </section>

        <section id="compare" className="section-wrap compare-section">
          <div className="section-heading">
            <div><span className="section-index">03</span><h2>Compatibility Matrix</h2></div>
            <p>A conversion can mean local extraction, local wrapping, schema mapping, or a real OAuth exchange.</p>
          </div>
          <div className="matrix-card panel">
            <div className="matrix-scroll">
              <table>
                <thead><tr><th>Source → Target</th><th>AT</th><th>RT</th><th>Sub2API</th><th>New API</th><th>API Key</th></tr></thead>
                <tbody>
                  {compatibility.map((row) => (
                    <tr key={row[0]}>
                      <th>{row[0]}</th>
                      {row.slice(1).map((cell, index) => <td key={`${row[0]}-${index}`}><span className={`matrix-tag ${cell.toLowerCase().replaceAll(' ', '-')}`}>{cell}</span></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="matrix-legend">
              <span><i className="legend local" /> Local transform</span>
              <span><i className="legend exchange" /> Remote exchange</span>
              <span><i className="legend conditional" /> Conditional</span>
              <span><i className="legend impossible" /> Not convertible</span>
            </div>
          </div>
        </section>

        <section id="security" className="section-wrap security-section">
          <div className="security-card">
            <div className="security-icon"><ShieldCheck size={28} /></div>
            <div>
              <span className="section-index">SECURITY MODEL</span>
              <h2>Your secret should stay yours.</h2>
              <p>AuthAtlas is designed as a static site. Parsing, masking and schema normalization happen in browser memory. No server-side conversion endpoint is required.</p>
              <div className="security-points"><span><Check size={14} /> No credential database</span><span><Check size={14} /> No secret analytics</span><span><Check size={14} /> Masked by default</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark"><Network size={15} /></span><span>AuthAtlas</span></div>
        <p>Open-source AI authentication format explorer.</p>
        <span>Built for local-first inspection.</span>
      </footer>
    </div>
  )
}

export default App
