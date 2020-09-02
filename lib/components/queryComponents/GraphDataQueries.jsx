import React from 'react'

import { DynamicQueries } from 'lib/components/queryComponents/DynamicQueries'

export const GraphDataQueries = (props) => {
  const { children, usersAddress } = props

  // OPTIMIZE: Only query pools we care about instead of getting every
  // pool / strategy and filtering them
  return <DynamicQueries
    {...props}
  >
    {({
      dynamicDataLoading,
      dynamicPoolData,
      dynamicPrizeStrategiesData,
      dynamicPlayerData,
      refetchPlayerQuery
    }) => {
      let loading = dynamicDataLoading ||
        !dynamicPrizeStrategiesData ||
        !dynamicPoolData

      if (usersAddress) {
        loading = (dynamicDataLoading || !dynamicPlayerData)
      }

      return children({
        dynamicPoolData,
        dynamicPrizeStrategiesData,
        dynamicPlayerData,
        graphDataLoading: loading,
        refetchPlayerQuery
      })
    }}
  </DynamicQueries>
}