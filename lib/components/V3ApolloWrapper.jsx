import React, { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { isEmpty } from 'lodash'

import { v3ApolloClient } from 'lib/apollo/v3ApolloClient'

let clientPromise
export const V3ApolloWrapper = (props) => {
  const [client, setClient] = useState({})

  const getClient = async () => {
    if (typeof window === 'object') {
      if (!clientPromise) {
        clientPromise = v3ApolloClient()
      }

      const _client = await clientPromise
      setClient(_client)
    }
  }
  
  useEffect(() => {
    getClient()
  }, [])

  if (isEmpty(client)) {
    return null
  } else {
    return <ApolloProvider
      client={client}
    >
      {props.children}
    </ApolloProvider>
  }

}
