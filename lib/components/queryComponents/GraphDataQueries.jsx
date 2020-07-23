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
            loading = (dynamicDataLoading || !dynamicPlayerData)
          }

          console.log({dynamicPrizeStrategiesData})
          console.log({dynamicPlayerData})
          console.log({staticPoolData})
          console.log({staticPrizeStrategiesData})

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