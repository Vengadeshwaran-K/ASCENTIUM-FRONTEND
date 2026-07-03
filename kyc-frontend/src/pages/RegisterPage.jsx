import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerClient } from '../api/authApi.js'
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await registerClient(values)
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. Please log in.' },
      })
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
          <h2>Open your KYC profile</h2>
          <p className="subtle">
            Create your account once, then track submission progress end-to-end.
          </p>
        </div>

        <form className="card auth-card form-panel" onSubmit={handleSubmit}>
          <div className="auth-head">
            <h1>Create client account</h1>
            <p className="subtle">Complete registration to start your KYC request.</p>
          </div>

          <label className="field">
            <span>Full Name</span>
            <input
              required
              placeholder="Your legal full name"
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
              placeholder="Create a strong password"
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
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>

          <p className="subtle auth-link-line">
            Already registered? <Link to="/login">Go to login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
