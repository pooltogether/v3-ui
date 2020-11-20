import { useContext } from 'react'
import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { prizePoolDripsQuery } from 'lib/queries/prizePoolDripsQuery'

const debug = require('debug')('pool-app:DripQueries')

export const DripQueries = (
  props,
) => {
  const { pool, children } = props

  const { paused } = useContext(GeneralContext)

  let graphDripData

  const variables = {
    prizeStrategyAddress: pool?.prizeStrategy?.id
  }

  const { loading, error, data } = useQuery(prizePoolDripsQuery, {
    variables,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
    skip: !pool?.prizeStrategy,
  })

  if (error) {
    console.error(error)
  }

  graphDripData = data

  return children({
    dripDataLoading: loading,
    graphDripData,
  })
}
