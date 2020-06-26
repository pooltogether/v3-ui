import React, { useContext } from 'react'

import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/dynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/staticPrizePoolsQuery'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { getChainId } from 'lib/services/getChainId'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
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
  const chainId = getChainId(walletContext)

  let addresses
  try {
    addresses = getContractAddresses(chainId)
  } catch (e) {
    poolToast.error(e)
    console.error(e)
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
            console.log({ poolData})
            return children(poolData)
          }}
        </StaticPrizePoolsQuery>
      }}
    </DynamicPrizePoolsQuery>
  </>
}
