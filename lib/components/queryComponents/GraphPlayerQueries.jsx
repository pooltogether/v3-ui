import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { dynamicPlayerQuery } from 'lib/queries/dynamicPlayerQuery'

export const GraphPlayerQueries = (props) => {
  const { children, playerAddress } = props

  let playerData

  const { loading, error, data } = useQuery(dynamicPlayerQuery, {
    variables: {
      playerAddress
    },
    fetchPolicy: 'network-only',
    pollInterval: MAINNET_POLLING_INTERVAL,
    skip: !playerAddress
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