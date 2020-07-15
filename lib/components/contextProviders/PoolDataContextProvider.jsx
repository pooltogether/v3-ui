import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/DynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/StaticPrizePoolsQuery'
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
  
  return <>
    <V3ApolloWrapper>
      {(client) => {
        // check if client is ready
        if (isEmptyObject(client)) {
          // console.log('client not ready')
          return null
        } else {
          return <StaticPrizePoolsQuery
            {...props}
            addresses={poolAddresses}
          >
            {(staticResult) => {
              const staticPoolData = staticResult.poolData

              return <DynamicPrizePoolsQuery
                {...props}
                addresses={poolAddresses}
              >
                {(dynamicResult) => {
                  const dynamicPoolData = dynamicResult.poolData

                  const graphDataLoading = staticResult.loading || dynamicResult.loading ||
                    !staticPoolData || !dynamicPoolData

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


                  const networkName = router.query.networkName ?
                    router.query.networkName :
                    'mainnet'

                  useEffect(() => {
                    const getReadProvider = async () => {
                      const defaultReadProvider = await readProvider(networkName)
                      setDefaultReadProvider(defaultReadProvider)
                    }
                    getReadProvider()
                  }, [networkName])

                  


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
                              // loading: graphDataLoading,
                              pool,
                              pools,
                              poolAddresses,
                              dynamicPoolData,
                              staticPoolData,
                              genericChainData,
                              usersChainData,
                            }}
                          >
                            {props.children}
                          </PoolDataContext.Provider>


                        }}
                      </FetchUsersChainData>
                    }}
                  </FetchGenericChainData>

                  
                }}
              </DynamicPrizePoolsQuery>


            }}
          </StaticPrizePoolsQuery>
        }

        
      }}
    </V3ApolloWrapper>
  </>
}
