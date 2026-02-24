import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'

export default function Login() {
  const { session, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const { signIn, signUp } = useAuth()

  // If already logged in, redirect to MFA
  if (!loading && session) {
    return <Navigate to="/mfa" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)

    if (isSignUp) {
      if (!displayName.trim()) {
        setError('Ingresa tu nombre')
        setSubmitting(false)
        return
      }
      if (password.length < 6) {
        setError('La contrasena debe tener al menos 6 caracteres')
        setSubmitting(false)
        return
      }
      const { error: err } = await signUp(email, password, displayName.trim())
      if (err) {
        setError(err.message)
      } else {
        setSuccessMsg('Cuenta creada exitosamente. Tu solicitud esta pendiente de aprobacion.')
      }
    } else {
      const { error: err } = await signIn(email, password)
      if (err) {
        if (err.message.includes('Invalid login')) {
          setError('Email o contrasena incorrectos')
        } else {
          setError(err.message)
        }
      }
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <img src="/logo-vicenza.png" alt="Vicenza Miami" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">Vicenza Miami</h1>
          <p className="text-[13px] text-[#48484a] mt-1">Dashboard Gerencial</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesion'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                  Nombre
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="mt-1.5 w-full px-3 py-2.5 bg-[#f5f5f7] rounded-xl text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 placeholder:text-[#aeaeb2] transition-all"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="mt-1.5 w-full px-3 py-2.5 bg-[#f5f5f7] rounded-xl text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 placeholder:text-[#aeaeb2] transition-all"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">
                Contrasena
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-[#f5f5f7] rounded-xl text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 placeholder:text-[#aeaeb2] pr-10 transition-all"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aeaeb2] hover:text-[#48484a] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-3 py-2.5 bg-[#FEECEC] rounded-xl">
                <p className="text-[13px] text-[#FF3B30] font-medium">{error}</p>
              </div>
            )}

            {successMsg && (
              <div className="px-3 py-2.5 bg-[#E8F8EC] rounded-xl">
                <p className="text-[13px] text-[#34C759] font-medium">{successMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#9B7D2E] text-white text-[14px] font-semibold rounded-xl hover:bg-[#7A6222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                <><UserPlus className="w-4 h-4" /> Crear Cuenta</>
              ) : (
                <><LogIn className="w-4 h-4" /> Iniciar Sesion</>
              )}
            </button>
          </form>

          {isSignUp && (
            <div className="mt-4 p-3 rounded-xl bg-[#f5f5f7]">
              <p className="text-[12px] text-[#48484a]">
                Solo puedes registrarte si un administrador ha autorizado tu email previamente.
              </p>
            </div>
          )}

          <div className="mt-5 text-center">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg('') }}
              className="text-[13px] text-[#007AFF] font-medium hover:underline"
            >
              {isSignUp ? 'Ya tienes cuenta? Inicia sesion' : 'No tienes cuenta? Registrate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
