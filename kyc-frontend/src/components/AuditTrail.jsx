import { formatDateTime } from '../utils/formatters.js'

const APPROVED_ACTIONS = new Set(['REVIEWER_APPROVED', 'COMPLIANCE_APPROVED'])
const REJECTED_ACTIONS = new Set(['REVIEWER_REJECTED', 'COMPLIANCE_REJECTED'])

function dotVariant(action) {
  if (APPROVED_ACTIONS.has(action)) return 'approved'
  if (REJECTED_ACTIONS.has(action)) return 'rejected'
  if (action === 'RISK_TIER_OVERRIDDEN') return 'risk'
  return 'neutral'
}

function humanizeAction(action) {
  return String(action || '')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function humanizeRole(role) {
  return String(role || '')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function AuditTrail({ entries, loading, error }) {
  if (loading) return <p>Loading audit trail...</p>
  if (error) return <p className="error-text">{error}</p>
  if (!entries || entries.length === 0) {
    return (
      <div className="card">
        <p className="subtle">No actions recorded yet.</p>
      </div>
    )
  }

  return (
    <ol className="audit-trail">
      {entries.map((entry) => (
        <li className="audit-item" key={entry.id}>
          <span className={`audit-dot audit-dot--${dotVariant(entry.action)}`} />
          <div className="audit-body">
            <div className="audit-head">
              <strong>{humanizeAction(entry.action)}</strong>
              <span className="audit-time">{formatDateTime(entry.createdAt)}</span>
            </div>
            <div className="audit-actor">
              {entry.actorName}
              <span className="badge badge--muted audit-role-badge">
                {humanizeRole(entry.actorRole)}
              </span>
            </div>
            {entry.action === 'RISK_TIER_OVERRIDDEN' ? (
              <p className="audit-risk-change">
                {entry.previousRiskTier ?? 'UNRATED'}
                <span aria-hidden="true"> → </span>
                {entry.newRiskTier ?? 'UNRATED'}
              </p>
            ) : null}
            {entry.remarks ? <p className="audit-remark">&ldquo;{entry.remarks}&rdquo;</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default AuditTrail
