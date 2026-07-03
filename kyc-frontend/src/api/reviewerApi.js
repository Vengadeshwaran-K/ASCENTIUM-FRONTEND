import apiClient from './httpClient.js'

export function getReviewerQueue() {
  return apiClient.get('/api/review/pending').then((response) => response.data)
}

export function getReviewerKyc(id) {
  return apiClient.get(`/api/review/${id}`).then((response) => response.data)
}

export function getReviewerDashboard() {
  return apiClient.get('/api/review/dashboard').then((response) => response.data)
}

export function getReviewAudit(id) {
  return apiClient.get(`/api/review/${id}/audit`).then((response) => response.data)
}

export function acceptByReviewer(id, comment) {
  const payload = comment?.trim() ? { comment: comment.trim() } : {}
  return apiClient.post(`/api/review/${id}/accept`, payload).then((response) => response.data)
}

export function rejectByReviewer(id, reason) {
  return apiClient
    .post(`/api/review/${id}/reject`, { reason: reason.trim() })
    .then((response) => response.data)
}
