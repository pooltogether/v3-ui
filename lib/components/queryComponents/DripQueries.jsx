import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { usePoolDripsQuery } from 'lib/hooks/usePoolDripsQuery'

const debug = require('debug')('pool-app:DripQueries')

export const DripQueries = (
  props,
) => {
  const { pool, children } = props

  const { chainId } = useContext(AuthControllerContext)
  const { paused } = useContext(GeneralContext)

  const {
    status,
    data: graphDripData,
    error,
    isFetching
  } = usePoolDripsQuery(chainId, pool)

  if (error) {
    console.error(error)
  }

  return children({
    dripDataLoading: isFetching,
    graphDripData,
  })
}
