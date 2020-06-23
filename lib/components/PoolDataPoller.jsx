import React from 'react'
import { useQuery } from '@apollo/client'

import {
  CONTRACT_ADDRESSES,
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { staticPrizePoolsQuery } from 'lib/queries/staticPrizePoolsQuery'
import { nameToChainId } from 'lib/utils/nameToChainId'

export const PoolDataPoller = (
  props,
) => {
  let { chainId } = props
  const { children, client } = props

  let daiPool,
    usdcPool,
    usdtPool

  // check if client is ready
  if (Object.keys(client).length === 0 && client.constructor === Object) {
    return null
  }

  if (!chainId) {
    chainId = nameToChainId(process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
  }
  
  const daiPoolAddress = CONTRACT_ADDRESSES[chainId].DAI_PRIZE_POOL_CONTRACT_ADDRESS.toLowerCase()
  const usdcPoolAddress = CONTRACT_ADDRESSES[chainId].USDC_PRIZE_POOL_CONTRACT_ADDRESS.toLowerCase()
  const usdtPoolAddress = CONTRACT_ADDRESSES[chainId].USDT_PRIZE_POOL_CONTRACT_ADDRESS.toLowerCase()

  const { loading, error, data } = useQuery(staticPrizePoolsQuery, {
    fetchPolicy: 'network-only',
    // pollInterval: MAINNET_POLLING_INTERVAL
  })

  if (data && data.prizePools && data.prizePools.length > 0) {
    daiPool = data.prizePools.find(prizePool => daiPoolAddress === prizePool.id)
    usdcPool = data.prizePools.find(prizePool => usdcPoolAddress === prizePool.id)
    usdtPool = data.prizePools.find(prizePool => usdtPoolAddress === prizePool.id)
  }

  if (error) {
    console.error(error)
  }

  const poolData = {
    daiPool,
    usdcPool,
    usdtPool,
  }

  return <>
    {children(poolData)}
  </>
}
