import React, { useState } from 'react'

import { V3ApolloWrapper } from 'lib/components/V3ApolloWrapper'
import { PoolDataPoller } from 'lib/components/PoolDataPoller'

export const PoolDataContext = React.createContext()

export const PoolDataContextProvider = (props) => {
  return <>
    <V3ApolloWrapper>
      {(client) => {
        return <PoolDataPoller
          client={client}
        >
          {(poolData) => {
            console.log({ poolData })   
            return <PoolDataContext.Provider
              value={{
                poolData
              }}
            >
              {props.children}
            </PoolDataContext.Provider>
          }}
        </PoolDataPoller>
      }}
    </V3ApolloWrapper>
  </>
}
