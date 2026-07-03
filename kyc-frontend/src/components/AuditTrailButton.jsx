import { useEffect, useRef, useState } from 'react'
import { getApiErrorDetails } from '../utils/apiError.js'
import AuditTrail from './AuditTrail.jsx'

function AuditTrailButton({ fetchAudit }) {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const toggle = () => {
    setOpen((prev) => !prev)
    if (open || entries !== null) return
    setLoading(true)
    setError('')
    fetchAudit()
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch((err) => setError(getApiErrorDetails(err).message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="audit-trigger" ref={containerRef}>
      <button type="button" onClick={toggle}>
        Audit Trail
      </button>

      {open ? (
        <div className="notif-panel audit-floating-panel">
          <div className="notif-panel-head">
            <strong>Audit Trail</strong>
          </div>
          <div className="audit-panel-body">
            <AuditTrail entries={entries} loading={loading} error={error} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AuditTrailButton
