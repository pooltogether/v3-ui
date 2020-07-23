import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { SUPPORTED_CHAIN_IDS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { poolToast } from 'lib/utils/poolToast'
import { readProvider } from 'lib/utils/readProvider'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress } = authControllerContext

  const [defaultReadProvider, setDefaultReadProvider] = useState({})

  const router = useRouter()
  const ticker = router.query.prizePoolTicker && router.query.prizePoolTicker.toLowerCase()

  const networkName = chainId ?
    chainIdToName(chainId) :
    process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])
  
  let loading = true

  if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
    return <PoolDataContext.Provider
      value={{
        chainId,
        loading: false,
        unsupportedNetwork: true,
        pool: null,
        pools: [],
      }}
    >
      {props.children}
    </PoolDataContext.Provider>
  }


  let poolAddresses
  try {
    poolAddresses = getContractAddresses(chainId)
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }

  
  return <>
    <V3ApolloWrapper>
      {(client) => {

        // check if client is ready
        if (isEmptyObject(client)) {
          // console.log('client not ready')
          return null
        } else {
          // OPTIMIZE: This is causing double renders, I believe each polling
          // query causes a re-render it should wait until all the data is ready
          // before re-rendering
          return <GraphDataQueries
            {...props}
            poolAddresses={poolAddresses}
            usersAddress={usersAddress}
          >
            {({ graphDataLoading, staticPoolData, dynamicPoolData, dynamicPlayerData }) => {
              return <FetchGenericChainData
                {...props}
                chainId={chainId}
                provider={defaultReadProvider}
                poolAddresses={poolAddresses}
              >
                {({ genericChainData }) => {
                  let pools = []

                  if (!graphDataLoading) {
                    pools = [
                      {
                        ...genericChainData.daiPrizeStrategy,
                        ...dynamicPoolData.daiPool,
                        ...dynamicPoolData.daiPrizeStrategy,
                        ...staticPoolData.daiPool,
                        ...staticPoolData.daiPrizeStrategy,
                        // prize: 9591,
                        risk: 5,
                        yieldSource: 'mStable',
                        frequency: 'Weekly',
                      },
                      {
                        ...genericChainData.usdcPrizeStrategy,
                        ...dynamicPoolData.usdcPool,
                        ...dynamicPoolData.usdcPrizeStrategy,
                        ...staticPoolData.usdcPool,
                        ...staticPoolData.usdcPrizeStrategy,
                        // prize: (11239 / 7),
                        risk: 3,
                        yieldSource: 'AAVE',
                        frequency: 'Daily',
                      },
                      {
                        ...genericChainData.usdtPrizeStrategy,
                        ...dynamicPoolData.usdtPool,
                        ...dynamicPoolData.usdtPrizeStrategy,
                        ...staticPoolData.usdtPool,
                        ...staticPoolData.usdtPrizeStrategy,
                        // prize: 7001,
                        risk: 2,
                        yieldSource: 'Compound',
                        frequency: 'Weekly',
                      },
                    ]
                  }

                  let pool
                  if (ticker) {
                    pool = pools.find(_pool => {
                      let symbol
                      if (_pool && _pool.underlyingCollateralSymbol) {
                        symbol = _pool.underlyingCollateralSymbol.toLowerCase()
                      }

                      if (_pool && symbol) {
                        return symbol === ticker
                      }
                    })
                  }

                  let usersTicketBalance = 0
                  let usersTicketBalanceBN = ethers.utils.bigNumberify(0)

                  if (pool && dynamicPlayerData) {
                    const poolAddress = pool && pool.id
                    const player = dynamicPlayerData.find(data => data.prizePool.id === poolAddress)

                    if (player) {
                      usersTicketBalance = Number(ethers.utils.formatUnits(
                        player.balance,
                        pool.underlyingCollateralDecimals
                      ))
                      usersTicketBalanceBN = ethers.utils.bigNumberify(player.balance)
                    }
                  }



                  return <FetchUsersChainData
                    {...props}
                    provider={defaultReadProvider}
                    pool={pool}
                    usersAddress={usersAddress}
                  >
                    {({ usersChainData }) => {
                      return <PoolDataContext.Provider
                        value={{
                          chainId,
                          loading: graphDataLoading,
                          pool,
                          pools,
                          poolAddresses,
                          dynamicPoolData,
                          dynamicPlayerData,
                          staticPoolData,
                          genericChainData,
                          usersChainData,
                          usersTicketBalance,
                          usersTicketBalanceBN,
                        }}
                      >
                        {props.children}
                      </PoolDataContext.Provider>


                    }}
                  </FetchUsersChainData>
                }}
              </FetchGenericChainData>
            }}
          </GraphDataQueries>
        }

        
      }}
    </V3ApolloWrapper>
  </>
}
