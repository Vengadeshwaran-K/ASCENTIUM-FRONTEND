import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  acceptByReviewer,
  getReviewerKyc,
  rejectByReviewer,
} from '../../api/reviewerApi.js'
import { getApiErrorDetails } from '../../utils/apiError.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import KycReadOnlyView from '../../components/KycReadOnlyView.jsx'

function ReviewDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [kyc, setKyc] = useState(null)
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getReviewerKyc(id)
        setKyc(data)
      } catch (err) {
        setError(getApiErrorDetails(err).message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const accept = async () => {
    setSaving(true)
    setError('')
    try {
      await acceptByReviewer(id, comment)
      navigate('/reviewer/queue', { replace: true })
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setSaving(false)
    }
  }

  const reject = async () => {
    if (!reason.trim()) return
    setSaving(true)
    setError('')
    try {
      await rejectByReviewer(id, reason)
      navigate('/reviewer/queue', { replace: true })
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error && !kyc) return <p className="error-text">{error}</p>
  if (!kyc) return null

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>Review KYC #{kyc.id}</h1>
        <StatusBadge status={kyc.status} />
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      <KycReadOnlyView kyc={kyc} />

      <div className="card stack">
        <label className="field">
          <span>Accept Comment (optional)</span>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={3} />
        </label>
        <button type="button" disabled={saving} onClick={accept}>
          Accept
        </button>
      </div>

      <div className="card stack">
        <label className="field">
          <span>Reject Reason (required)</span>
          <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={3} />
        </label>
        <button type="button" disabled={saving || !reason.trim()} className="btn-danger" onClick={reject}>
          Reject
        </button>
      </div>
    </div>
  )
}

export default ReviewDetailPage
