import { lazy, Suspense } from 'react'
import QaSafetyBoundary from '../QaSafetyBoundary'

const WorkbenchApp = lazy(() => import('../App'))
const FormatsWorkspace = lazy(() => import('./FormatsWorkspace'))

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
  const formatsRoute = isFormatsRoute()

  return (
    <QaSafetyBoundary>
      <Suspense fallback={null}>
        {formatsRoute ? <FormatsWorkspace /> : <WorkbenchApp />}
      </Suspense>
    </QaSafetyBoundary>
  )
}
