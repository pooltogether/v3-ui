import gql from 'graphql-tag'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { usePrizePoolAddresses } from 'lib/hooks/usePrizePoolAddresses'
import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'

export const usePrizePoolsLockedValue = () => {
  const graphQLClient = usePoolTogetherSubgraph310Client()
  const prizePoolAddresses = usePrizePoolAddresses()

  return useQuery(
    [QUERY_KEYS.usePrizePoolsLockedValue, graphQLClient.url, prizePoolAddresses],
    async () => {
      return getPrizePoolsLockedValue(graphQLClient, prizePoolAddresses)
    },
    {
      enabled: graphQLClient.url && !isEmpty(prizePoolAddresses),
      refetchInterval: false
    }
  )
}

const getPrizePoolsLockedValue = async (graphQLClient, prizePoolAddresses) => {
  const query = prizePoolsLockedValueQuery()

  const variables = { addresses: prizePoolAddresses.map((address) => address.toLowerCase()) }

  let data
  try {
    data = await graphQLClient.request(query, variables)

    return data.prizePools
  } catch (error) {
    console.error(error)
    return
  }
}

const prizePoolsLockedValueQuery = () => {
  return gql`
    query prizePoolsQuery($addresses: [ID!]) {
      prizePools(where: { id_in: $addresses }) {
        id
        underlyingCollateralDecimals
        underlyingCollateralToken

        prizeStrategy {
          id
          multipleWinners {
            ticket {
              totalSupply
            }
            sponsorship {
              totalSupply
            }
          }
        }

        compoundPrizePool {
          cToken {
            id
          }
        }
      }
    }
  `
}
