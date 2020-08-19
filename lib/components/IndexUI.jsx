import React, { useContext } from 'react'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { IndexUIPlaceholder } from 'lib/components/IndexUIPlaceholder'
import { PoolList } from 'lib/components/PoolList'
import { PoolShow } from 'lib/components/PoolShow'

export const IndexUI = (
  props,
) => {
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    pools,
    pool,
  } = poolDataContext

  

  // if (pools.length === 0) {
  //   return <IndexUIPlaceholder />
  // }

  return <>
    {pool && <PoolShow
      {...props}
      pool={pool}
    />}

    {!pool && <>
      <h1
        className='banner-text mx-auto font-bold text-center'
      >
        You could <span className='text-flashy'>win $702 every week</span> just by saving your money.
      </h1>

      <h6
        className='text-accent-2 mb-6'
      >
        Pools
      </h6>

      {loading ?
        <IndexUILoader /> :
        <PoolList
          omit={pool}
          selectedId={pool && pool.poolAddress}
          pools={pools}
        />
      }
    </>}

    
  </>
}
