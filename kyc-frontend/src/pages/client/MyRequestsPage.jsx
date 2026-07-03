import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyKycRequests } from '../../api/clientKycApi.js'
import { CLIENT_OPEN_REQUEST_STATUSES } from '../../constants/kyc.js'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { formatDateTime } from '../../utils/formatters.js'
import StatusBadge from '../../components/StatusBadge.jsx'

function toArray(data) {
  return Array.isArray(data) ? data : data ? [data] : []
}

function actionForRequest(kyc) {
  if (kyc.status === 'DRAFT' || kyc.status === 'RESUBMISSION_REQUIRED') {
    return { label: 'Continue', path: `/client/kyc/${kyc.id}/edit` }
  }
  return { label: 'View', path: `/client/kyc/${kyc.id}` }
}

function MyRequestsPage() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    getMyKycRequests()
      .then((data) => {
        if (!cancelled) {
          setRequests(toArray(data))
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
  }, [])

  const openRequest = useMemo(
    () => requests.find((item) => CLIENT_OPEN_REQUEST_STATUSES.has(item.status)),
    [requests],
  )

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>My KYC Requests</h1>
        <button
          type="button"
          onClick={() => {
            if (openRequest) {
              const action = actionForRequest(openRequest)
              navigate(action.path)
              return
            }
            navigate('/client/kyc/new')
          }}
        >
          {openRequest ? 'Continue Open Request' : 'Start KYC Request'}
        </button>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {!loading && requests.length === 0 ? (
        <div className="card">
          <p>No requests yet.</p>
        </div>
      ) : null}

      {requests.length ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Version</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const action = actionForRequest(request)
              return (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.type}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>{request.formVersion ?? '-'}</td>
                  <td>{formatDateTime(request.createdAt)}</td>
                  <td>
                    <button type="button" onClick={() => navigate(action.path)}>
                      {action.label}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default MyRequestsPage
