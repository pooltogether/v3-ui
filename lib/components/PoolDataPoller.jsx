import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

import { staticPoolQuery } from 'lib/queries/staticPoolQuery'
import { useInterval } from 'lib/hooks/useInterval'

export const PoolDataPoller = (
  props,
) => {
  const { children, client } = props

  console.log('found!')
  console.log(client)

  if (Object.keys(client).length === 0 && client.constructor === Object) {
    console.log('always here')
    return null
  }
  console.log('hi!')

  // combine more prize pool queries here?
  const { loading, error, data } = useQuery(staticPoolQuery, {
    variables: {
      poolAddress: '0x59A0ED7BE8117369BDd1cd2C4e3C35958C5149f1'.toLowerCase()
    }
  })

  console.log('data', data)
  let daiPool
  if (data && data.prizePools && data.prizePools.length > 0) {
    daiPool = data.prizePools[0]
  }

  // if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error)
  } 

  console.log( data)

  // const res = await fetch('https://api.thegraph.com/subgraphs/name/pooltogether/v3-kovan')
  // const poolData = await res.json()
  const poolData = {
    daiPool
  }

  return <>
    {children(poolData)}
  </>
}
