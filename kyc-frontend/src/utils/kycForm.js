import { KYC_TYPES } from '../constants/kyc.js'

const emptyOwner = {
  fullName: '',
  dateOfBirth: '',
  nationality: '',
  idNumber: '',
  ownershipPercentage: '',
}

export const EMPTY_KYC_FORM = {
  type: KYC_TYPES.INDIVIDUAL,
  fullLegalName: '',
  dateOfBirth: '',
  nationality: '',
  countryOfResidence: '',
  governmentIdNumber: '',
  residentialAddress: '',
  legalEntityName: '',
  registrationNumber: '',
  dateOfIncorporation: '',
  registeredBusinessAddress: '',
  beneficialOwners: [],
}

function nullsToEmptyStrings(values) {
  const result = { ...values }
  for (const key of Object.keys(result)) {
    if (result[key] === null) {
      result[key] = ''
    }
  }
  return result
}

export function toFormValues(kyc) {
  if (!kyc) return EMPTY_KYC_FORM
  return {
    ...EMPTY_KYC_FORM,
    ...nullsToEmptyStrings(kyc),
    beneficialOwners: Array.isArray(kyc.beneficialOwners)
      ? kyc.beneficialOwners.map((owner) => ({
          ...emptyOwner,
          ...nullsToEmptyStrings(owner ?? {}),
          ownershipPercentage:
            owner?.ownershipPercentage === null || owner?.ownershipPercentage === undefined
              ? ''
              : owner.ownershipPercentage,
        }))
      : [],
  }
}

export function toApiPayload(formValues) {
  return {
    ...formValues,
    beneficialOwners: Array.isArray(formValues.beneficialOwners)
      ? formValues.beneficialOwners.map((owner) => ({
          ...owner,
          ownershipPercentage:
            owner.ownershipPercentage === '' ? 0 : Number(owner.ownershipPercentage),
        }))
      : [],
  }
}

export function createEmptyOwner() {
  return { ...emptyOwner }
}
