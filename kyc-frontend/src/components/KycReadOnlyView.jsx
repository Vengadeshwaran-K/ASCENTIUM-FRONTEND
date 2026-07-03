import { KYC_TYPES } from '../constants/kyc.js'

function Row({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span>{value || '-'}</span>
    </div>
  )
}

function KycReadOnlyView({ kyc }) {
  if (!kyc) return null

  return (
    <div className="card">
      <Row label="Type" value={kyc.type} />
      {kyc.type === KYC_TYPES.INDIVIDUAL ? (
        <>
          <Row label="Full Legal Name" value={kyc.fullLegalName} />
          <Row label="Date of Birth" value={kyc.dateOfBirth} />
          <Row label="Nationality" value={kyc.nationality} />
          <Row label="Country of Residence" value={kyc.countryOfResidence} />
          <Row label="Government ID Number" value={kyc.governmentIdNumber} />
          <Row label="Residential Address" value={kyc.residentialAddress} />
        </>
      ) : (
        <>
          <Row label="Legal Entity Name" value={kyc.legalEntityName} />
          <Row label="Registration Number" value={kyc.registrationNumber} />
          <Row label="Date of Incorporation" value={kyc.dateOfIncorporation} />
          <Row label="Registered Business Address" value={kyc.registeredBusinessAddress} />
          <div className="detail-row detail-row-block">
            <span className="detail-label">Beneficial Owners</span>
            {Array.isArray(kyc.beneficialOwners) && kyc.beneficialOwners.length ? (
              <div>
                {kyc.beneficialOwners.map((owner, index) => (
                  <div key={`owner-view-${index}`} className="owner-item">
                    {owner.fullName} | {owner.nationality} | ID: {owner.idNumber} | %
                    {owner.ownershipPercentage}
                  </div>
                ))}
              </div>
            ) : (
              <span>-</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default KycReadOnlyView
