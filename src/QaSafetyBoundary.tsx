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

export default function QaSafetyBoundary({ children }: PropsWithChildren) {
  useEffect(() => {
    const root = document.getElementById('root')
    if (!root) return

    const sync = () => {
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

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { childList: true, subtree: true, characterData: true })
    window.addEventListener('hashchange', sync)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  return children
}
