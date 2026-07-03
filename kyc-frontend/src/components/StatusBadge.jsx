import { KYC_STATUSES } from '../constants/kyc.js'

const badgeClassByStatus = {
  [KYC_STATUSES.DRAFT]: 'badge badge--muted',
  [KYC_STATUSES.SUBMITTED]: 'badge badge--info',
  [KYC_STATUSES.PENDING_COMPLIANCE]: 'badge badge--warn',
  [KYC_STATUSES.APPROVED]: 'badge badge--success',
  [KYC_STATUSES.RESUBMISSION_REQUIRED]: 'badge badge--danger',
  [KYC_STATUSES.RETURNED_TO_REVIEWER]: 'badge badge--warn',
}

function pretty(status) {
  return String(status || '')
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function StatusBadge({ status }) {
  return <span className={badgeClassByStatus[status] ?? 'badge'}>{pretty(status)}</span>
}

export default StatusBadge
