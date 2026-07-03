import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

function ProtectedRoute({ allowedRoles, children }) {
  const { auth } = useAuth()

  if (!auth.token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles?.length && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute
