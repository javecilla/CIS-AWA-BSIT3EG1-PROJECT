import { useNavigate } from 'react-router-dom'
import { useUser } from '@/contexts/UserContext'
import { PATIENT, STAFF } from '@/constants/user-roles'

export function useRoleNavigation() {
  const navigate = useNavigate()
  const { role } = useUser()

  const getRolePrefix = () => {
    if (role === PATIENT) return 'patient'
    if (role === STAFF) return 'staff'
    return null
  }

  const navigateWithRole = (path, options) => {
    const rolePrefix = getRolePrefix()

    if (!rolePrefix) {
      console.error('No valid role found for navigation')
      return
    }

    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    const fullPath = `/${rolePrefix}/${cleanPath}`

    navigate(fullPath, options)
  }

  //g full path with role prefix (for Link/NavLink components)
  const getPathWithRole = (path) => {
    const rolePrefix = getRolePrefix()

    if (!rolePrefix) {
      return '/auth/login'
    }

    //avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `/${rolePrefix}/${cleanPath}`
  }

  return {
    navigate: navigateWithRole,
    getPath: getPathWithRole,
    rolePrefix: getRolePrefix()
  }
}
