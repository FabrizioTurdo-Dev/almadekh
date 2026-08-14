import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl mb-4">✦</span>
      <h1 className="text-4xl font-serif font-bold text-almadekh-text mb-2">404</h1>
      <p className="text-sm text-almadekh-muted mb-8 max-w-sm">
        Esta página no existe o fue movida. Volvé al inicio para seguir navegando.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-almadekh-teal hover:bg-almadekh-teal-light text-white font-bold py-3 px-8 rounded-xl transition-all text-sm"
      >
        Volver al Inicio
      </button>
    </div>
  )
}
