import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePoolDripsQuery } from 'lib/hooks/usePoolDripsQuery'

const debug = require('debug')('pool-app:DripQueries')

export const DripQueries = (
  props,
) => {
  const { pool, children } = props

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const {
    status,
    data: graphDripData,
    error,
    isFetching
  } = usePoolDripsQuery(pauseQueries, chainId, pool)

  console.log(graphDripData)


  if (error) {
    console.error(error)
  }

  return children({
    dripDataLoading: isFetching,
    graphDripData,
  })
}
