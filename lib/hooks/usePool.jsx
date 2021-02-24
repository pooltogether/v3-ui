import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useLootBox } from 'lib/hooks/useLootBox'
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
  const { chainId } = useContext(AuthControllerContext)

  const router = useRouter()

  if (!poolSymbol) {
    poolSymbol = router?.query?.symbol
  }

  const { poolsGraphData, communityPoolsGraphData } = usePools()
  let poolGraphData = poolsGraphData?.[poolSymbol]
  console.log(communityPoolsGraphData)
  if (!poolGraphData) {
    poolGraphData = communityPoolsGraphData?.[poolSymbol]
    console.log(poolGraphData)
  }

  const { poolChainData } = usePoolChainQuery(poolGraphData)

  const poolInfo = POOLS[chainId]?.find((POOL) => {
    return POOL.symbol === poolSymbol
  })

  let pool = {
    ...poolInfo,
    ...poolChainData,
    ...poolsGraphData?.[poolSymbol],
  }

  const { erc20ChainData } = useErc20ChainQuery(pool)
  const { erc721ChainData } = useErc721ChainQuery(pool)

  const addresses = erc20ChainData
    ?.filter((award) => award.balance.gt(0))
    ?.map((award) => award.address)

  if (addresses) {
    addresses.push(pool.underlyingCollateralToken)
  }

  const {
    data: uniswapPriceData,
    error: uniswapError,
    isFetching: uniswapIsFetching,
    isFetched: uniswapIsFetched,
  } = useUniswapTokensQuery(addresses, blockNumber)
  if (uniswapError) {
    console.error(uniswapError)
  }

  const compiledExternalErc20Awards = compileErc20Awards(
    erc20ChainData,
    poolsGraphData?.[poolSymbol],
    uniswapPriceData
  )

  const compiledExternalErc721Awards = compileErc721Awards(
    poolsGraphData?.[poolSymbol]?.externalErc721Awards,
    erc721ChainData
  )

  const externalErcAwards = {
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
  }
  const lootBox = useLootBox(externalErcAwards, blockNumber)

  const numWinners = parseInt(pool.numberOfWinners || 1, 10)

  const underlyingCollateralValueUSD = uniswapPriceData?.[pool.underlyingCollateralToken]?.usd

  const externalAwardsUSD = calculateEstimatedExternalAwardsValue(lootBox.awards)

  let interestPrizeUSD = calculateEstimatedPoolPrize(pool)

  if (underlyingCollateralValueUSD) {
    interestPrizeUSD = (interestPrizeUSD * parseInt(underlyingCollateralValueUSD * 100, 10)) / 100
  } else {
    // console.warn('could not get USD value for price of underlying collateral token')
  }

  const interestPrizePerWinnerUSD = interestPrizeUSD / numWinners

  const grandPrizeAmountUSD = externalAwardsUSD
    ? interestPrizeUSD / numWinners + externalAwardsUSD
    : interestPrizeUSD / numWinners

  const totalPrizeAmountUSD = externalAwardsUSD
    ? interestPrizeUSD + externalAwardsUSD
    : interestPrizeUSD

  const fetchingTotals =
    externalAwardsUSD === null || (interestPrizeUSD === 0 && uniswapIsFetching && !uniswapIsFetched)


  let totalDepositedUSD
  if (pool.ticketSupply && pool.underlyingCollateralDecimals) {
    const ticketsFormatted = ethers.utils.formatUnits(
      pool.ticketSupply,
      pool.underlyingCollateralDecimals
    )
    totalDepositedUSD = underlyingCollateralValueUSD ? 
      ticketsFormatted * underlyingCollateralValueUSD : ticketsFormatted
  }

  // Standardize the USD values so they're either all floats/strings or all bigNums  pool = {
  pool = {
    ...pool,
    fetchingTotals,
    lootBox,
    totalDepositedUSD,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    interestPrizePerWinnerUSD,
    interestPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards,
  }

  return {
    pool,
  }
}
