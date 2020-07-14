import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import {
  MAINNET_POLLING_INTERVAL
} from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/DynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/StaticPrizePoolsQuery'
import { useInterval } from 'lib/hooks/useInterval'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { fetchChainData } from 'lib/utils/fetchChainData'
import { poolToast } from 'lib/utils/poolToast'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  const router = useRouter()
  const ticker = router.query.prizePoolTicker && router.query.prizePoolTicker.toLowerCase()
  
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId, usersAddress, provider } = authControllerContext

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

                  const loading = staticResult.loading || dynamicResult.loading ||
                    !staticPoolData || !dynamicPoolData



                  let pools = []
                  if (!loading) {
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


                  const networkName = router.query.networkName ?
                    router.query.networkName :
                    'mainnet'

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

                  useInterval(() => {
                    if (pool) {
                      fetchChainData(
                        networkName,
                        usersAddress,
                        pool,
                        setGenericChainValues,
                        setUsersChainValues,
                      )
                    }
                  }, MAINNET_POLLING_INTERVAL)

                  useEffect(() => {
                    if (pool) {
                      fetchChainData(
                        networkName,
                        usersAddress,
                        pool,
                        setGenericChainValues,
                        setUsersChainValues,
                      )
                    }
                  }, [usersAddress]) //, pool


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




                  return <PoolDataContext.Provider
                    value={{
                      loading,
                      dynamicPoolData,
                      genericChainValues,
                      pools,
                      pool,
                      poolAddresses,
                      staticPoolData,
                      usersChainValues,
                    }}
                  >
                    {props.children}
                  </PoolDataContext.Provider>
                }}
              </DynamicPrizePoolsQuery>


            }}
          </StaticPrizePoolsQuery>
        }

        
      }}
    </V3ApolloWrapper>
  </>
}
