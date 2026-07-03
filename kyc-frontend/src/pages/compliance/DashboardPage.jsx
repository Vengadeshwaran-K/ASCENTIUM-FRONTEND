import { useEffect, useState } from 'react'
import { getComplianceDashboard } from '../../api/complianceApi.js'
import DashboardSections from '../../components/DashboardSections.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { formatDateTime, itemName } from '../../utils/formatters.js'
import { ROLE_LABELS } from '../../constants/roles.js'

function prettyRole(role) {
  return ROLE_LABELS[role] ?? role ?? '-'
}

function ComplianceDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getComplianceDashboard()
      .then((data) => {
        if (!cancelled) setDashboard(data)
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
  }, [])

  const sections = dashboard
    ? [
        {
          key: 'pending',
          title: 'Pending',
          description: 'Cleared by review, awaiting your decision',
          data: dashboard.pending,
          detailPath: (item) => `/compliance/queue/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Client ID', render: (item) => item.clientId },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Reviewer Comment', render: (item) => item.reviewerComment ?? '-', wrap: true },
            { header: 'Reviewed', render: (item) => formatDateTime(item.reviewedAt) },
          ],
        },
        {
          key: 'awaitingClientDocuments',
          title: 'Awaiting Client Documents',
          description: 'Sent back to the client, not yet resubmitted',
          data: dashboard.awaitingClientDocuments,
          detailPath: (item) => `/compliance/queue/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Client ID', render: (item) => item.clientId },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Returned By', render: (item) => prettyRole(item.rejectedBy) },
            { header: 'Reason', render: (item) => item.rejectionReason ?? '-', wrap: true },
          ],
        },
        {
          key: 'approved',
          title: 'Approved',
          data: dashboard.approved,
          detailPath: (item) => `/compliance/queue/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Client ID', render: (item) => item.clientId },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Decided', render: (item) => formatDateTime(item.decidedAt) },
          ],
        },
        {
          key: 'rejected',
          title: 'Rejected',
          description: 'Sent back to the reviewer',
          data: dashboard.rejected,
          detailPath: (item) => `/compliance/queue/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Client ID', render: (item) => item.clientId },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Rejected By', render: (item) => prettyRole(item.rejectedBy) },
            { header: 'Reason', render: (item) => item.rejectionReason ?? '-', wrap: true },
          ],
        },
      ]
    : []

  return (
    <div className="stack">
      <h1>Dashboard</h1>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {dashboard ? <DashboardSections sections={sections} /> : null}
    </div>
  )
}

export default ComplianceDashboardPage
