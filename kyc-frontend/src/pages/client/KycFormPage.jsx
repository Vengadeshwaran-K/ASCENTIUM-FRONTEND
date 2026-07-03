import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  createKycDraft,
  getKycById,
  submitKyc,
  updateKycDraft,
} from '../../api/clientKycApi.js'
import {
  CLIENT_EDITABLE_STATUSES,
  KYC_STATUSES,
  KYC_TYPES,
} from '../../constants/kyc.js'
import { getApiErrorDetails } from '../../utils/apiError.js'
import KycFormFields from '../../components/KycFormFields.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { EMPTY_KYC_FORM, toApiPayload, toFormValues } from '../../utils/kycForm.js'

function KycFormPage({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [kyc, setKyc] = useState(null)
  const [values, setValues] = useState(EMPTY_KYC_FORM)
  const [error, setError] = useState('')
  const [submitErrors, setSubmitErrors] = useState([])
  const [waitingMapping, setWaitingMapping] = useState(false)
  const [loading, setLoading] = useState(mode !== 'create')
  const [saving, setSaving] = useState(false)

  const readOnly = mode !== 'create' && kyc && !CLIENT_EDITABLE_STATUSES.has(kyc.status)

  const formTitle = useMemo(() => {
    if (mode === 'create') return 'Create KYC Draft'
    if (kyc?.status === KYC_STATUSES.RESUBMISSION_REQUIRED) return 'Fix and Resubmit KYC'
    return 'Edit KYC Draft'
  }, [kyc?.status, mode])

  useEffect(() => {
    if (mode === 'create') return

    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getKycById(id)
        setKyc(data)
        setValues(toFormValues(data))
      } catch (err) {
        setError(getApiErrorDetails(err).message)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [id, mode])

  const createDraft = async () => {
    setSaving(true)
    setError('')
    try {
      const created = await createKycDraft({ type: values.type || KYC_TYPES.INDIVIDUAL })
      navigate(`/client/kyc/${created.id}/edit`, { replace: true })
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setSaving(false)
    }
  }

  const saveDraft = async () => {
    setSaving(true)
    setError('')
    setSubmitErrors([])
    setWaitingMapping(false)
    try {
      const updated = await updateKycDraft(id, toApiPayload(values))
      setKyc(updated)
      setValues(toFormValues(updated))
      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { type: 'success', message: 'Draft saved.' },
        }),
      )
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError('')
    setSubmitErrors([])
    setWaitingMapping(false)
    try {
      await updateKycDraft(id, toApiPayload(values))
      const submitted = await submitKyc(id)
      navigate(`/client/kyc/${submitted.id}`, { replace: true })
    } catch (err) {
      const details = getApiErrorDetails(err)
      const lower = details.message.toLowerCase()
      if (lower.includes('mapping') || lower.includes('assign')) {
        setWaitingMapping(true)
      } else {
        setSubmitErrors(details.errors.length ? details.errors : [details.message])
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (mode === 'edit' && error && !kyc) {
    return <p className="error-text">{error}</p>
  }

  if (mode !== 'create' && readOnly) {
    return <Navigate to={`/client/kyc/${id}`} replace />
  }

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>{formTitle}</h1>
        {kyc ? <StatusBadge status={kyc.status} /> : null}
      </div>

      {kyc?.status === KYC_STATUSES.RESUBMISSION_REQUIRED ? (
        <div className="banner banner--warn">
          Rejected by {kyc.rejectedBy}. Reason: {kyc.rejectionReason}
        </div>
      ) : null}

      {waitingMapping ? (
        <div className="banner banner--warn">
          Waiting on admin assignment before submit.
        </div>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}
      {submitErrors.length ? (
        <div className="error-list">
          {submitErrors.map((item, index) => (
            <p key={`${item}-${index}`} className="error-text">
              {item}
            </p>
          ))}
        </div>
      ) : null}

      <div className="card form-panel form-panel--wide">
        <KycFormFields
          values={values}
          setValues={setValues}
          readOnly={false}
          lockType={mode === 'edit'}
        />

        <div className="button-row form-actions">
          {mode === 'create' ? (
            <button type="button" disabled={saving} onClick={createDraft}>
              {saving ? 'Creating...' : 'Create Draft'}
            </button>
          ) : (
            <>
              <button type="button" disabled={saving} onClick={saveDraft}>
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button type="button" disabled={saving} onClick={handleSubmit}>
                {kyc?.status === KYC_STATUSES.RESUBMISSION_REQUIRED
                  ? `Resubmit (v${(kyc.formVersion ?? 0) + 1})`
                  : 'Submit'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default KycFormPage
