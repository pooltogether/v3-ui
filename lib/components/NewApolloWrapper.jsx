import React, { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
// import { ApolloProvider } from 'react-apollo'

import { newApolloClient } from 'lib/apollo/newApolloClient'
// import { ProviderManager } from 'lib/apollo/ProviderManager'
// import { ProviderManagerContext } from 'lib/components/ProviderManagerContext'
// import { TightbeamContext } from 'lib/components/TightbeamContext'

let clientPromise
export const NewApolloWrapper = (props) => {
  const [client, setClient] = useState({})
  
  useEffect(() => {
    const getClient = async () => {
      if (typeof window === 'object') {
        if (!clientPromise) {
          clientPromise = newApolloClient()
        }

        const _client = await clientPromise
        console.log(_client)
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
