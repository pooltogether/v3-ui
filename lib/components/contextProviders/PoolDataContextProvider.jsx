import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { GraphDataQueries } from 'lib/components/queryComponents/GraphDataQueries'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { poolToast } from 'lib/utils/poolToast'
import { readProvider } from 'lib/utils/readProvider'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  const [defaultReadProvider, setDefaultReadProvider] = useState({})

  const router = useRouter()
  const ticker = router.query.prizePoolTicker && router.query.prizePoolTicker.toLowerCase()
  
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress } = authControllerContext

  let poolAddresses
  try {
    poolAddresses = getContractAddresses(chainId)
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }

  const networkName = router.query.networkName ?
    router.query.networkName :
    process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

  useEffect(() => {
    const getReadProvider = async () => {
      const defaultReadProvider = await readProvider(networkName)
      setDefaultReadProvider(defaultReadProvider)
    }
    getReadProvider()
  }, [networkName])
  
  let loading = true
  
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
              let pools = []

              if (!graphDataLoading) {
                pools = [
                  {
                    ...dynamicPoolData.daiPool,
                    ...staticPoolData.daiPool,
                    prize: 9591,
                    risk: 5,
                    yieldSource: 'mStable',
                    frequency: 'Weekly',
                  },
                  {
                    ...dynamicPoolData.usdcPool,
                    ...staticPoolData.usdcPool,
                    prize: (11239 / 7),
                    risk: 3,
                    yieldSource: 'AAVE',
                    frequency: 'Daily',
                  },
                  {
                    ...dynamicPoolData.usdtPool,
                    ...staticPoolData.usdtPool,
                    prize: 7001,
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

              // if (pool) {
              //   console.log({
              //     poolAddress: pool.id,
              //     underlyingCollateralSymbol: pool.underlyingCollateralSymbol,
              //     underlyingCollateralToken: pool.underlyingCollateralToken,
              //     usersAddress: usersAddress,
              //   })
              // }
              // if (pool) {
              //   console.log({ pool: pool.id })
              // } else {
              //   console.log('pool', pool)
              // }

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

              loading = graphDataLoading

              return <FetchGenericChainData
                {...props}
                provider={defaultReadProvider}
                pool={pool}
              >
                {({ genericChainData }) => {
                  return <FetchUsersChainData
                    {...props}
                    provider={defaultReadProvider}
                    pool={pool}
                    usersAddress={usersAddress}
                  >
                    {({ usersChainData }) => {
                      return <PoolDataContext.Provider
                        value={{
                          loading,
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
