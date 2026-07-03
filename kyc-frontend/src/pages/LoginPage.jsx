import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getApiErrorDetails } from '../utils/apiError.js'
import { ROLES } from '../constants/roles.js'

function routeByRole(role) {
  if (role === ROLES.CLIENT) return '/client/requests'
  if (role === ROLES.REVIEWER) return '/reviewer/queue'
  if (role === ROLES.COMPLIANCE_OFFICER) return '/compliance/queue'
  if (role === ROLES.ADMIN) return '/admin/users'
  return '/unauthorized'
}

function LoginPage() {
  const { login: saveAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const infoMessage = location.state?.message ?? ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(values)
      saveAuth(data)
      navigate(routeByRole(data.role), { replace: true })
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <div className="auth-side card">
          <h2>KYC Operations Portal</h2>
          <p className="subtle">
            Secure onboarding for clients and streamlined decision workflows for staff.
          </p>
        </div>

        <form className="card auth-card form-panel" onSubmit={handleSubmit}>
          <div className="auth-head">
            <h1>Welcome back</h1>
            <p className="subtle">Sign in to continue to your role dashboard.</p>
          </div>

          {infoMessage ? <div className="banner banner--warn">{infoMessage}</div> : null}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={values.email}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={values.password}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </div>

          <p className="subtle auth-link-line">
            Client account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
