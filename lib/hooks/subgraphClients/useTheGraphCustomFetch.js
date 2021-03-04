import { useAtom } from 'jotai'
import { graphQLErrorAtom } from 'lib/atoms/graphQLErrorAtom'

const retryCodes = [408, 500, 502, 503, 504, 522, 524]

export const useTheGraphCustomFetch = () => {
  const [_, setGraphQLError] = useAtom(graphQLErrorAtom)

  const theGraphCustomFetch = (request, options, retries = 3) =>
    fetch(request, options)
      .then((response) => {
        if (response.ok) return response

        if (retries > 0 && retryCodes.includes(response.status)) {
          return theGraphCustomFetch(request, options, retries - 1)
        }

        throw new Error(JSON.stringify(response))
      })
      .catch((reason) => {
        setGraphQLError(true)
        return reason
      })

  return theGraphCustomFetch
}
