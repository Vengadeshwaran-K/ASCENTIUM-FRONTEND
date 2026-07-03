import { useEffect, useState } from 'react'
import { getAdminDashboard } from '../../api/adminApi.js'
import DashboardSections from '../../components/DashboardSections.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getApiErrorDetails } from '../../utils/apiError.js'
import { ROLE_LABELS } from '../../constants/roles.js'

function prettyRole(role) {
  return ROLE_LABELS[role] ?? role ?? '-'
}

function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getAdminDashboard()
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

  const baseColumns = [
    { header: 'ID', render: (item) => item.id },
    { header: 'Client ID', render: (item) => item.clientId },
    { header: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  ]

  const withRejectedBy = [...baseColumns, { header: 'Rejected By', render: (item) => prettyRole(item.rejectedBy) }]

  const sections = dashboard
    ? [
        { key: 'pending', title: 'Pending', data: dashboard.pending, columns: baseColumns },
        {
          key: 'awaitingClientDocuments',
          title: 'Awaiting Client Documents',
          data: dashboard.awaitingClientDocuments,
          columns: withRejectedBy,
        },
        { key: 'approved', title: 'Approved', data: dashboard.approved, columns: baseColumns },
        { key: 'rejected', title: 'Rejected', data: dashboard.rejected, columns: withRejectedBy },
      ]
    : []

  return (
    <div className="stack">
      <h1>Dashboard</h1>
      <p className="subtle">Global view across all clients</p>
      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {dashboard ? <DashboardSections sections={sections} /> : null}
    </div>
  )
}

export default AdminDashboardPage
