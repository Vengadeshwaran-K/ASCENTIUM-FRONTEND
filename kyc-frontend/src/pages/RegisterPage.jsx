import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerClient } from '../api/authApi.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { getApiErrorDetails } from '../utils/apiError.js'

function RegisterPage() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await registerClient(values)
      login(data)
      navigate('/client/requests', { replace: true })
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h1>Client Registration</h1>
        <label className="field">
          <span>Full Name</span>
          <input
            required
            value={values.fullName}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                fullName: event.target.value,
              }))
            }
          />
        </label>

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
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="subtle">
          Already registered? <Link to="/login">Go to login</Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
