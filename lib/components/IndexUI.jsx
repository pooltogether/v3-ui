import React, { useContext } from 'react'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolList } from 'lib/components/PoolList'
import { Tagline } from 'lib/components/Tagline'

export const IndexUI = (
  props,
) => {
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    pools,
    // pool,
  } = poolDataContext

  return <>
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
        pools={pools}
      />
    }

    <Tagline />
  </>
}
