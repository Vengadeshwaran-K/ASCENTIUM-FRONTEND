import { useEffect, useMemo, useState } from 'react'
import { getAllKycForAdmin } from '../../api/adminApi.js'
import { getApiErrorDetails } from '../../utils/apiError.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import { formatDateTime } from '../../utils/formatters.js'

function AllKycPage() {
  const [items, setItems] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAllKycForAdmin()
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(getApiErrorDetails(err).message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const statuses = useMemo(() => {
    const set = new Set(items.map((item) => item.status).filter(Boolean))
    return Array.from(set)
  }, [items])

  const filtered = useMemo(
    () => items.filter((item) => !statusFilter || item.status === statusFilter),
    [items, statusFilter],
  )

  return (
    <div className="stack">
      <h1>All KYC Requests</h1>
      <div className="card">
        <label className="field">
          <span>Filter by status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {filtered.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Version</th>
              <th>Submitted</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.clientId}</td>
                <td>{item.type}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>{item.formVersion ?? '-'}</td>
                <td>{formatDateTime(item.submittedAt)}</td>
                <td>{formatDateTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !loading ? (
        <div className="card">
          <p>No records found.</p>
        </div>
      ) : null}
    </div>
  )
}

export default AllKycPage
