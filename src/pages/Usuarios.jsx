import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Shield, Users, Clock, Mail, Trash2, CheckCircle, XCircle, UserPlus, Key } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useRole } from '../hooks/useRole'
import { supabase } from '../lib/supabase'

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', color: '#9B7D2E', bg: '#FFF8E7' },
  { value: 'editor', label: 'Editor', color: '#5B8DB8', bg: '#EDF4FB' },
  { value: 'viewer', label: 'Vista', color: '#48484a', bg: '#f5f5f7' },
]

export default function Usuarios() {
  const { profile, isAdmin } = useAuth()
  const { can } = useRole()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMsg, setInviteMsg] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [allowedEmails, setAllowedEmails] = useState([])
  const [loadingEmails, setLoadingEmails] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(null) // { id, name }

  const hasAccess = can('manage_users')

  useEffect(() => {
    if (hasAccess) {
      fetchUsers()
      fetchAllowedEmails()
    }
  }, [hasAccess])

  // Redirect non-admins (after all hooks)
  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: true })

    if (data) setUsers(data)
    if (error) console.error('Error fetching users:', error)
    setLoading(false)
  }

  const fetchAllowedEmails = async () => {
    const { data, error } = await supabase
      .from('allowed_emails')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setAllowedEmails(data)
    if (error) console.error('Error fetching allowed emails:', error)
    setLoadingEmails(false)
  }

  const handleInvite = async () => {
    setInviteMsg('')
    setInviteError('')
    const email = inviteEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      setInviteError('Ingresa un email valido')
      return
    }
    const { error } = await supabase
      .from('allowed_emails')
      .insert({ email, invited_by: profile.id })

    if (error) {
      if (error.code === '23505') {
        setInviteError('Este email ya esta en la lista')
      } else {
        setInviteError('Error al invitar: ' + error.message)
      }
    } else {
      setInviteMsg('Email autorizado correctamente')
      setInviteEmail('')
      fetchAllowedEmails()
    }
  }

  const handleRemoveAllowed = async (id) => {
    await supabase.from('allowed_emails').delete().eq('id', id)
    setAllowedEmails(allowedEmails.filter(e => e.id !== id))
  }

  const handleApprove = async (userId) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'approved' })
      .eq('id', userId)

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'approved' } : u))
    }
  }

  const handleReject = async (userId) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'rejected' })
      .eq('id', userId)

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'rejected' } : u))
    }
  }

  const updateRole = async (userId, newRole) => {
    // Prevent self-demotion if only admin
    if (userId === profile?.id && newRole !== 'admin') {
      const admins = users.filter(u => u.role === 'admin' && u.status === 'approved')
      if (admins.length <= 1) {
        alert('No puedes quitarte el rol de admin siendo el unico admin.')
        return
      }
    }

    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
  }


  const handleDelete = async (userId) => {
    // Call RPC to delete user from auth + profiles
    const { error } = await supabase.rpc('delete_user', { user_id: userId })
    if (error) {
      // Fallback: try deleting just the profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)
      if (profileError) {
        alert('Error al eliminar: ' + profileError.message)
        return
      }
    }
    // Also remove from allowed_emails
    const deletedUser = users.find(u => u.id === userId)
    if (deletedUser?.email) {
      await supabase.from('allowed_emails').delete().eq('email', deletedUser.email)
      setAllowedEmails(allowedEmails.filter(e => e.email !== deletedUser.email))
    }
    setUsers(users.filter(u => u.id !== userId))
    setConfirmDelete(null)
  }

  const getRoleBadge = (role) => {
    const r = ROLE_OPTIONS.find(o => o.value === role) || ROLE_OPTIONS[2]
    return (
      <span
        className="text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
        style={{ color: r.color, backgroundColor: r.bg }}
      >
        {r.label}
      </span>
    )
  }

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : '?'
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const approvedUsers = users.filter(u => u.status === 'approved')
  const rejectedUsers = users.filter(u => u.status === 'rejected')

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Usuarios</h2>
        <p className="text-[15px] text-[#48484a] mt-1">Gestiona los usuarios, invitaciones y roles del dashboard</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#9B7D2E]" />
            </div>
            <div>
              <p className="text-[12px] text-[#48484a] font-medium">Total Usuarios</p>
              <p className="text-[22px] font-semibold text-[#1d1d1f]">{approvedUsers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#9B7D2E]" />
            </div>
            <div>
              <p className="text-[12px] text-[#48484a] font-medium">Admins</p>
              <p className="text-[22px] font-semibold text-[#1d1d1f]">{approvedUsers.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EDF4FB] flex items-center justify-center">
              <Key className="w-5 h-5 text-[#5B8DB8]" />
            </div>
            <div>
              <p className="text-[12px] text-[#48484a] font-medium">Editores</p>
              <p className="text-[22px] font-semibold text-[#1d1d1f]">{approvedUsers.filter(u => u.role === 'editor').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#FF9500]" />
            </div>
            <div>
              <p className="text-[12px] text-[#48484a] font-medium">Pendientes</p>
              <p className="text-[22px] font-semibold text-[#1d1d1f]">{pendingUsers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="w-5 h-5 text-[#9B7D2E]" />
          <h3 className="text-[17px] font-semibold text-[#1d1d1f]">Invitar Usuarios</h3>
        </div>
        <p className="text-[13px] text-[#48484a] mb-4">
          Agrega emails autorizados para registrarse en el dashboard.
        </p>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aeaeb2]" />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => { setInviteEmail(e.target.value); setInviteMsg(''); setInviteError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              placeholder="nuevo@email.com"
              className="w-full pl-9 pr-3 py-2.5 bg-[#f5f5f7] rounded-xl text-[14px] text-[#1d1d1f] outline-none focus:ring-2 focus:ring-[#9B7D2E]/30 placeholder:text-[#aeaeb2] transition-all"
            />
          </div>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
            className="px-5 py-2.5 bg-[#9B7D2E] text-white text-[13px] font-semibold rounded-xl hover:bg-[#7A6222] transition-colors disabled:opacity-30"
          >
            Invitar
          </button>
        </div>
        {inviteMsg && <p className="text-[13px] text-[#34C759] font-medium mt-2">{inviteMsg}</p>}
        {inviteError && <p className="text-[13px] text-[#FF3B30] font-medium mt-2">{inviteError}</p>}

        {/* Allowed emails list */}
        {allowedEmails.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] font-semibold text-[#48484a] uppercase tracking-wider mb-2">
              Emails Autorizados ({allowedEmails.length})
            </p>
            <div className="space-y-1.5">
              {allowedEmails.map(ae => (
                <div key={ae.id} className="flex items-center justify-between px-3 py-2 bg-[#f5f5f7] rounded-xl group">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#48484a]" />
                    <span className="text-[13px] text-[#1d1d1f]">{ae.email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAllowed(ae.id)}
                    className="text-[#aeaeb2] hover:text-[#FF3B30] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-[#FF9500]">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF9500]" />
            Solicitudes Pendientes ({pendingUsers.length})
          </h3>
          <div className="space-y-3">
            {pendingUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between py-3 px-4 bg-[#f9f9fb] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FF9500] flex items-center justify-center text-white text-[12px] font-bold">
                    {getInitials(u.display_name)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1d1d1f]">{u.display_name || 'Sin nombre'}</p>
                    <p className="text-[11px] text-[#48484a]">{u.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#34C759] text-white text-[12px] font-semibold rounded-lg hover:bg-[#2DA84E] transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleReject(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3B30] text-white text-[12px] font-semibold rounded-lg hover:bg-[#E0342A] transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Rechazar
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ id: u.id, name: u.display_name || u.email })}
                    className="p-1.5 text-[#aeaeb2] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Users Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-5">Equipo</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-[#9B7D2E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : approvedUsers.length === 0 ? (
          <p className="text-[13px] text-[#48484a] text-center py-8">No hay usuarios aprobados todavia.</p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#f0f0f5]">
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Usuario</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Rol</th>
                <th className="text-left py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Cambiar Rol</th>
                <th className="text-right py-3 px-3 text-[11px] font-semibold text-[#48484a] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {approvedUsers.map((u) => {
                const initials = getInitials(u.display_name)
                const isCurrentUser = u.id === profile?.id
                return (
                  <tr key={u.id} className="border-b border-[#f5f5f7] hover:bg-[#f9f9fb] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#9B7D2E] flex items-center justify-center text-white text-[11px] font-bold">
                          {initials}
                        </div>
                        <span className="font-semibold text-[#1d1d1f]">
                          {u.display_name || 'Sin nombre'}
                          {isCurrentUser && <span className="text-[11px] text-[#48484a] font-normal ml-1">(tu)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-[#48484a]">{u.email}</td>
                    <td className="py-3.5 px-3">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-[#f5f5f7] rounded-lg text-[13px] font-medium text-[#1d1d1f] outline-none cursor-pointer hover:bg-[#e5e5ea] transition-colors"
                      >
                        {ROLE_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {!isCurrentUser && (
                        <button
                          onClick={() => setConfirmDelete({ id: u.id, name: u.display_name || u.email })}
                          className="p-1.5 text-[#aeaeb2] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-all"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <div className="mt-4 p-3 rounded-xl bg-[#f5f5f7]">
          <p className="text-[12px] text-[#48484a]">
            Para agregar un usuario, primero autoriza su email en "Invitar Usuarios" arriba. Cuando se registren, aparecera su solicitud en "Solicitudes Pendientes" para aprobarla.
          </p>
        </div>
      </div>

      {/* Rejected Users (if any) */}
      {rejectedUsers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-[15px] font-semibold text-[#48484a] mb-4">Rechazados ({rejectedUsers.length})</h3>
          <div className="space-y-2">
            {rejectedUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between py-2.5 px-3 bg-[#f5f5f7] rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#FF3B30]/20 flex items-center justify-center text-[#FF3B30] text-[10px] font-bold">
                    {getInitials(u.display_name)}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-[#48484a]">{u.display_name || 'Sin nombre'}</p>
                    <p className="text-[11px] text-[#aeaeb2]">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(u.id)}
                    className="text-[11px] font-semibold text-[#34C759] hover:underline"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ id: u.id, name: u.display_name || u.email })}
                    className="p-1 text-[#aeaeb2] hover:text-[#FF3B30] transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FF3B30]/10 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-[#FF3B30]" />
              </div>
            </div>
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] text-center">Eliminar Usuario</h3>
            <p className="text-[13px] text-[#48484a] text-center mt-2">
              Estas seguro que quieres eliminar a <strong>{confirmDelete.name}</strong>? Esta accion no se puede deshacer.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-[#f5f5f7] text-[#1d1d1f] text-[13px] font-semibold rounded-xl hover:bg-[#e5e5ea] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 py-2.5 bg-[#FF3B30] text-white text-[13px] font-semibold rounded-xl hover:bg-[#E0342A] transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
