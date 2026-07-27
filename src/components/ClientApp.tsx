import App from '../App'
import QaSafetyBoundary from '../QaSafetyBoundary'

export default function ClientApp() {
  return (
    <QaSafetyBoundary>
      <App />
    </QaSafetyBoundary>
  )
}
