import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/DynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/StaticPrizePoolsQuery'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { poolToast } from 'lib/utils/poolToast'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { chainId } = authControllerContext

  let addresses
  try {
    addresses = getContractAddresses(chainId)
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
            addresses={addresses}
          >
            {(staticResult) => {
              const staticPoolData = staticResult.poolData
              return <DynamicPrizePoolsQuery
                {...props}
                addresses={addresses}
              >
                {(dynamicResult) => {
                  const dynamicPoolData = dynamicResult.poolData
                  return <PoolDataContext.Provider
                    value={{
                      loading: staticResult.loading || dynamicResult.loading ||
                        !staticPoolData || !dynamicPoolData,
                      dynamicPoolData,
                      staticPoolData,
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
