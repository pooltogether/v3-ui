import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { POOLS } from 'lib/constants'
import { usePools } from 'lib/hooks/usePools'
import { usePoolChainQuery } from 'lib/hooks/usePoolChainQuery'
import { useErc20ChainQuery } from 'lib/hooks/useErc20ChainQuery'
import { useErc721ChainQuery } from 'lib/hooks/useErc721ChainQuery'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwardsValue } from 'lib/services/calculateEstimatedExternalAwardsValue'
import { compileErc20Awards } from 'lib/services/compileErc20Awards'
import { compileErc721Awards } from 'lib/services/compileErc721Awards'

// note: when calculating value of ERC20 tokens this uses current chain data (infura/alchemy) to get the balance
// but uses the Uniswap subgraph to get the prices
// 
// in the compilePoolWithBlockNumber(), the balance is pulled from the pooltogether subgraph as we want the balance
// at the time the prize was awarded, etc
export function usePool(poolSymbol, blockNumber = -1) {
  const router = useRouter()

  if (!poolSymbol) {
    poolSymbol = router?.query?.symbol
  }

  const { poolsGraphData } = usePools()

  // TODO: Change this from needing poolsGraphData about every pool
  const { poolChainData } = usePoolChainQuery(poolsGraphData)
  const { erc20ChainData } = useErc20ChainQuery(poolsGraphData)
  const { erc721ChainData } = useErc721ChainQuery(poolsGraphData)
  // const { contractAddresses } = usePools()

  const addresses = erc20ChainData
    ?.filter(award => award.balance.gt(0))
    ?.map(award => award.address)

  const { data: uniswapPriceData } = useUniswapTokensQuery(
    addresses,
    blockNumber
  )

  // const uniswapPriceData = queryCache.getQueryData([
  //   QUERY_KEYS.uniswapTokensQuery,
  //   chainId,
  //   !isEmpty(addresses) ? addresses.join('-') : '',
  //   -1
  // ])



  const poolInfo = POOLS.find(POOL => {
    return POOL.symbol === poolSymbol
  })

  // const pool = compilePool(
  //   chainId,
  //   poolInfo,
  //   contractAddresses.daiPool,
  //   queryCache,
  //   poolChainData?.dai,
  //   poolsGraphData?.daiPool,
  //   uniswapPriceData,
  // )


  let pool = {
    ...poolInfo,
    ...poolChainData?.['PT-cDAI'],
    ...poolsGraphData?.['PT-cDAI'],
  }

  // const ethereumErc20Awards = queryCache.getQueryData([QUERY_KEYS.ethereumErc20sQuery, chainId, poolAddress, blockNumber])
  // const ethereumErc721Awards = queryCache.getQueryData([QUERY_KEYS.ethereumErc721sQuery, chainId, poolAddress, blockNumber])

  // let { awards } = useLootBox(historical, pool, blockNumber)

  // const blockNumber = historical ? parseInt(prize?.awardedBlock, 10) : -1
  // const originalAwardsCount = awards.length
  // awards = moreVisible ? awards : awards?.slice(0, 10)

  // console.log(awards)

  const compiledExternalErc20Awards = compileErc20Awards(erc20ChainData, poolsGraphData?.['PT-cDAI'], uniswapPriceData)
  // console.log(erc20ChainData, poolsGraphData?.['PT-cDAI'], uniswapPriceData)
  // console.log(compiledExternalErc20Awards)

  const compiledExternalErc721Awards = compileErc721Awards(erc721ChainData, poolsGraphData?.['PT-cDAI'])

  const externalAwardsUSD = calculateEstimatedExternalAwardsValue(compiledExternalErc20Awards)

  const interestPrizeUSD = calculateEstimatedPoolPrize(pool)


  const numOfWinners = parseInt(pool.numberOfWinners || 1, 10)
  const grandPrizeAmountUSD = externalAwardsUSD ?
    interestPrizeUSD.div(numOfWinners).add(ethers.utils.parseEther(
      externalAwardsUSD.toString()
    )) :
    interestPrizeUSD.div(numOfWinners)

  const totalPrizeAmountUSD = externalAwardsUSD ?
    interestPrizeUSD.add(ethers.utils.parseEther(
      externalAwardsUSD.toString()
    )) :
    interestPrizeUSD

  pool = {
    ...pool,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    interestPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards
  }

  // console.log({pool})

  return {
    pool
  }

  //       const pools = compilePools(chainId, contractAddresses, queryCache, poolData, poolChainData)

  //       const currentPool = getCurrentPool(querySymbol, pools)
        
  //       return <FetchUsersChainData
  //         {...props}
  //         provider={defaultReadProvider}
  //         pool={currentPool}
  //         usersAddress={usersAddress}
  //         graphDripData={graphDripData}
  //         contractAddresses={contractAddresses}
  //       >
  //         {({ usersChainData }) => {
  //           return <PoolDataContext.Provider
  //             value={{
  //               loading: poolsDataLoading,
  //               pool: currentPool,
  //               pools,
  //               contractAddresses,
  //               defaultReadProvider,
  //               poolChainData,
  //               refetchPoolsData,
  //               graphDripData,
  //               usersChainData,
  //             }}
  //           >
  //             {props.children}
  //           </PoolDataContext.Provider>
  //         }}
  //       </FetchUsersChainData>
  // </>
}
