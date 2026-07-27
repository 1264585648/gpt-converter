import App from '../App'
import QaSafetyBoundary from '../QaSafetyBoundary'
import FormatsWorkspace from './FormatsWorkspace'

function isFormatsRoute() {
  if (typeof window === 'undefined') return false
  return (window.location.pathname.replace(/\/+$/, '') || '/') === '/formats'
}

export default function ClientApp() {
  return (
    <QaSafetyBoundary>
      {isFormatsRoute() ? <FormatsWorkspace /> : <App />}
    </QaSafetyBoundary>
  )
}
