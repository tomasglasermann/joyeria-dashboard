import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import MfaVerification from './pages/MfaVerification'
import PendingApproval from './pages/PendingApproval'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Ventas from './pages/Ventas'
import Proveedores from './pages/Proveedores'
import Oro from './pages/Oro'
import Reportes from './pages/Reportes'
import Comisiones from './pages/Comisiones'
import Usuarios from './pages/Usuarios'

export default function App() {
  return (
    <Routes>
      {/* Public routes — no sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/mfa" element={<MfaVerification />} />
      <Route path="/pendiente" element={<PendingApproval />} />

      {/* Protected routes — with sidebar */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex min-h-screen bg-[#f5f5f7]">
              <Sidebar />
              <main className="ml-[240px] flex-1 px-10 py-8 max-w-[1400px]">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/ventas" element={<Ventas />} />
                  <Route path="/comisiones" element={<Comisiones />} />
                  <Route path="/proveedores" element={<Proveedores />} />
                  <Route path="/oro" element={<Oro />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route path="/usuarios" element={<Usuarios />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
