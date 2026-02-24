import { useState, useRef, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ShieldCheck, LogOut } from 'lucide-react'

const PIN_LENGTH = 6

export default function PinVerification() {
  const { session, profile, pinVerified, isAdmin, isPending, isRejected, verifyPin, setPin, skipPin, signOut, loading } = useAuth()
  const [digits, setDigits] = useState(Array(PIN_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [checkingPin, setCheckingPin] = useState(true)
  const [confirmDigits, setConfirmDigits] = useState(Array(PIN_LENGTH).fill(''))
  const [step, setStep] = useState('enter') // 'enter' | 'confirm'
  const inputRefs = useRef([])
  const confirmRefs = useRef([])

  // Check if PIN exists
  useEffect(() => {
    const checkPin = async () => {
      if (!session) return
      const result = await verifyPin('')
      if (result.noPinSet && isAdmin) {
        setIsCreating(true)
      } else if (result.noPinSet && !isAdmin) {
        // No PIN set and not admin — skip PIN verification
        skipPin()
      }
      setCheckingPin(false)
    }
    // Run when session exists and profile loaded, OR when loading finished (profile might be null)
    if (session && (profile || !loading)) checkPin()
  }, [session, profile, loading])

  // If not logged in, redirect to login
  if (!loading && !session) {
    return <Navigate to="/login" replace />
  }

  // Block pending/rejected users
  if (!loading && (isPending || isRejected)) {
    return <Navigate to="/pendiente" replace />
  }

  // If already verified, redirect to dashboard
  if (pinVerified) {
    return <Navigate to="/" replace />
  }

  if (loading || checkingPin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-vicenza.png" alt="Vicenza" className="w-16 h-16 object-contain" />
          <div className="w-8 h-8 border-2 border-[#9B7D2E] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const handleDigitChange = (index, value, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const arr = isConfirm ? [...confirmDigits] : [...digits]
    arr[index] = digit
    isConfirm ? setConfirmDigits(arr) : setDigits(arr)
    setError('')

    // Auto-focus next input
    if (digit && index < PIN_LENGTH - 1) {
      const refs = isConfirm ? confirmRefs : inputRefs
      refs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits filled
    if (digit && index === PIN_LENGTH - 1) {
      const pin = arr.join('')
      if (pin.length === PIN_LENGTH) {
        if (isCreating && step === 'enter' && !isConfirm) {
          // Move to confirm step
          setTimeout(() => {
            setStep('confirm')
            setTimeout(() => confirmRefs.current[0]?.focus(), 100)
          }, 200)
        } else if (isCreating && isConfirm) {
          handleCreatePin(digits.join(''), arr.join(''))
        } else {
          handleVerify(pin)
        }
      }
    }
  }

  const handleKeyDown = (index, e, isConfirm = false) => {
    if (e.key === 'Backspace') {
      const arr = isConfirm ? [...confirmDigits] : [...digits]
      if (!arr[index] && index > 0) {
        const refs = isConfirm ? confirmRefs : inputRefs
        refs.current[index - 1]?.focus()
        arr[index - 1] = ''
        isConfirm ? setConfirmDigits(arr) : setDigits(arr)
      }
    }
  }

  const handleVerify = async (pin) => {
    setSubmitting(true)
    const result = await verifyPin(pin)
    if (!result.success) {
      setError(result.error)
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setDigits(Array(PIN_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }, 500)
    }
    setSubmitting(false)
  }

  const handleCreatePin = async (pin, confirm) => {
    if (pin !== confirm) {
      setError('Los PINs no coinciden')
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setConfirmDigits(Array(PIN_LENGTH).fill(''))
        setStep('enter')
        setDigits(Array(PIN_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }, 500)
      return
    }
    setSubmitting(true)
    const { error: err } = await setPin(pin)
    if (err) {
      setError(err)
    }
    setSubmitting(false)
  }

  const renderPinInputs = (values, refs, isConfirm = false) => (
    <div className={`flex gap-2.5 justify-center ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      {values.map((digit, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitChange(i, e.target.value, isConfirm)}
          onKeyDown={(e) => handleKeyDown(i, e, isConfirm)}
          className="w-12 h-14 text-center text-[22px] font-bold text-[#1d1d1f] bg-[#f5f5f7] rounded-xl outline-none focus:ring-2 focus:ring-[#9B7D2E] transition-all"
          autoFocus={i === 0 && !isConfirm}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#9B7D2E]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-[#9B7D2E]" />
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
            {isCreating ? 'Crear PIN de Seguridad' : 'Verificacion de Seguridad'}
          </h1>
          <p className="text-[13px] text-[#48484a] mt-1">
            {isCreating
              ? step === 'confirm'
                ? 'Confirma tu PIN de 6 digitos'
                : 'Crea un PIN de 6 digitos para proteger el dashboard'
              : 'Ingresa el PIN de acceso'}
          </p>
        </div>

        {/* PIN Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isCreating && step === 'confirm' ? (
            <>
              <p className="text-[12px] font-semibold text-[#48484a] uppercase tracking-wider text-center mb-4">
                Confirmar PIN
              </p>
              {renderPinInputs(confirmDigits, confirmRefs, true)}
            </>
          ) : (
            <>
              <p className="text-[12px] font-semibold text-[#48484a] uppercase tracking-wider text-center mb-4">
                {isCreating ? 'Nuevo PIN' : 'PIN de Acceso'}
              </p>
              {renderPinInputs(digits, inputRefs)}
            </>
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
