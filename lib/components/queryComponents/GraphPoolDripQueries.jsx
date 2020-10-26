import React from 'react'

import { DripQueries } from 'lib/components/queryComponents/DripQueries'

export const GraphPoolDripQueries = (props) => {
  const { children, pool } = props

  if (!pool) {
    return children({
      dripDataLoading: null,
      graphDripData: null
    })
  }

  return <DripQueries
    {...props}
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