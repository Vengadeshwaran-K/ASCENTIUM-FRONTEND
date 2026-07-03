export function getApiErrorDetails(error) {
  const response = error?.response
  const data = response?.data

  const message =
    data?.message ??
    data?.error ??
    error?.message ??
    'Something went wrong. Please try again.'

  const errors = Array.isArray(data?.errors)
    ? data.errors
    : Array.isArray(data?.fieldErrors)
      ? data.fieldErrors.map((fieldError) => fieldError?.message).filter(Boolean)
      : []

  return {
    status: response?.status,
    message,
    errors,
    raw: data,
  }
}
