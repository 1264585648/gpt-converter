import { useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Box,
  ExternalLink,
  Grid2X2,
  KeyRound,
  LockKeyhole,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { credentialFormats, type FormatSlug } from '../content/formats'

type FormatUiMeta = {
  icon: LucideIcon
  tone: 'green' | 'violet' | 'amber' | 'blue' | 'pink'
  tags: string[]
}

const formatUiMeta: Record<FormatSlug, FormatUiMeta> = {
  'access-token': { icon: KeyRound, tone: 'green', tags: ['OAuth 2.0', 'Bearer'] },
  'refresh-token': { icon: RefreshCw, tone: 'violet', tags: ['OAuth 2.0', 'Sensitive'] },
  'api-key': { icon: KeyRound, tone: 'amber', tags: ['API Key', 'Sensitive'] },
  sub2api: { icon: Network, tone: 'blue', tags: ['Gateway', 'Versioned'] },
  'new-api': { icon: Sparkles, tone: 'pink', tags: ['Gateway', 'Channel'] },
  canonical: { icon: Box, tone: 'violet', tags: ['Canonical', 'Local'] },
}

const formatItems = credentialFormats.map((format) => ({
  ...format,
  ...formatUiMeta[format.slug],
}))

function Brand() {
  return (
    <a className="brand" href="/" aria-label="AuthAtlas home">
      <span className="brand-glyph"><i /><b /></span>
      <span>AuthAtlas</span>
    </a>
  )
}

function Header() {
  return (
    <header className="topbar">
      <div className="nav-inner">
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          <a className="active" href="/formats">Formats</a>
          <a href="/converter">Converter</a>
          <a href="/compare">Compare</a>
          <a href="/security">Security</a>
          <a href="/guides">Guides</a>
          <a href="https://github.com/1264585648/gpt-converter" target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={13} />
          </a>
        </nav>
      </div>
    </header>
  )
}

function Category({ active, title, copy, count, icon }: { active?: boolean; title: string; copy: string; count: string; icon: ReactNode }) {
  return (
    <button className={`category-item ${active ? 'active' : ''}`} type="button">
      <span>{icon}</span>
      <span><strong>{title}</strong><small>{copy}</small></span>
      <i>{count}</i>
    </button>
  )
}

function FlowStep({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return <div className="flow-step"><span>{icon}</span><strong>{title}</strong><small>{copy}</small></div>
}

function Glance({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return <div className="glance-row"><span>{label}</span><strong className={danger ? 'danger-text' : ''}>{value}</strong></div>
}

function InfoTile({ title, children }: { title: string; children: ReactNode }) {
  return <section className="info-tile"><strong>{title}</strong>{children}</section>
}

export default function FormatsWorkspace() {
  const [selected, setSelected] = useState<FormatSlug>('refresh-token')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return formatItems

    return formatItems.filter((item) => [
      item.title,
      item.shortDescription,
      item.definition,
      ...item.tags,
      ...item.fields,
    ].join(' ').toLowerCase().includes(normalizedQuery))
  }, [query])

  const item = formatItems.find((entry) => entry.slug === selected) ?? formatItems[1]
  const Icon = item.icon
  const isRefreshToken = item.slug === 'refresh-token'

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <Header />

      <main className="page-shell inner-page formats-page">
        <section className="content-width formats-heading">
          <div>
            <span className="knowledge-pill"><Box size={13} /> Knowledge</span>
            <h1>Explore <span>Authentication Formats</span></h1>
            <p>Learn the purpose, sensitivity, compatibility, and security model of common AI credential formats.</p>
          </div>
          <label className="search-box">
            <Search />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search formats, fields, or concepts..."
            />
            <kbd>⌘ K</kbd>
          </label>
        </section>

        <section className="content-width formats-layout">
          <aside className="category-rail">
            <strong>Browse by category</strong>
            <Category active title="Authentication" copy="Tokens, keys & credentials" count="3" icon={<KeyRound />} />
            <Category title="Gateway Formats" copy="Versioned gateway wrappers" count="2" icon={<Network />} />
            <Category title="Canonical Model" copy="Normalized local representation" count="1" icon={<Box />} />
            <Category title="Security Concepts" copy="Lifecycle & handling guidance" count="5" icon={<ShieldCheck />} />

            <strong className="filter-title">Filter by tags</strong>
            <div className="tag-cloud">
              <span>OAuth 2.0&nbsp; 2</span>
              <span>Sensitive&nbsp; 2</span>
              <span>Gateway&nbsp; 2</span>
              <span>API Key&nbsp; 1</span>
              <span>Sub2API&nbsp; 1</span>
              <span>New API&nbsp; 1</span>
              <span>Canonical&nbsp; 1</span>
            </div>

            <div className="rail-callout">
              <Zap />
              <strong>Not sure what a format is?</strong>
              <p>Formats define how credential material is structured, transported, stored, and mapped.</p>
              <a href="/security">Learn the basics <ArrowRight /></a>
            </div>
          </aside>

          <div className="format-list-pane">
            <div className="list-toolbar">
              <span>Show <Grid2X2 /> ≡</span>
              <small>Showing {filtered.length} of {formatItems.length} formats</small>
            </div>

            {filtered.map((entry) => {
              const RowIcon = entry.icon
              return (
                <button
                  className={`format-list-item ${selected === entry.slug ? 'selected' : ''}`}
                  key={entry.slug}
                  type="button"
                  onClick={() => setSelected(entry.slug)}
                >
                  <span className={`format-list-icon tone-${entry.tone}`}><RowIcon /></span>
                  <span className="format-list-copy">
                    <strong>{entry.title}</strong>
                    <small>{entry.shortDescription}</small>
                    <span>{entry.tags.map((tag) => <i key={tag}>{tag}</i>)}</span>
                  </span>
                  <ArrowRight />
                </button>
              )
            })}
          </div>

          <article className="format-detail">
            <div className="detail-header">
              <div>
                <span className={`detail-icon tone-${item.tone}`}><Icon /></span>
                <span>
                  <h2>{item.title} <i>{item.sensitivity}</i></h2>
                  <div className="detail-tags">{item.tags.map((tag) => <b key={tag}>{tag}</b>)}</div>
                </span>
              </div>
              <div className="detail-actions-inline">
                <a className="button secondary purple-outline" href={`/formats/${item.slug}`}>
                  <Box /> Read Docs
                </a>
                <a className="button secondary purple-outline" href="/converter">
                  <Zap /> Open in Converter
                </a>
              </div>
            </div>

            <p className="detail-intro">{item.definition}</p>

            <div className="detail-primary-grid">
              <div className="lifecycle-card">
                <strong>{isRefreshToken ? 'Lifecycle:' : 'Workflow:'} <span>How it works</span></strong>
                <div className="lifecycle-flow">
                  {isRefreshToken ? (
                    <>
                      <FlowStep icon={<User />} title="Login" copy="User authenticates with the provider" />
                      <ArrowRight />
                      <FlowStep icon={<LockKeyhole />} title="Access Token + Refresh Token" copy="Access token handles API calls while the refresh token is retained securely" />
                      <ArrowRight />
                      <FlowStep icon={<RefreshCw />} title="New Access Token" copy="Exchange the refresh token through the provider token endpoint" />
                    </>
                  ) : (
                    <>
                      <FlowStep icon={<Icon />} title={item.title} copy="Inspect the source format and fields" />
                      <ArrowRight />
                      <FlowStep icon={<Box />} title="Canonical" copy="Normalize existing credential material locally" />
                      <ArrowRight />
                      <FlowStep icon={<Network />} title="Target schema" copy="Map only when the target supports the required fields" />
                    </>
                  )}
                </div>
                <div className="tip-line">
                  <ShieldCheck />
                  {isRefreshToken
                    ? 'Tip: Rotation is recommended where the provider supports it.'
                    : 'Tip: Never fabricate secret fields that are absent from the source.'}
                </div>
              </div>

              <div className="glance-card">
                <strong>At a glance</strong>
                <Glance label="Sensitivity" value={item.sensitivity} danger={item.sensitivity !== 'Low'} />
                <Glance label="Typical lifetime" value={item.lifetime} />
                <Glance label="Used for" value={item.usedFor} />
                <Glance label="Transport" value={item.transport} />
                <Glance label="Revocable" value={item.revocable} />
                <Glance label="Rotation" value={item.rotation} />
                <Glance label="Store" value={item.storage} />
              </div>
            </div>

            <div className="detail-bottom-grid">
              <InfoTile title="What it is">
                <p>{item.definition}</p>
                <a href={`/formats/${item.slug}`}>Read full documentation <ArrowRight /></a>
              </InfoTile>
              <InfoTile title="Typical fields">
                <pre>{item.fields.join('\n')}</pre>
              </InfoTile>
              <InfoTile title="Can convert to">
                <p>{item.conversions}</p>
                <a className="chip purple" href="/compare"><Box /> Compatibility Matrix</a>
              </InfoTile>
              <InfoTile title="Security notes">
                <ul>{item.security.map((note) => <li key={note}>{note}</li>)}</ul>
              </InfoTile>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}
