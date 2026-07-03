import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAdminAudit } from '../../api/adminApi.js'
import { getApiErrorDetails } from '../../utils/apiError.js'
import AuditTrail from '../../components/AuditTrail.jsx'

function AdminAuditPage() {
  const { id } = useParams()
  const [entries, setEntries] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getAdminAudit(id)
      .then((data) => {
        if (!cancelled) setEntries(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorDetails(err).message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>Audit Trail — KYC #{id}</h1>
        <Link to="/admin/kyc">Back to All KYC</Link>
      </div>

      <div className="card">
        <AuditTrail entries={entries} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default AdminAuditPage
