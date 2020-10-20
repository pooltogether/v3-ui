import React from 'react'

import { DynamicQueries } from 'lib/components/queryComponents/DynamicQueries'

export const GraphDataQueries = (props) => {
  const { children, usersAddress } = props

  return <DynamicQueries
    {...props}
  >
    {({
      dynamicDataLoading,
      dynamicPoolData,
      dynamicPrizeStrategiesData,
      dynamicPlayerData,
      dynamicPlayerDrips,
      dynamicSponsorData,
      refetchPoolQuery,
      refetchPrizeStrategyQuery,
      refetchPlayerQuery,
      refetchSponsorQuery,
    }) => {
      let loading = dynamicDataLoading ||
        !dynamicPrizeStrategiesData ||
        !dynamicPoolData

      if (usersAddress) {
        loading = (dynamicDataLoading || !dynamicPlayerData || !dynamicSponsorData)
      }

      return children({
        dynamicPoolData,
        dynamicPrizeStrategiesData,
        dynamicPlayerData,
        dynamicPlayerDrips,
        dynamicSponsorData,
        graphDataLoading: loading,
        refetchPoolQuery,
        refetchPrizeStrategyQuery,
        refetchPlayerQuery,
        refetchSponsorQuery,
      })
    }}
  </DynamicQueries>
}