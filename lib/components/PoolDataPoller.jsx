import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'

import { staticPoolQuery } from 'lib/queries/staticPoolQuery'
import { useInterval } from 'lib/hooks/useInterval'

export const PoolDataPoller = (
  props,
) => {
  const { children, client } = props

  if (!client) {
    return null
  }

  const { loading, error, data } = useQuery(staticPoolQuery)

  // const res = await fetch('https://api.thegraph.com/subgraphs/name/pooltogether/v3-kovan')
  // const poolData = await res.json()
  const poolData = {}

  return <>
    {children(poolData)}
  </>
}
