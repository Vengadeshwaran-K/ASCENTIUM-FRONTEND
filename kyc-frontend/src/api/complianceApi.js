import apiClient from './httpClient.js'

export function getComplianceQueue() {
  return apiClient.get('/api/compliance/pending').then((response) => response.data)
}

export function getComplianceKyc(id) {
  return apiClient.get(`/api/compliance/${id}`).then((response) => response.data)
}

export function getComplianceDashboard() {
  return apiClient.get('/api/compliance/dashboard').then((response) => response.data)
}

export function getComplianceAudit(id) {
  return apiClient.get(`/api/compliance/${id}/audit`).then((response) => response.data)
}

export function acceptByCompliance(id, comment) {
  const payload = comment?.trim() ? { comment: comment.trim() } : {}
  return apiClient
    .post(`/api/compliance/${id}/accept`, payload)
    .then((response) => response.data)
}

export function rejectByCompliance(id, reason) {
  return apiClient
    .post(`/api/compliance/${id}/reject`, { reason: reason.trim() })
    .then((response) => response.data)
}
