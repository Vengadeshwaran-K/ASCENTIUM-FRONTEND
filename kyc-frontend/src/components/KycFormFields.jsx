import { KYC_TYPES } from '../constants/kyc.js'
import { createEmptyOwner } from '../utils/kycForm.js'

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function IndividualFields({ values, onChange, readOnly }) {
  return (
    <div className="grid">
      <Field label="Full Legal Name">
        <input
          value={values.fullLegalName}
          onChange={(event) => onChange('fullLegalName', event.target.value)}
          disabled={readOnly}
        />
      </Field>
      <Field label="Date of Birth">
        <input
          type="date"
          value={values.dateOfBirth || ''}
          onChange={(event) => onChange('dateOfBirth', event.target.value)}
          disabled={readOnly}
        />
      </Field>
      <Field label="Nationality">
        <input
          value={values.nationality}
          onChange={(event) => onChange('nationality', event.target.value)}
          disabled={readOnly}
        />
      </Field>
      <Field label="Country of Residence">
        <input
          value={values.countryOfResidence}
          onChange={(event) => onChange('countryOfResidence', event.target.value)}
          disabled={readOnly}
        />
      </Field>
      <Field label="Government ID Number">
        <input
          value={values.governmentIdNumber}
          onChange={(event) => onChange('governmentIdNumber', event.target.value)}
          disabled={readOnly}
        />
      </Field>
      <Field label="Residential Address">
        <textarea
          value={values.residentialAddress}
          onChange={(event) => onChange('residentialAddress', event.target.value)}
          disabled={readOnly}
          rows={2}
        />
      </Field>
    </div>
  )
}

function BusinessFields({ values, onChange, readOnly }) {
  const addOwner = () => {
    onChange('beneficialOwners', [...values.beneficialOwners, createEmptyOwner()])
  }

  const removeOwner = (index) => {
    onChange(
      'beneficialOwners',
      values.beneficialOwners.filter((_, ownerIndex) => ownerIndex !== index),
    )
  }

  const updateOwner = (index, key, value) => {
    onChange(
      'beneficialOwners',
      values.beneficialOwners.map((owner, ownerIndex) =>
        ownerIndex === index ? { ...owner, [key]: value } : owner,
      ),
    )
  }

  return (
    <>
      <div className="grid">
        <Field label="Legal Entity Name">
          <input
            value={values.legalEntityName}
            onChange={(event) => onChange('legalEntityName', event.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Registration Number">
          <input
            value={values.registrationNumber}
            onChange={(event) => onChange('registrationNumber', event.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Date of Incorporation">
          <input
            type="date"
            value={values.dateOfIncorporation || ''}
            onChange={(event) => onChange('dateOfIncorporation', event.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Registered Business Address">
          <textarea
            value={values.registeredBusinessAddress}
            onChange={(event) => onChange('registeredBusinessAddress', event.target.value)}
            disabled={readOnly}
            rows={2}
          />
        </Field>
      </div>

      <div className="section-title-row">
        <h3>Beneficial Owners</h3>
        {!readOnly ? (
          <button type="button" onClick={addOwner}>
            Add Owner
          </button>
        ) : null}
      </div>

      {values.beneficialOwners.length === 0 ? (
        <p className="subtle">No owners added.</p>
      ) : (
        values.beneficialOwners.map((owner, index) => (
          <div className="owner-card" key={`owner-${index}`}>
            <div className="owner-card-title">
              <strong>Owner #{index + 1}</strong>
              {!readOnly ? (
                <button type="button" className="btn-danger" onClick={() => removeOwner(index)}>
                  Remove
                </button>
              ) : null}
            </div>
            <div className="grid">
              <Field label="Full Name">
                <input
                  value={owner.fullName}
                  onChange={(event) => updateOwner(index, 'fullName', event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label="Date of Birth">
                <input
                  type="date"
                  value={owner.dateOfBirth || ''}
                  onChange={(event) => updateOwner(index, 'dateOfBirth', event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label="Nationality">
                <input
                  value={owner.nationality}
                  onChange={(event) => updateOwner(index, 'nationality', event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label="ID Number">
                <input
                  value={owner.idNumber}
                  onChange={(event) => updateOwner(index, 'idNumber', event.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <Field label="Ownership %">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={owner.ownershipPercentage}
                  onChange={(event) =>
                    updateOwner(index, 'ownershipPercentage', event.target.value)
                  }
                  disabled={readOnly}
                />
              </Field>
            </div>
          </div>
        ))
      )}
    </>
  )
}

function KycFormFields({ values, setValues, readOnly = false, lockType = false }) {
  const onChange = (key, value) => setValues((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="kyc-form">
      <h3>Step 1: KYC Type</h3>
      <div className="radio-row">
        <label>
          <input
            type="radio"
            name="type"
            checked={values.type === KYC_TYPES.INDIVIDUAL}
            onChange={() => onChange('type', KYC_TYPES.INDIVIDUAL)}
            disabled={readOnly || lockType}
          />
          Individual
        </label>
        <label>
          <input
            type="radio"
            name="type"
            checked={values.type === KYC_TYPES.BUSINESS}
            onChange={() => onChange('type', KYC_TYPES.BUSINESS)}
            disabled={readOnly || lockType}
          />
          Business
        </label>
      </div>

      <h3>Step 2: Details</h3>
      {values.type === KYC_TYPES.INDIVIDUAL ? (
        <IndividualFields values={values} onChange={onChange} readOnly={readOnly} />
      ) : (
        <BusinessFields values={values} onChange={onChange} readOnly={readOnly} />
      )}
    </div>
  )
}

export default KycFormFields
