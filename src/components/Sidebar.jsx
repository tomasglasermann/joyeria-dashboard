import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  CircleDollarSign,
  FileBarChart,
  Users,
  Shield,
  LogOut,
  Gem,
  Settings,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useRole } from '../hooks/useRole'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/inventario', icon: Gem, label: 'Inventario' },
  { to: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  { to: '/comisiones', icon: Users, label: 'Comisiones' },
  { to: '/proveedores', icon: Truck, label: 'Proveedores' },
  { to: '/oro', icon: CircleDollarSign, label: 'Oro' },
  { to: '/reportes', icon: FileBarChart, label: 'Reportes' },
]

const ROLE_LABELS = {
  admin: { label: 'Admin', color: '#9B7D2E', bg: '#FFF8E7' },
  editor: { label: 'Editor', color: '#5B8DB8', bg: '#EDF4FB' },
  viewer: { label: 'Vista', color: '#48484a', bg: '#f5f5f7' },
}

export default function Sidebar() {
  const { profile, signOut } = useAuth()
  const { role, can } = useRole()
  const roleInfo = ROLE_LABELS[role] || ROLE_LABELS.viewer

  const initials = profile?.display_name
    ? profile.display_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white/80 backdrop-blur-xl border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5">
        <div className="flex items-center gap-3">
          <img src="/logo-vicenza.png" alt="Vicenza Miami" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">Vicenza</h1>
            <p className="text-[11px] text-[#48484a] font-medium">Dashboard Gerencial</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#f5f5f7] text-[#1d1d1f] shadow-sm'
                  : 'text-[#48484a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]/60'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}

        {/* Usuarios — Admin only */}
        {can('manage_users') && (
          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#f5f5f7] text-[#1d1d1f] shadow-sm'
                  : 'text-[#48484a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]/60'
              }`
            }
          >
            <Shield className="w-[18px] h-[18px]" strokeWidth={1.8} />
            Usuarios
          </NavLink>
        )}

        {/* Configuracion */}
        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#f5f5f7] text-[#1d1d1f] shadow-sm'
                : 'text-[#48484a] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]/60'
            }`
          }
        >
          <Settings className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Configuracion
        </NavLink>
      </nav>

      {/* User Info */}
      <div className="px-4 pb-5 space-y-3">
        {/* User Card */}
        <div className="px-3 py-3 rounded-xl bg-[#f5f5f7]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: roleInfo.color }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#1d1d1f] truncate">
                {profile?.display_name || 'Usuario'}
              </p>
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md mt-0.5"
                style={{ color: roleInfo.color, backgroundColor: roleInfo.bg }}
              >
                {roleInfo.label}
              </span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-[#48484a] hover:text-[#FF3B30] rounded-lg hover:bg-white/60 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Cerrar sesion
          </button>
        </div>
      </div>
    </aside>
  )
}
