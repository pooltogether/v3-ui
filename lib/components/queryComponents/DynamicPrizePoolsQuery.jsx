import React from 'react'
import { useQuery } from '@apollo/client'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { dynamicPrizePoolsQuery } from 'lib/queries/dynamicPrizePoolsQuery'

export const DynamicPrizePoolsQuery = (
  props,
) => {
  const { addresses, children, poolData } = props
  
  const { loading, error, data } = useQuery(dynamicPrizePoolsQuery, {
    pollInterval: MAINNET_POLLING_INTERVAL
  })

  if (data && data.prizePools && data.prizePools.length > 0) {
    const dynamicDaiData = data.prizePools.find(prizePool => addresses.daiPrizePool === prizePool.id)
    const dynamicUsdcData = data.prizePools.find(prizePool => addresses.usdcPrizePool === prizePool.id)
    const dynamicUsdtData = data.prizePools.find(prizePool => addresses.usdtPrizePool === prizePool.id)

    poolData.daiPool = { ...poolData.daiPool, ...dynamicDaiData }
    poolData.usdcPool = { ...poolData.usdcPool, ...dynamicUsdcData }
    poolData.usdtPool = { ...poolData.usdtPool, ...dynamicUsdtData }
  }

  if (error) {
    console.error(error)
  }
  
  return <>
    {children(poolData)}
  </>
}
