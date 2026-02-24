import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, mfaVerified, loading, isPending, isRejected } = useAuth()
  const location = useLocation()

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

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Block pending/rejected users from accessing the app
  if (isPending || isRejected) {
    return <Navigate to="/pendiente" replace />
  }

  if (!mfaVerified) {
    return <Navigate to="/mfa" replace />
  }

  return children
}
