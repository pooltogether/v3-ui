import React from 'react'

import { DripQueries } from 'lib/components/queryComponents/DripQueries'

export function GraphPoolDripQueries(props) {
  const { children, pools } = props

  // TODO!
  /// hard-coded to just the DAI pool for now since that's all we have at the moment
  const pool = pools?.find(_pool => _pool?.symbol === 'PT-cDAI')

  if (!pool) {
    return children({
      dripDataLoading: null,
      graphDripData: null
    })
  }

  return <DripQueries
    {...props}
    pool={pool}
  >
    {({
      dripDataLoading,
      graphDripData,
    }) => {
      return children({
        dripDataLoading: dripDataLoading || !graphDripData,
        graphDripData,
      })
    }}
  </DripQueries>
}