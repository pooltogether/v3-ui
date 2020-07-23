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

  // let poolData,
  //   daiPool,
  //   usdcPool,
  //   usdtPool

  // const [done, setDone] = useState(false)
  // const [pools, setPools] = useState([])
  // const [delay, setDelay] = useState(300)

  // useEffect(() => {
  //   console.log("1st")
  //   function tick() {
  //     if (poolDataContext && poolDataContext.poolData) {
  //       poolData = poolDataContext.poolData

  //       daiPool = poolData.daiPool
  //       usdcPool = poolData.usdcPool
  //       usdtPool = poolData.usdtPool

  //       setPools([
  //         daiPool,
  //         usdcPool,
  //         usdtPool,
  //       ])
  //     }  

  //     setDelay(null)
  //   }

  //   if (delay !== null) {
  //     let id = setInterval(tick, delay);
  //     return () => clearInterval(id);
  //   }
  // }, [delay])

  // // Move the selected pool to the top
  // useInterval(() => {
  //   console.log("2nd")

  //   if (pools.length > 0) {
  //     pools.forEach(function (pool, i) {
  //       if (pool.poolAddress === poolId) {
  //         let otherPools = [].concat(pools)
  //         otherPools.unshift(i)
  //         otherPools = otherPools.slice(0, pools.length)
          
  //         setPools([
  //           pool,
  //           ...otherPools
  //         ])
  //         setDone(true)
  //       }
  //     })
  //   }
  // }, done ? null : 300)

  return <>
    {pool && <PoolShow
      {...props}
      pool={pool}
    />}

    <PoolList
      selectedId={pool && pool.poolAddress}
      pools={pools}
    />
  </>
}
