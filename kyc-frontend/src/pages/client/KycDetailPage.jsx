import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getKycById } from '../../api/clientKycApi.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import KycReadOnlyView from '../../components/KycReadOnlyView.jsx'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { formatDateTime } from '../../utils/formatters.js'
import { CLIENT_EDITABLE_STATUSES } from '../../constants/kyc.js'

function KycDetailPage() {
  const { id } = useParams()
  const [kyc, setKyc] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const data = await getKycById(id)
        setKyc(data)
      } catch (err) {
        setError(getApiErrorDetails(err).message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="error-text">{error}</p>
  if (!kyc) return null

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>KYC #{kyc.id}</h1>
        <StatusBadge status={kyc.status} />
      </div>

      {CLIENT_EDITABLE_STATUSES.has(kyc.status) ? (
        <div className="card">
          <p>This request is editable.</p>
          <Link to={`/client/kyc/${kyc.id}/edit`}>Go to edit form</Link>
        </div>
      ) : null}

      <KycReadOnlyView kyc={kyc} />

      <div className="card">
        <h3>Timeline</h3>
        <div className="timeline">
          <div>
            <strong>Submitted</strong>
            <p>{formatDateTime(kyc.submittedAt)}</p>
          </div>
          <div>
            <strong>Reviewed</strong>
            <p>{formatDateTime(kyc.reviewedAt)}</p>
          </div>
          <div>
            <strong>Decision</strong>
            <p>{formatDateTime(kyc.decidedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KycDetailPage
