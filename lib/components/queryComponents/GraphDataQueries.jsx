import React from 'react'

import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/DynamicPrizePoolsQuery'
import { DynamicPlayerQuery } from 'lib/components/queryComponents/DynamicPlayerQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/StaticPrizePoolsQuery'

export const GraphDataQueries = (props) => {
  const { children, usersAddress } = props

  return <StaticPrizePoolsQuery
    {...props}
  >
    {(staticPoolResult) => {
      const staticPoolData = staticPoolResult.poolData

      return <DynamicPrizePoolsQuery
        {...props}
      >
        {(dynamicPoolResult) => {
          const dynamicPoolData = dynamicPoolResult.poolData

          return <DynamicPlayerQuery
            {...props}
          >
            {(dynamicPlayerResult) => {
              const dynamicPlayerData = dynamicPlayerResult.playerData

              let loading = staticPoolResult.loading ||
                dynamicPoolResult.loading ||
                !staticPoolData ||
                !dynamicPoolData

              if (usersAddress) {
                loading = (dynamicPlayerResult.loading || !dynamicPlayerData)
              }

              return children({
                dynamicPoolData,
                dynamicPlayerData,
                staticPoolData,
                graphDataLoading: loading,
              })
            }}
          </DynamicPlayerQuery>

        }}
      </DynamicPrizePoolsQuery>
    }}
  </StaticPrizePoolsQuery>
}