import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            required
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

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="subtle">
          Client account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
