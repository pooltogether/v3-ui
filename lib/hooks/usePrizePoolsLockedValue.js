import gql from 'graphql-tag'
import { request } from 'graphql-request'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'

import { POOLTOGETHER_CURRENT_GRAPH_URIS, QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePrizePoolAddresses } from 'lib/hooks/usePrizePoolAddresses'

export const usePrizePoolsLockedValue = () => {
  const { chainId } = useContext(AuthControllerContext)
  const prizePoolAddresses = usePrizePoolAddresses()

  return useQuery(
    [QUERY_KEYS.usePrizePools, chainId, prizePoolAddresses],
    async () => {
      return getPrizePoolsLockedValue(chainId, prizePoolAddresses)
    },
    {
      enabled: chainId && !isEmpty(prizePoolAddresses),
      refetchInterval: false
    }
  )
}

const getPrizePoolsLockedValue = async (chainId, prizePoolAddresses) => {
  const query = prizePoolsLockedValueQuery()

  const variables = { addresses: prizePoolAddresses.map((address) => address.toLowerCase()) }

  try {
    const subgraphData = await request(POOLTOGETHER_CURRENT_GRAPH_URIS[chainId], query, variables)

    return subgraphData.prizePools
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
