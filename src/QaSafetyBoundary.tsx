import { useEffect, type PropsWithChildren } from 'react'

function hasRecognizedCredential(root: ParentNode) {
  const rows = Array.from(root.querySelectorAll<HTMLElement>('.converter-page .validation-row'))
  const row = rows.find((item) => item.textContent?.includes('Recognized credential'))
  return row?.querySelector('strong')?.textContent?.trim() === 'Yes'
}

function setButtonState(button: HTMLButtonElement | null, disabled: boolean, disabledTitle: string) {
  if (!button) return
  button.disabled = disabled
  button.setAttribute('aria-disabled', String(disabled))
  if (disabled) button.title = disabledTitle
  else button.removeAttribute('title')
}

function setConverterSafety(root: HTMLElement) {
  const converter = root.querySelector<HTMLElement>('.converter-page')
  if (!converter) return

  const canExport = hasRecognizedCredential(converter)
  setButtonState(converter.querySelector<HTMLButtonElement>('.convert-button'), !canExport, 'Paste a recognized credential first')
  setButtonState(converter.querySelector<HTMLButtonElement>('.output-card .workspace-head button'), !canExport, 'Nothing safe to copy yet')

  converter.querySelectorAll<HTMLButtonElement>('.export-actions button').forEach((button) => {
    setButtonState(button, !canExport, 'Paste a recognized credential before exporting')
  })

  converter.querySelectorAll<HTMLElement>('.secret-row').forEach((row) => {
    const empty = row.querySelector('code')?.textContent?.trim() === '—'
    setButtonState(row.querySelector<HTMLButtonElement>('button'), empty, 'No value available')
  })
}

function setStatusAccessibility(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.window-foot > span:first-child, .workspace-status > span:first-child').forEach((status) => {
    status.setAttribute('role', 'status')
    status.setAttribute('aria-live', 'polite')
    status.setAttribute('aria-atomic', 'true')
  })

  root.querySelectorAll<HTMLTextAreaElement>('textarea').forEach((textarea) => {
    textarea.setAttribute('autocomplete', 'off')
    textarea.setAttribute('autocapitalize', 'off')
    textarea.setAttribute('data-1p-ignore', 'true')
  })
}

function setFormatsAccessibility(root: HTMLElement) {
  const page = root.querySelector<HTMLElement>('.formats-page')
  if (!page) return

  const input = page.querySelector<HTMLInputElement>('.search-box input')
  const pane = page.querySelector<HTMLElement>('.format-list-pane')
  if (!input || !pane) return

  pane.id = 'format-results'
  pane.setAttribute('aria-live', 'polite')
  input.setAttribute('aria-label', 'Search authentication formats')
  input.setAttribute('aria-controls', pane.id)

  const results = pane.querySelectorAll<HTMLButtonElement>('.format-list-item')
  pane.dataset.empty = results.length === 0 ? 'true' : 'false'

  results.forEach((button) => {
    const title = button.querySelector('strong')?.textContent?.trim() || 'format'
    button.setAttribute('aria-label', `Show ${title} details`)
    button.setAttribute('aria-pressed', String(button.classList.contains('selected')))
  })

  page.querySelectorAll<HTMLButtonElement>('.category-item').forEach((button) => {
    const active = button.classList.contains('active')
    button.setAttribute('aria-pressed', String(active))
    if (!active) {
      button.setAttribute('aria-disabled', 'true')
      button.title = 'Category filtering is not available in this build'
    }
  })

  const shortcut = page.querySelector<HTMLElement>('.search-box kbd')
  if (shortcut) {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
    shortcut.textContent = isMac ? '⌘ K' : 'Ctrl K'
  }
}

function setCompareAccessibility(root: HTMLElement) {
  const page = root.querySelector<HTMLElement>('.compare-page')
  if (!page) return

  const selectedKind = page.querySelector<HTMLElement>('.selected-path .path-kind')
  const pathLabels = Array.from(page.querySelectorAll<HTMLElement>('.selected-path .path-display strong')).map((node) => node.textContent?.trim() || '')
  const [selectedSource, selectedTarget] = pathLabels
  const impossible = selectedKind?.classList.contains('impossible') ?? false

  const cta = page.querySelector<HTMLAnchorElement>('.selected-path > a.button.primary')
  if (cta) {
    if (impossible) {
      cta.removeAttribute('href')
      cta.setAttribute('aria-disabled', 'true')
      cta.tabIndex = -1
      cta.title = 'No direct conversion path is available'
    } else {
      cta.href = '#/converter'
      cta.setAttribute('aria-disabled', 'false')
      cta.tabIndex = 0
      cta.removeAttribute('title')
    }
  }

  const headers = Array.from(page.querySelectorAll<HTMLTableCellElement>('.matrix-wrap thead th')).slice(1)
  page.querySelectorAll<HTMLTableRowElement>('.matrix-wrap tbody tr').forEach((row) => {
    const source = row.querySelector('th')?.textContent?.trim() || 'Unknown source'
    row.querySelectorAll<HTMLTableCellElement>('td').forEach((cell, index) => {
      const button = cell.querySelector<HTMLButtonElement>('button')
      if (!button) return
      const target = headers[index]?.textContent?.trim() || 'Unknown target'
      const kind = button.textContent?.trim() || 'Unknown path'
      button.setAttribute('aria-label', `${source} to ${target}: ${kind}`)
      button.setAttribute('aria-pressed', String(source === selectedSource && target === selectedTarget))
    })
  })
}

export default function QaSafetyBoundary({ children }: PropsWithChildren) {
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return

    const sync = () => {
      setConverterSafety(root)
      setStatusAccessibility(root)
      setFormatsAccessibility(root)
      setCompareAccessibility(root)
    }

    const onShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return
      const input = root.querySelector<HTMLInputElement>('.formats-page .search-box input')
      if (!input) return
      event.preventDefault()
      input.focus()
      input.select()
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] })
    window.addEventListener('hashchange', sync)
    window.addEventListener('keydown', onShortcut)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('keydown', onShortcut)
    }
  }, [])

  return children
}
