import { useAuth } from '../contexts/AuthContext'

const PERMISSIONS = {
  admin: {
    manage_vendors: true,
    edit_commission_rates: true,
    edit_assignments: true,
    edit_oro_params: true,
    manage_users: true,
    export_csv: true,
    view_all: true,
  },
  editor: {
    manage_vendors: false,
    edit_commission_rates: true,
    edit_assignments: true,
    edit_oro_params: false,
    manage_users: false,
    export_csv: true,
    view_all: true,
  },
  viewer: {
    manage_vendors: false,
    edit_commission_rates: false,
    edit_assignments: false,
    edit_oro_params: false,
    manage_users: false,
    export_csv: true,
    view_all: true,
  },
}

export function useRole() {
  const { role } = useAuth()

  function can(action) {
    if (!role) return false
    return PERMISSIONS[role]?.[action] === true
  }

  return { role, can }
}
