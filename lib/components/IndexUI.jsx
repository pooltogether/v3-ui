import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useInterval } from 'lib/hooks/useInterval'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolList } from 'lib/components/PoolList'
import { PoolShow } from 'lib/components/PoolShow'

export const IndexUI = (
  props,
) => {
  const router = useRouter()
  const poolId = router.query.prizePoolAddress

  let pools = []
  const poolData = useContext(PoolDataContext)
  console.log({poolData})
  pools = [
    {
      ...poolData.dynamicPoolData.daiPool,
      ...poolData.staticPoolData.daiPool,
      prize: 26591,
      risk: 5,
      yieldSource: 'Balancer',
      frequency: 'Weekly',
    },
    {
      ...poolData.dynamicPoolData.usdcPool,
      ...poolData.staticPoolData.usdcPool,
      prize: (11239 / 7),
      risk: 3,
      yieldSource: 'AAVE',
      frequency: 'Daily',
    },
    {
      ...poolData.dynamicPoolData.usdtPool,
      ...poolData.staticPoolData.usdtPool,
      prize: 7001,
      risk: 2,
      yieldSource: 'Compound',
      frequency: 'Weekly',
    },
  ]
  
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
  //       if (pool.id === poolId) {
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
    {poolId && <PoolShow
      pool={{
        id: poolId
      }}
    />}
    
    <PoolList
      selectedId={poolId}
      pools={pools}
    />
  </>
}


{/* <Link
      href='/pools/[networkName]/[prizePoolAddress]'
      as={`/pools/kovan/${kovanDaiPrizePoolContractAddress}`}
      scroll={false}
    >
      <a
        className='w-full px-6 sm:px-4 lg:mr-4 mb-2 py-2 inline-block bg-purple-1100 hover:bg-purple-1000 trans border-2 border-purple-700 rounded-lg hover:border-purple-500'
        style={{
          minHeight: 600
        }}
      >
        <div className='flex items-center mt-2'>
          <img src={DaiSvg} className='inline-block w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2' />

          <div>
            <span className='text-blue-200 text-base'>Weekly DAI Pool</span>
          </div>
        </div>

        {daiContent}
      </a>
    </Link> */}
