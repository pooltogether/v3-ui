import React from 'react'

import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/DynamicPrizePoolsQuery'
import { DynamicPlayerQuery } from 'lib/components/queryComponents/DynamicPlayerQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/StaticPrizePoolsQuery'

export const GraphDataQueries = (props) => {
  const { children, poolAddresses } = props

  return <StaticPrizePoolsQuery
    {...props}
    addresses={poolAddresses}
  >
    {(staticPoolResult) => {
      const staticPoolData = staticPoolResult.poolData

      return <DynamicPrizePoolsQuery
        {...props}
        addresses={poolAddresses}
      >
        {(dynamicPoolResult) => {
          const dynamicPoolData = dynamicPoolResult.poolData

          return <DynamicPlayerQuery
            {...props}
            addresses={poolAddresses}
          >
            {(dynamicPlayerResult) => {
              const dynamicPlayerData = dynamicPlayerResult.playerData

              const graphDataLoading = staticPoolResult.loading ||
                dynamicPoolResult.loading ||
                dynamicPlayerResult.loading ||
                !staticPoolData ||
                !dynamicPoolData ||
                !dynamicPlayerData

              return children({
                dynamicPoolData,
                dynamicPlayerData,
                staticPoolData,
                graphDataLoading,
              })
            }}
          </DynamicPlayerQuery>

        }}
      </DynamicPrizePoolsQuery>
    }}
  </StaticPrizePoolsQuery>
}