import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getComplianceQueue } from '../../api/complianceApi.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { formatDateTime } from '../../utils/formatters.js'

function ComplianceQueuePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getComplianceQueue()
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(getApiErrorDetails(err).message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="stack">
      <h1>Compliance Queue</h1>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !items.length ? (
        <div className="card">
          <p>No pending items.</p>
        </div>
      ) : null}

      {items.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.clientId}</td>
                  <td>{item.type}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>{formatDateTime(item.submittedAt)}</td>
                  <td>
                    <button type="button" onClick={() => navigate(`/compliance/queue/${item.id}`)}>
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export default ComplianceQueuePage
