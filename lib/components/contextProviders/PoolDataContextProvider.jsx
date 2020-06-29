import React, { useContext } from 'react'

import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { DynamicPrizePoolsQuery } from 'lib/components/queryComponents/dynamicPrizePoolsQuery'
import { StaticPrizePoolsQuery } from 'lib/components/queryComponents/staticPrizePoolsQuery'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { getChainId } from 'lib/services/getChainId'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { isEmptyObject } from 'lib/utils/isEmptyObject'
import { poolToast } from 'lib/utils/poolToast'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  const walletContext = useContext(WalletContext)
  const chainId = getChainId(walletContext)

  let addresses
  try {
    addresses = getContractAddresses(chainId)
    console.log({ chainId})
  } catch (e) {
    console.log('hi')
    poolToast.error(e)
    console.error(e)
  }

  console.log({ addresses })
  
  return <>
    <V3ApolloWrapper>
      {(client) => {


        // check if client is ready
        if (isEmptyObject(client)) {
          console.log('client not ready')
          return null
        } else {
          return <StaticPrizePoolsQuery
            {...props}
            addresses={addresses}
          >
            {(staticPoolData) => {

              return <DynamicPrizePoolsQuery
                {...props}
                addresses={addresses}
              >
                {(dynamicPoolData) => {
                  return <PoolDataContext.Provider
                    value={{
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
