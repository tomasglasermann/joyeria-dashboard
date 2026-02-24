import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Clock, XCircle, LogOut, RefreshCw } from 'lucide-react'

export default function PendingApproval() {
  const { session, status, isApproved, signOut, loading, refreshProfile } = useAuth()
  const [checking, setChecking] = useState(false)

  // If not logged in, redirect to login
  if (!loading && !session) {
    return <Navigate to="/login" replace />
  }

  // If already approved, redirect to MFA
  if (!loading && isApproved) {
    return <Navigate to="/mfa" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo-vicenza.png" alt="Vicenza" className="w-16 h-16 object-contain" />
          <div className="w-8 h-8 border-2 border-[#9B7D2E] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const isRejected = status === 'rejected'

  const handleRefresh = async () => {
    setChecking(true)
    await refreshProfile()
    setChecking(false)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Icon & Title */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: isRejected ? '#FEECEC' : '#FFF8E7' }}
          >
            {isRejected ? (
              <XCircle className="w-8 h-8 text-[#FF3B30]" />
            ) : (
              <Clock className="w-8 h-8 text-[#9B7D2E]" />
            )}
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#1d1d1f]">
            {isRejected ? 'Solicitud Rechazada' : 'Cuenta Pendiente'}
          </h1>
          <p className="text-[13px] text-[#48484a] mt-1">
            {isRejected
              ? 'Tu solicitud de acceso fue rechazada por un administrador.'
              : 'Tu cuenta esta pendiente de aprobacion por un administrador.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {isRejected ? (
            <div className="text-center">
              <p className="text-[13px] text-[#48484a]">
                Si crees que esto fue un error, contacta al administrador del dashboard.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF8E7] rounded-full">
                  <div className="w-2 h-2 bg-[#FF9500] rounded-full animate-pulse" />
                  <span className="text-[12px] font-semibold text-[#9B7D2E]">Esperando aprobacion</span>
                </div>
              </div>
              <p className="text-[13px] text-[#48484a] text-center mb-5">
                Un administrador revisara tu solicitud y aprobara tu acceso al dashboard.
              </p>
              <button
                onClick={handleRefresh}
                disabled={checking}
                className="w-full py-2.5 bg-[#9B7D2E] text-white text-[13px] font-semibold rounded-xl hover:bg-[#7A6222] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {checking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Verificar de nuevo
                  </>
                )}
              </button>
            </>
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
    </div>
  )
}
