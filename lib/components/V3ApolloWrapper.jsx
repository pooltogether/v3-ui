import React, { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
// import { ApolloProvider } from 'react-apollo'

import { v3ApolloClient } from 'lib/apollo/v3ApolloClient'
// import { ProviderManager } from 'lib/apollo/ProviderManager'
// import { ProviderManagerContext } from 'lib/components/ProviderManagerContext'
// import { TightbeamContext } from 'lib/components/TightbeamContext'

let clientPromise
export const V3ApolloWrapper = (props) => {
  const [client, setClient] = useState({})
  
  useEffect(() => {
    const getClient = async () => {
      if (typeof window === 'object') {
        if (!clientPromise) {
          clientPromise = v3ApolloClient()
        }

        const _client = await clientPromise
        setClient(_client)
      }
    }

    getClient()
  }, [])

  return <ApolloProvider
    client={client}
  >
    {props.children(client)}
  </ApolloProvider>
}
