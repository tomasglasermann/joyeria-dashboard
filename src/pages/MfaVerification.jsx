import { useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldCheck, LogOut, Smartphone, QrCode } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CODE_LENGTH = 6

export default function MfaVerification() {
  const {
    session, profile, mfaVerified, mfaEnrolled, isAdmin, isPending, isRejected,
    enrollMfa, verifyMfa, signOut, loading
  } = useAuth()

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)

  // Enrollment state
  const [enrolling, setEnrolling] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [factorId, setFactorId] = useState(null)
  const [secret, setSecret] = useState(null)

  // For existing MFA login
  const [existingFactorId, setExistingFactorId] = useState(null)

  const inputRefs = useRef([])

  // Determine MFA state on mount
  useEffect(() => {
    const init = async () => {
      if (!session) return

      // Check if user has MFA factors
      const { data } = await supabase.auth.mfa.listFactors()
      if (data) {
        const totp = data.totp || []
        const verified = totp.filter(f => f.status === 'verified')
        const unverified = totp.filter(f => f.status === 'unverified')

        if (verified.length > 0) {
          // User has MFA — need to verify
          setExistingFactorId(verified[0].id)
        } else {
          // Clean up any unverified factors before enrolling
          for (const factor of unverified) {
            try {
              await supabase.auth.mfa.unenroll({ factorId: factor.id })
            } catch (e) {
              console.warn('Could not unenroll factor:', e)
            }
          }
          // Enroll — enrollMfa handles cleanup internally too
          setEnrolling(true)
          await startEnrollment()
        }
      }
      setChecking(false)
    }

    if (session && (profile || !loading)) init()
  }, [session, profile, loading])

  const startEnrollment = async () => {
    const result = await enrollMfa()
    if (result.error) {
      setError(result.error)
    } else {
      setQrCode(result.data.totp.qr_code)
      setFactorId(result.data.id)
      setSecret(result.data.totp.secret)
    }
  }

  // Redirect logic
  if (!loading && !session) {
    return <Navigate to="/login" replace />
  }
  if (!loading && (isPending || isRejected)) {
    return <Navigate to="/pendiente" replace />
  }
  if (mfaVerified) {
    return <Navigate to="/" replace />
  }

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-vicenza.png" alt="Vicenza" className="w-16 h-16 object-contain" />
          <div className="w-8 h-8 border-2 border-[#9B7D2E] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const arr = [...digits]
    arr[index] = digit
    setDigits(arr)
    setError('')

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits filled
    if (digit && index === CODE_LENGTH - 1) {
      const code = arr.join('')
      if (code.length === CODE_LENGTH) {
        handleVerify(code)
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const arr = [...digits]
      if (!arr[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
        arr[index - 1] = ''
        setDigits(arr)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (pasted.length > 0) {
      const arr = Array(CODE_LENGTH).fill('')
      pasted.split('').forEach((d, i) => { arr[i] = d })
      setDigits(arr)
      if (pasted.length === CODE_LENGTH) {
        handleVerify(pasted)
      } else {
        inputRefs.current[pasted.length]?.focus()
      }
    }
  }

  const handleVerify = async (code) => {
    setSubmitting(true)
    const fId = enrolling ? factorId : existingFactorId
    const result = await verifyMfa(fId, code)
    if (result.error) {
      setError(result.error.includes('invalid') ? 'Codigo incorrecto' : result.error)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setDigits(Array(CODE_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }, 500)
    }
    setSubmitting(false)
  }

  const renderCodeInputs = () => (
    <div
      className={`flex gap-2.5 justify-center ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
      onPaste={handlePaste}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-[22px] font-bold text-[#1d1d1f] bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E] transition-all"
          autoFocus={i === 0}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#9B7D2E]/10 flex items-center justify-center mx-auto mb-4">
            {enrolling ? (
              <QrCode className="w-8 h-8 text-[#9B7D2E]" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-[#9B7D2E]" />
            )}
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
            {enrolling ? 'Configurar Authenticator' : 'Verificacion de Seguridad'}
          </h1>
          <p className="text-[13px] text-[#48484a] mt-1">
            {enrolling
              ? 'Escanea el codigo QR con tu app de authenticator'
              : 'Ingresa el codigo de tu app de authenticator'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {enrolling && qrCode ? (
            <>
              {/* QR Code for enrollment */}
              <div className="flex justify-center mb-5">
                <div className="p-3 bg-white rounded-xl border border-[#e5e5ea]">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#9B7D2E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p className="text-[12px] text-[#48484a]">Abre Google Authenticator o Authy en tu celular</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#9B7D2E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p className="text-[12px] text-[#48484a]">Escanea el codigo QR de arriba</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#9B7D2E] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p className="text-[12px] text-[#48484a]">Ingresa el codigo de 6 digitos que te aparece</p>
                </div>
              </div>

              {/* Manual key fallback */}
              {secret && (
                <div className="mb-5 p-2.5 bg-[#f5f5f7] rounded-xl">
                  <p className="text-[10px] text-[#48484a] text-center mb-1">Clave manual (si no puedes escanear)</p>
                  <p className="text-[12px] font-mono font-semibold text-[#1d1d1f] text-center tracking-wider break-all">{secret}</p>
                </div>
              )}

              <p className="text-[12px] font-semibold text-[#48484a] uppercase tracking-wider text-center mb-4">
                Codigo de Verificacion
              </p>
              {renderCodeInputs()}
            </>
          ) : !enrolling && existingFactorId ? (
            <>
              {/* Existing MFA — just enter code */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-[#9B7D2E]" />
                </div>
              </div>
              <p className="text-[12px] font-semibold text-[#48484a] uppercase tracking-wider text-center mb-4">
                Codigo de Authenticator
              </p>
              {renderCodeInputs()}
            </>
          ) : (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-[#9B7D2E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="mt-4 px-3 py-2.5 bg-[#FEECEC] rounded-xl">
              <p className="text-[13px] text-[#FF3B30] font-medium text-center">{error}</p>
            </div>
          )}

          {submitting && (
            <div className="flex justify-center mt-4">
              <div className="w-5 h-5 border-2 border-[#9B7D2E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="text-center mt-5">
          <button
            onClick={signOut}
            className="text-[13px] text-[#48484a] font-medium hover:text-[#FF3B30] transition-colors flex items-center gap-1.5 mx-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesion
          </button>
        </div>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
