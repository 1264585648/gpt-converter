import App from '../App'
import QaSafetyBoundary from '../QaSafetyBoundary'
import FormatsWorkspace from './FormatsWorkspace'

function isFormatsRoute() {
  if (typeof window === 'undefined') return false

  const legacyRoute = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  if (legacyRoute === 'formats') {
    window.history.replaceState(null, '', `/formats${window.location.search}`)
    return true
  }

  return (window.location.pathname.replace(/\/+$/, '') || '/') === '/formats'
}

export default function ClientApp() {
  return (
    <QaSafetyBoundary>
      {isFormatsRoute() ? <FormatsWorkspace /> : <App />}
    </QaSafetyBoundary>
  )
}
