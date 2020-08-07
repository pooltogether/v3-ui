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

  if (loading) {
    return <IndexUILoader />
  }

  if (pools.length === 0) {
    return <IndexUIPlaceholder />
  }

  return <>
    {pool && <PoolShow
      {...props}
      pool={pool}
    />}

    {!pool && <>
      <h1
        style={{
          fontWeight: 'bold',
          fontSize: 'calc(3vw + 20px)',
          lineHeight: 1.2,
          marginTop: '2rem',
          marginBottom: '5rem',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          maxWidth: '90%',
        }}
      >
        You could <span className='text-flashy'>win $702 every week</span> just by saving your money.
      </h1>
    </>}


    <PoolList
      selectedId={pool && pool.poolAddress}
      pools={pools}
    />
  </>
}
