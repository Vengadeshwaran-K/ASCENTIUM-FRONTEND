import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReviewerQueue } from '../../api/reviewerApi.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { formatDateTime } from '../../utils/formatters.js'

function ReviewQueuePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getReviewerQueue()
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
      <h1>Review Queue</h1>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && !items.length ? (
        <div className="card">
          <p>No pending items.</p>
        </div>
      ) : null}

      {items.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Queue Type</th>
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
                <td>
                  {item.status === 'RETURNED_TO_REVIEWER'
                    ? 'Returned by Compliance'
                    : 'Fresh Submission'}
                </td>
                <td>{formatDateTime(item.submittedAt)}</td>
                <td>
                  <button type="button" onClick={() => navigate(`/reviewer/queue/${item.id}`)}>
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default ReviewQueuePage
