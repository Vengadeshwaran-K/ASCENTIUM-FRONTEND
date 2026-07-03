import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { ROLES } from '../constants/roles.js'

function roleLinks(role) {
  if (role === ROLES.CLIENT) {
    return [{ to: '/client/requests', label: 'My Requests' }]
  }
  if (role === ROLES.REVIEWER) {
    return [{ to: '/reviewer/queue', label: 'Review Queue' }]
  }
  if (role === ROLES.COMPLIANCE_OFFICER) {
    return [{ to: '/compliance/queue', label: 'Compliance Queue' }]
  }
  if (role === ROLES.ADMIN) {
    return [
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/mappings', label: 'Mappings' },
      { to: '/admin/kyc', label: 'All KYC' },
    ]
  }
  return []
}

function AppLayout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const handleToast = (event) => setToast(event.detail)
    window.addEventListener('app:toast', handleToast)
    return () => window.removeEventListener('app:toast', handleToast)
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(timeout)
  }, [toast])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <Link className="brand" to="/">
            KYC Portal
          </Link>
          <div className="subtle">{auth.fullName || auth.email}</div>
        </div>
        <div className="topbar-actions">
          <span className="role-pill">{auth.role}</span>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <nav className="nav">
        {roleLinks(auth.role).map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {toast ? (
        <div className={`toast ${toast.type === 'error' ? 'toast--error' : ''}`}>
          {toast.message}
        </div>
      ) : null}

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
