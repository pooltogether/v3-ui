import React, { useContext } from 'react'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolShow } from 'lib/components/PoolShow'

export default function IndexPage(props) {
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    pools,
    pool,
  } = poolDataContext

  return <>
    <PoolShow
      {...props}
      pool={pool}
    />
  </>
}
