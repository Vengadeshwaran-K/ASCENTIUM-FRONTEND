import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/notificationsApi.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { ROLES } from '../constants/roles.js'
import { formatRelativeTime } from '../utils/formatters.js'

const POLL_INTERVAL_MS = 30000

function targetPath(role, kycRequestId) {
  if (kycRequestId === null || kycRequestId === undefined) {
    if (role === ROLES.CLIENT) return '/client/dashboard'
    if (role === ROLES.REVIEWER) return '/reviewer/dashboard'
    if (role === ROLES.COMPLIANCE_OFFICER) return '/compliance/dashboard'
    if (role === ROLES.ADMIN) return '/admin/dashboard'
    return '/'
  }
  if (role === ROLES.CLIENT) return `/client/kyc/${kycRequestId}`
  if (role === ROLES.REVIEWER) return `/reviewer/queue/${kycRequestId}`
  if (role === ROLES.COMPLIANCE_OFFICER) return `/compliance/queue/${kycRequestId}`
  if (role === ROLES.ADMIN) return `/admin/kyc?highlight=${kycRequestId}`
  return '/'
}

function NotificationBell() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef(null)

  const refreshCount = useCallback(() => {
    getUnreadCount()
      .then((data) => setUnreadCount(data?.count ?? 0))
      .catch(() => {})
  }, [])

  useEffect(() => {
    refreshCount()
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS)
    window.addEventListener('focus', refreshCount)
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', refreshCount)
    }
  }, [refreshCount])

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

  const openPanel = () => {
    setOpen((prev) => !prev)
    if (open) return
    setLoading(true)
    setError('')
    getNotifications()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load notifications.'))
      .finally(() => setLoading(false))
  }

  const handleItemClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id)
        setItems((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } catch {
        // navigation still proceeds; badge refresh will self-correct on next poll
      }
    }
    setOpen(false)
    navigate(targetPath(auth.role, notification.kycRequestId))
  }

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead()
      setItems((prev) => prev.map((item) => ({ ...item, read: true })))
      setUnreadCount(0)
    } catch {
      setError('Could not mark all as read.')
    }
  }

  return (
    <div className="notif-bell" ref={containerRef}>
      <button
        type="button"
        className="notif-bell-button"
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        onClick={openPanel}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3a6 6 0 0 0-6 6v3.3l-1.6 3.2a.7.7 0 0 0 .63 1h13.94a.7.7 0 0 0 .63-1L18 12.3V9a6 6 0 0 0-6-6Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M9.8 19.5a2.3 2.3 0 0 0 4.4 0" stroke="currentColor" strokeWidth="1.7" />
        </svg>
        {unreadCount > 0 ? (
          <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        ) : null}
      </button>

      {open ? (
        <div className="notif-panel">
          <div className="notif-panel-head">
            <strong>Notifications</strong>
            <button
              type="button"
              className="notif-link-button"
              onClick={handleMarkAll}
              disabled={!items.some((item) => !item.read)}
            >
              Mark all read
            </button>
          </div>

          {loading ? <p className="subtle notif-panel-empty">Loading...</p> : null}
          {error ? <p className="error-text notif-panel-empty">{error}</p> : null}
          {!loading && !error && items.length === 0 ? (
            <p className="subtle notif-panel-empty">No notifications.</p>
          ) : null}

          <ul className="notif-list">
            {items.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  className={`notif-item ${notification.read ? '' : 'notif-item--unread'}`}
                  onClick={() => handleItemClick(notification)}
                >
                  <span className="notif-item-message">{notification.message}</span>
                  <span className="notif-item-time">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default NotificationBell
