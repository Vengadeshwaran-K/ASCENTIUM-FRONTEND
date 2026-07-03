import apiClient from './httpClient.js'

export function getNotifications() {
  return apiClient.get('/api/notifications').then((response) => response.data)
}

export function getUnreadCount() {
  return apiClient.get('/api/notifications/unread-count').then((response) => response.data)
}

export function markNotificationRead(id) {
  return apiClient.patch(`/api/notifications/${id}/read`).then((response) => response.data)
}

export function markAllNotificationsRead() {
  return apiClient.patch('/api/notifications/read-all').then((response) => response.data)
}
