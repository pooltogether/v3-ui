import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { dynamicPlayerQuery } from 'lib/queries/dynamicPlayerQuery'
import { poolToast } from 'lib/utils/poolToast'

export const DynamicPlayerQuery = (
  props,
) => {
  const { children, usersAddress } = props
 
  let playerData

  // multiple queries at the same time, this or use apollo-link-batch (to prevent multiple re-renders)
  // const { loading: poolQueryLoading, error: poolQueryError, data: poolQueryData } = useQuery(poolquery, {})
  const { loading, error, data } = useQuery(dynamicPlayerQuery, {
    variables: {
      playerAddress: usersAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL,
    skip: !usersAddress
  })

  if (error) {
    poolToast.error(error)
    console.error(error)
  }

  if (data) {
    playerData = data.player
  }

  return children({ loading, playerData })
}
