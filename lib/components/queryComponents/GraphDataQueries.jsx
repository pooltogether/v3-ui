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
      dynamicSponsorData,
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
        dynamicSponsorData,
        graphDataLoading: loading,
        refetchPlayerQuery,
        refetchSponsorQuery,
      })
    }}
  </DynamicQueries>
}