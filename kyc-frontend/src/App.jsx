import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext.jsx'
import { ROLES } from './constants/roles.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './components/AppLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import UnauthorizedPage from './pages/UnauthorizedPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ClientDashboardPage from './pages/client/DashboardPage.jsx'
import MyRequestsPage from './pages/client/MyRequestsPage.jsx'
import KycFormPage from './pages/client/KycFormPage.jsx'
import KycDetailPage from './pages/client/KycDetailPage.jsx'
import ReviewerDashboardPage from './pages/reviewer/DashboardPage.jsx'
import ReviewQueuePage from './pages/reviewer/ReviewQueuePage.jsx'
import ReviewDetailPage from './pages/reviewer/ReviewDetailPage.jsx'
import ComplianceDashboardPage from './pages/compliance/DashboardPage.jsx'
import ComplianceQueuePage from './pages/compliance/ComplianceQueuePage.jsx'
import ComplianceDetailPage from './pages/compliance/ComplianceDetailPage.jsx'
import AdminDashboardPage from './pages/admin/DashboardPage.jsx'
import UsersPage from './pages/admin/UsersPage.jsx'
import MappingsPage from './pages/admin/MappingsPage.jsx'
import AllKycPage from './pages/admin/AllKycPage.jsx'

function RoleHomeRedirect() {
  const { auth } = useAuth()

  if (!auth.token) {
    return <Navigate to="/login" replace />
  }

  if (auth.role === ROLES.CLIENT) {
    return <Navigate to="/client/dashboard" replace />
  }

  if (auth.role === ROLES.REVIEWER) {
    return <Navigate to="/reviewer/dashboard" replace />
  }

  if (auth.role === ROLES.COMPLIANCE_OFFICER) {
    return <Navigate to="/compliance/dashboard" replace />
  }

  if (auth.role === ROLES.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Navigate to="/unauthorized" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<RoleHomeRedirect />} />

        <Route
          element={<ProtectedRoute allowedRoles={[ROLES.CLIENT]} />}
        >
          <Route path="/client/dashboard" element={<ClientDashboardPage />} />
          <Route path="/client/requests" element={<MyRequestsPage />} />
          <Route path="/client/kyc/new" element={<KycFormPage mode="create" />} />
          <Route path="/client/kyc/:id/edit" element={<KycFormPage mode="edit" />} />
          <Route path="/client/kyc/:id" element={<KycDetailPage />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={[ROLES.REVIEWER]} />}
        >
          <Route path="/reviewer/dashboard" element={<ReviewerDashboardPage />} />
          <Route path="/reviewer/queue" element={<ReviewQueuePage />} />
          <Route path="/reviewer/queue/:id" element={<ReviewDetailPage />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={[ROLES.COMPLIANCE_OFFICER]} />}
        >
          <Route path="/compliance/dashboard" element={<ComplianceDashboardPage />} />
          <Route path="/compliance/queue" element={<ComplianceQueuePage />} />
          <Route path="/compliance/queue/:id" element={<ComplianceDetailPage />} />
        </Route>

        <Route
          element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}
        >
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/mappings" element={<MappingsPage />} />
          <Route path="/admin/kyc" element={<AllKycPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
