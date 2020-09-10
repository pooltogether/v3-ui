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