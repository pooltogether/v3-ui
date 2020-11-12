import { ethers } from 'ethers'
import { useQueryCache } from 'react-query'

import { POOLS } from 'lib/constants'
import { PoolQuery } from 'lib/components/PoolQuery'
import { UniswapData } from 'lib/components/UniswapData'
import { compileTimeTravelPool } from 'lib/services/compileTimeTravelPool'

export function TimeTravelPool(
  props,
){
  const {
    children,
    blockNumber,
    poolAddress,
    querySymbol
  } = props

  const interestPrize = ethers.utils.bigNumberify(
    props.interestPrize
  )

  const cache = useQueryCache()

  return <PoolQuery
    poolAddress={poolAddress}
    blockNumber={blockNumber}
  >
    {(graphPools) => {
      // if (!graphPools) {
      //   return children({
      //     loading: true
      //   })
      // }

      const graphPool = graphPools?.find(_graphPool => _graphPool.id === poolAddress)
      const addresses = graphPool?.prizeStrategy?.externalErc20Awards?.map(award => award.address)

      
      return <UniswapData
        addresses={addresses}
        blockNumber={blockNumber}
        poolAddress={poolAddress}
      >
        {() => {
          const poolInfo = POOLS.find(POOL => POOL.symbol === querySymbol)


          const timeTravelPool = compileTimeTravelPool(poolInfo, cache, graphPool, poolAddress, blockNumber, interestPrize)
          // const pool = {
          //   ...graphPool,
          //   ...timeTravelPool,
          //   // ticketSupply: timeTravelPool?.prizeStrategy?.singleRandomWinner?.ticket?.totalSupply
          // }

          return children(timeTravelPool)
        }}
      </UniswapData>    
    }}
  </PoolQuery>

   
}
