import React, { useContext } from 'react'

import {
  CONTRACT_ADDRESSES,
} from 'lib/constants'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/dynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/staticPrizePoolsQuery'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { nameToChainId } from 'lib/utils/nameToChainId'

export const PoolDataPoller = (
  props,
) => {
  const { client, children } = props

  // check if client is ready
  if (isEmptyObject(client)) {
    return null
  }

  let poolData = {
    daiPool: {},
    usdcPool: {},
    usdtPool: {},
  }

  const walletContext = useContext(WalletContext)
  let chainId = walletContext._onboard.getState().appNetworkId
  if (!chainId) {
    chainId = nameToChainId(process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME)
  }

  const addresses = {
    daiPrizePool: CONTRACT_ADDRESSES[chainId].DAI_PRIZE_POOL_CONTRACT_ADDRESS.toLowerCase(),
    usdcPrizePool: CONTRACT_ADDRESSES[chainId].USDC_PRIZE_POOL_CONTRACT_ADDRESS.toLowerCase(),
    usdtPrizePool: CONTRACT_ADDRESSES[chainId].USDT_PRIZE_POOL_CONTRACT_ADDRESS.toLowerCase(),
  }

  return <>
    <DynamicPrizePoolsQuery
      {...props}
      addresses={addresses}
      poolData={poolData}
    >
      {(poolData) => {
        console.log({ poolData})
        return <StaticPrizePoolsQuery
          {...props}
          addresses={addresses}
          poolData={poolData}
        >
          {(poolData) => {
            return children(poolData)
          }}
        </StaticPrizePoolsQuery>
      }}
    </DynamicPrizePoolsQuery>
  </>
}
