import { useEffect, useState } from 'react'
import {
  createMapping,
  deleteMapping,
  getAdminUsers,
  getMappings,
  updateMapping,
} from '../../api/adminApi.js'
import { ROLES } from '../../constants/roles.js'
import { getApiErrorDetails } from '../../utils/apiError.js'

const emptyMapping = {
  id: null,
  clientId: '',
  reviewerId: '',
  complianceOfficerId: '',
}

function getUserName(user) {
  if (!user) return '-'
  return `${user.fullName} (${user.id})`
}

function MappingsPage() {
  const [mappings, setMappings] = useState([])
  const [clients, setClients] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [officers, setOfficers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyMapping)

  const loadAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [mappingData, clientData, reviewerData, officerData] = await Promise.all([
        getMappings(),
        getAdminUsers(ROLES.CLIENT),
        getAdminUsers(ROLES.REVIEWER),
        getAdminUsers(ROLES.COMPLIANCE_OFFICER),
      ])
      setMappings(Array.isArray(mappingData) ? mappingData : [])
      setClients(Array.isArray(clientData) ? clientData : [])
      setReviewers(Array.isArray(reviewerData) ? reviewerData : [])
      setOfficers(Array.isArray(officerData) ? officerData : [])
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([
      getMappings(),
      getAdminUsers(ROLES.CLIENT),
      getAdminUsers(ROLES.REVIEWER),
      getAdminUsers(ROLES.COMPLIANCE_OFFICER),
    ])
      .then(([mappingData, clientData, reviewerData, officerData]) => {
        if (cancelled) return
        setMappings(Array.isArray(mappingData) ? mappingData : [])
        setClients(Array.isArray(clientData) ? clientData : [])
        setReviewers(Array.isArray(reviewerData) ? reviewerData : [])
        setOfficers(Array.isArray(officerData) ? officerData : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorDetails(err).message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const openCreate = () => {
    setForm(emptyMapping)
    setShowModal(true)
  }

  const openEdit = (mapping) => {
    setForm({
      id: mapping.id,
      clientId: mapping.client?.id ?? mapping.clientId ?? '',
      reviewerId: mapping.reviewer?.id ?? mapping.reviewerId ?? '',
      complianceOfficerId:
        mapping.complianceOfficer?.id ?? mapping.complianceOfficerId ?? '',
    })
    setShowModal(true)
  }

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      clientId: Number(form.clientId),
      reviewerId: Number(form.reviewerId),
      complianceOfficerId: Number(form.complianceOfficerId),
    }
    try {
      if (form.id) {
        await updateMapping(form.id, payload)
      } else {
        await createMapping(payload)
      }
      setShowModal(false)
      await loadAll()
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    setError('')
    try {
      await deleteMapping(id)
      await loadAll()
    } catch (err) {
      setError(getApiErrorDetails(err).message)
    }
  }

  return (
    <div className="stack">
      <div className="page-header-row">
        <h1>Client-to-Staff Mappings</h1>
        <button type="button" onClick={openCreate}>
          Create Mapping
        </button>
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {mappings.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Reviewer</th>
                <th>Compliance Officer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td>{mapping.id}</td>
                  <td>{getUserName(mapping.client)}</td>
                  <td>{getUserName(mapping.reviewer)}</td>
                  <td>{getUserName(mapping.complianceOfficer)}</td>
                  <td>
                    <div className="button-row">
                      <button type="button" onClick={() => openEdit(mapping)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => remove(mapping.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !loading ? (
        <div className="card">
          <p>No mappings found.</p>
        </div>
      ) : null}

      {showModal ? (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={save}>
            <h3>{form.id ? 'Edit Mapping' : 'Create Mapping'}</h3>

            <label className="field">
              <span>Client</span>
              <select
                required
                value={form.clientId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, clientId: event.target.value }))
                }
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName} ({client.id})
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Reviewer</span>
              <select
                required
                value={form.reviewerId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, reviewerId: event.target.value }))
                }
              >
                <option value="">Select Reviewer</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.fullName} ({reviewer.id})
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Compliance Officer</span>
              <select
                required
                value={form.complianceOfficerId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    complianceOfficerId: event.target.value,
                  }))
                }
              >
                <option value="">Select Compliance Officer</option>
                {officers.map((officer) => (
                  <option key={officer.id} value={officer.id}>
                    {officer.fullName} ({officer.id})
                  </option>
                ))}
              </select>
            </label>

            <div className="button-row">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default MappingsPage
