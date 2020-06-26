import React, { useContext } from 'react'

import {
  CONTRACT_ADDRESSES,
} from 'lib/constants'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/dynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/staticPrizePoolsQuery'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { nameToChainId } from 'lib/utils/nameToChainId'
import { poolToast } from 'lib/utils/poolToast'

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

  const daiPrizePoolAddress = CONTRACT_ADDRESSES[chainId].DAI_PRIZE_POOL_CONTRACT_ADDRESS
  const usdcPrizePoolAddress = CONTRACT_ADDRESSES[chainId].USDC_PRIZE_POOL_CONTRACT_ADDRESS
  const usdtPrizePoolAddress = CONTRACT_ADDRESSES[chainId].USDT_PRIZE_POOL_CONTRACT_ADDRESS

  if (!daiPrizePoolAddress) {
    console.error(`Unable to find DAI prize pool contract for chainId: ${chainId}`)
    poolToast.error(`Unable to find DAI prize pool contract for chainId: ${chainId}`)
    return null
  }

  const addresses = {
    daiPrizePool: daiPrizePoolAddress.toLowerCase(),
    usdcPrizePool: usdcPrizePoolAddress.toLowerCase(),
    usdtPrizePool: usdtPrizePoolAddress.toLowerCase(),
  }

  return <>
    <DynamicPrizePoolsQuery
      {...props}
      addresses={addresses}
      poolData={poolData}
    >
      {(poolData) => {
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
