import React from 'react'
import { useQuery } from '@apollo/client'

import { staticPrizePoolsQuery } from 'lib/queries/staticPrizePoolsQuery'

export const StaticPrizePoolsQuery = (
  props,
) => {
  const { addresses, children, poolData } = props

  // this should only run once:
  const { loading, error, data } = useQuery(staticPrizePoolsQuery, {
    fetchPolicy: 'network-only',
  })

  if (data && data.prizePools && data.prizePools.length > 0) {
    const staticDaiData = data.prizePools.find(prizePool => addresses.daiPrizePool === prizePool.id)
    const staticUsdcData = data.prizePools.find(prizePool => addresses.usdcPrizePool === prizePool.id)
    const staticUsdtData = data.prizePools.find(prizePool => addresses.usdtPrizePool === prizePool.id)

    poolData.daiPool = { ...poolData.daiPool, ...staticDaiData }
    poolData.usdcPool = { ...poolData.usdcPool, ...staticUsdcData }
    poolData.usdtPool = { ...poolData.usdtPool, ...staticUsdtData }
  }

  if (error) {
    console.error(error)
  }
  
  return <>
    {children(poolData)}
  </>
}
