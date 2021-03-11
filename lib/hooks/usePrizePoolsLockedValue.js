import gql from 'graphql-tag'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePrizePoolAddresses } from 'lib/hooks/usePrizePoolAddresses'
import { usePoolTogetherSubgraphClient } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraphClient'

export const usePrizePoolsLockedValue = () => {
  const { chainId } = useContext(AuthControllerContext)
  const graphQLClient = usePoolTogetherSubgraphClient()
  const prizePoolAddresses = usePrizePoolAddresses()

  return useQuery(
    [QUERY_KEYS.usePrizePools, chainId, prizePoolAddresses],
    async () => {
      return getPrizePoolsLockedValue(graphQLClient, prizePoolAddresses)
    },
    {
      enabled: chainId && !isEmpty(prizePoolAddresses),
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
    console.error(JSON.stringify(error, undefined, 2))
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
