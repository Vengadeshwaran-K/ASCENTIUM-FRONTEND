import { useEffect, useState } from 'react'
import {
  activateUser,
  createStaffUser,
  deactivateUser,
  getAdminUsers,
} from '../../api/adminApi.js'
import { ROLES } from '../../constants/roles.js'
import { getApiErrorDetails } from '../../utils/apiError.js'

const createDefaults = {
  fullName: '',
  email: '',
  password: '',
  role: ROLES.REVIEWER,
}

function UsersPage() {
  const [users, setUsers] = useState([])
  const [filterRole, setFilterRole] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [values, setValues] = useState(createDefaults)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadUsers = async (role) => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminUsers(role || undefined)
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    getAdminUsers(filterRole || undefined)
      .then((data) => {
        if (!cancelled) {
          setUsers(Array.isArray(data) ? data : [])
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorDetails(err).message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [filterRole])

  const createUser = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createStaffUser(values)
      setShowModal(false)
      setValues(createDefaults)
      await loadUsers(filterRole)
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (user) => {
    setError('')
    try {
      if (user.active) {
        await deactivateUser(user.id)
      } else {
        await activateUser(user.id)
      }
      await loadUsers(filterRole)
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    }
  }

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>Users</h1>
        <button type="button" onClick={() => setShowModal(true)}>
          Create User
        </button>
      </div>

      <div className="card">
        <label className="field">
          <span>Filter by Role</span>
          <select
            value={filterRole}
            onChange={(event) => {
              setLoading(true)
              setFilterRole(event.target.value)
            }}
          >
            <option value="">All</option>
            <option value={ROLES.CLIENT}>CLIENT</option>
            <option value={ROLES.REVIEWER}>REVIEWER</option>
            <option value={ROLES.COMPLIANCE_OFFICER}>COMPLIANCE_OFFICER</option>
            <option value={ROLES.ADMIN}>ADMIN</option>
          </select>
        </label>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {users.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button type="button" onClick={() => toggleActive(user)}>
                      {user.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading ? (
        <div className="card">
          <p>No users found.</p>
        </div>
      ) : null}

      {showModal ? (
        <div className="modal-backdrop">
          <form className="modal modal--form" onSubmit={createUser}>
            <h3>Create Staff/Admin User</h3>
            <label className="field">
              <span>Full Name</span>
              <input
                value={values.fullName}
                required
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
                value={values.email}
                required
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
                value={values.password}
                required
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Role</span>
              <select
                value={values.role}
                onChange={(event) =>
                  setValues((prev) => ({
                    ...prev,
                    role: event.target.value,
                  }))
                }
              >
                <option value={ROLES.REVIEWER}>REVIEWER</option>
                <option value={ROLES.COMPLIANCE_OFFICER}>COMPLIANCE_OFFICER</option>
                <option value={ROLES.ADMIN}>ADMIN</option>
              </select>
            </label>
            <div className="button-row form-actions">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default UsersPage
