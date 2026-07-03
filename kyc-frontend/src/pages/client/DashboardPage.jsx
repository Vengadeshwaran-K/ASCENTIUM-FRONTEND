import { useEffect, useState } from 'react'
import { getClientDashboard } from '../../api/clientKycApi.js'
import DashboardSections from '../../components/DashboardSections.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { formatDateTime, itemName } from '../../utils/formatters.js'
import { ROLE_LABELS } from '../../constants/roles.js'

function prettyRole(role) {
  return ROLE_LABELS[role] ?? role ?? '-'
}

function ClientDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getClientDashboard()
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
          description: 'Submitted, awaiting review or compliance decision',
          data: dashboard.pending,
          detailPath: (item) => `/client/kyc/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Type', render: (item) => item.type ?? '-' },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Version', render: (item) => item.formVersion ?? '-' },
            { header: 'Submitted', render: (item) => formatDateTime(item.submittedAt) },
          ],
        },
        {
          key: 'awaitingClientDocuments',
          title: 'Awaiting Your Documents',
          description: 'Needs resubmission from you',
          data: dashboard.awaitingClientDocuments,
          detailPath: (item) => `/client/kyc/${item.id}/edit`,
          actionLabel: 'Resubmit',
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Type', render: (item) => item.type ?? '-' },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Version', render: (item) => item.formVersion ?? '-' },
            { header: 'Returned By', render: (item) => prettyRole(item.rejectedBy) },
            { header: 'Reason', render: (item) => item.rejectionReason ?? '-', wrap: true },
          ],
        },
        {
          key: 'approved',
          title: 'Approved',
          data: dashboard.approved,
          detailPath: (item) => `/client/kyc/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Type', render: (item) => item.type ?? '-' },
            { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
            { header: 'Version', render: (item) => item.formVersion ?? '-' },
          ],
        },
        {
          key: 'rejected',
          title: 'Rejected',
          data: dashboard.rejected,
          detailPath: (item) => `/client/kyc/${item.id}`,
          columns: [
            { header: 'ID', render: (item) => item.id },
            { header: 'Name', render: (item) => itemName(item) },
            { header: 'Type', render: (item) => item.type ?? '-' },
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

export default ClientDashboardPage
