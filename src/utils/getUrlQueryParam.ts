/**
 * Lowercases everything
 * @param key query param key
 * @param defaultValue default value if the data is invalid
 * @param validOptions
 * @returns
 */
export const getUrlQueryParam = (
  key: string,
  defaultValue: string = null,
  validOptions?: string[],
  validiyChecks?: ((v: any) => boolean)[]
) => {
  let url
  if (typeof window !== 'undefined') {
    url = new URL(window.location.href)
  } else {
    return defaultValue
  }
  const queryParamValue = url.searchParams.get(key)?.toLowerCase()
  if (!queryParamValue) {
    return defaultValue
  } else if (!validOptions && !validiyChecks) {
    return queryParamValue
  } else if (validOptions?.includes(queryParamValue)) {
    return queryParamValue
  } else if (validiyChecks?.every((check) => check(queryParamValue))) {
    return queryParamValue
  }
  return defaultValue
}
