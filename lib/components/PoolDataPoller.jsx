import React, { useEffect } from 'react'

import { useInterval } from 'lib/hooks/useInterval'

export const PoolDataPoller = (
  props,
) => {
  const { children } = props
  // const res = await fetch('https://api.thegraph.com/subgraphs/name/pooltogether/v3-kovan')
  // const poolData = await res.json()
  const poolData = {}

  return <>
    {children(poolData)}
  </>
}
