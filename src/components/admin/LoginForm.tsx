import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export function LoginForm() {
  const { loading, login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (result.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-svh flex flex-col justify-center px-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-almadekh-teal mb-1">
          Alma Dekh
        </h2>
        <p className="text-sm text-almadekh-muted">Panel de Administración</p>
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-almadekh-surface border border-almadekh-border rounded-2xl p-6 max-w-sm mx-auto w-full"
      >
        <label htmlFor="admin-email" className="text-xs text-almadekh-muted block mb-1.5">Email</label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@almadekh.com"
          autoComplete="username"
          className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-3 text-sm text-almadekh-text placeholder-almadekh-subdued mb-3"
          autoFocus
          required
        />
        <label htmlFor="admin-password" className="text-xs text-almadekh-muted block mb-1.5">Contraseña</label>
        <div className="relative mb-3">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
            autoComplete="current-password"
            className="w-full bg-almadekh-surface border border-almadekh-border rounded-xl px-4 py-3 pr-11 text-sm text-almadekh-text placeholder-almadekh-subdued"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-almadekh-muted hover:text-almadekh-text"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && (
          <p role="alert" className="text-status-pending text-xs mb-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-almadekh-teal hover:bg-almadekh-teal-light text-almadekh-bg font-bold py-3 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
