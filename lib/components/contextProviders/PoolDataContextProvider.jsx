import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { FetchGenericChainData } from 'lib/components/FetchGenericChainData'
import { FetchUsersChainData } from 'lib/components/FetchUsersChainData'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/DynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/StaticPrizePoolsQuery'
import { useInterval } from 'lib/hooks/useInterval'
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

                  
                  if (pool) {
                    console.log({ pool: pool.id })
                  } else {
                    console.log('pool', pool)
                  }


                  return <FetchGenericChainData
                    {...props}
                    provider={defaultReadProvider}
                    pool={pool}
                  >
                    {(genericChainData) => {
                      return <FetchUsersChainData
                        {...props}
                        provider={defaultReadProvider}
                        pool={pool}
                        usersAddress={usersAddress}
                      >
                        {(usersChainData) => {
                          
                          

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




                  // const [poolAddresses, setPoolAddresses] = useState({})
                  const [genericChainValues, setGenericChainValues] = useState({
                    loading: true,
                    // tokenSymbol: 'TOKEN',
                    // poolTotalSupply: '1234',
                  })

                  const [usersChainValues, setUsersChainValues] = useState({
                    loading: true,
                    // usersTicketBalance: ethers.utils.bigNumberify(0),
                    // usersTokenAllowance: ethers.utils.bigNumberify(0),
                    // usersTokenBalance: ethers.utils.bigNumberify(0),
                  })

                  const fetchInfura = () => {
                    return fetchChainData(
                      networkName,
                      usersAddress,
                      pool,
                    )
                  }

                  useInterval(() => {
                    if (pool) {
                      // console.log('run int')
                      fetchInfura()
                    }
                  }, MAINNET_POLLING_INTERVAL)

                  useEffect(() => {
                    if (pool && genericChainValues.loading) {
                      // console.log('run for generic')
                      const genericValues = fetchInfura()

                      setGenericChainValues(existingValues => ({
                        ...existingValues,
                        ...genericValues,
                        loading: false,
                      }))
                    }
                  }, [pool])

                  useEffect(() => {
                    if (pool && usersAddress && usersChainValues.loading) {
                      // console.log('run for users values')
                      const usersValues = fetchInfura()

                      setUsersChainValues(existingValues => ({
                        ...existingValues,
                        ...usersValues,
                        loading: false,
                      }))
                    }
                  }, [pool && pool.id, usersAddress])

                  useEffect(() => {
                    // console.log('resetting users chain values')
                    setUsersChainValues({
                      loading: true,
                    })
                  }, [pool && pool.id, usersAddress])

                  useEffect(() => {
                    // console.log('resetting generic chain values')
                    setGenericChainValues({
                      loading: true,
                    })
                  }, [pool && pool.id])




                  // useEffect(() => {
                  //   if (ethBalance) {
                  //     setEthBalance(ethers.utils.bigNumberify(ethBalance))
                  //   }
                  // }, [authControllerContext])

                  // if (poolAddresses.error || genericChainValues.error || usersChainValues.error) {
                  //   if (poolAddresses.error) {
                  //     renderErrorMessage(prizePool, 'pool addresses', poolAddresses.errorMessage)
                  //   }

                  //   if (genericChainValues.error) {
                  //     renderErrorMessage(prizePool, 'generic chain values', genericChainValues.errorMessage)
                  //   }

                  //   if (usersChainValues.error) {
                  //     renderErrorMessage(prizePool, `user's chain values`, usersChainValues.errorMessage)
                  //   }

                  //   // router.push(
                  //   //   `/`,
                  //   //   `/`,
                  //   //   {
                  //   //     shallow: true
                  //   //   }
                  //   // )
                  // }




                  
                }}
              </DynamicPrizePoolsQuery>


            }}
          </StaticPrizePoolsQuery>
        }

        
      }}
    </V3ApolloWrapper>
  </>
}
