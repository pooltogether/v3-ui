import React from 'react'

import { DynamicQueries } from 'lib/components/queryComponents/DynamicQueries'
import { StaticQueries } from 'lib/components/queryComponents/StaticQueries'

export const GraphDataQueries = (props) => {
  const { children, usersAddress } = props

  return <StaticQueries
    {...props}
  >
    {({ staticDataLoading, staticPoolData, staticPrizeStrategiesData }) => {
      return <DynamicQueries
        {...props}
      >
        {({ dynamicDataLoading, dynamicPoolData, dynamicPrizeStrategiesData, dynamicPlayerData }) => {
          let loading = staticDataLoading ||
            dynamicDataLoading ||
            !staticPrizeStrategiesData ||
            !staticPoolData ||
            !dynamicPrizeStrategiesData ||
            !dynamicPoolData

          if (usersAddress) {
            console.log({ dynamicPlayerData})
            loading = (dynamicDataLoading || !dynamicPlayerData)
          }

          return children({
            dynamicPoolData,
            dynamicPrizeStrategiesData,
            dynamicPlayerData,
            staticPoolData,
            staticPrizeStrategiesData,
            graphDataLoading: loading,
          })
        }}
      </DynamicQueries>
    }}
  </StaticQueries>
}