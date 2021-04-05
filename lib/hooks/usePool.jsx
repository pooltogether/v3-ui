import { useContext } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { ALL_POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useLootBox } from 'lib/hooks/useLootBox'
import { usePoolChainQuery } from 'lib/hooks/usePoolChainQuery'
import { useErc20ChainQuery } from 'lib/hooks/useErc20ChainQuery'
import { useErc721ChainQuery } from 'lib/hooks/useErc721ChainQuery'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { calculateEstimatedPoolPrize } from 'lib/services/calculateEstimatedPoolPrize'
import { calculateEstimatedExternalAwardsValue } from 'lib/services/calculateEstimatedExternalAwardsValue'
import { compileErc20Awards } from 'lib/services/compileErc20Awards'
import { compileErc721Awards } from 'lib/services/compileErc721Awards'
import { usePools_OLD } from 'lib/hooks/usePools_OLD'

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

  const { poolsGraphData, communityPoolsGraphData, poolsRefetch, communityRefetch } = usePools_OLD()
  let poolGraphData = poolsGraphData?.[poolSymbol]
  if (!poolGraphData) {
    poolGraphData = communityPoolsGraphData?.[poolSymbol]
  }

  const { poolChainData } = usePoolChainQuery(poolGraphData)

  const poolInfo = ALL_POOLS[chainId]?.find((POOL) => {
    return POOL.symbol === poolSymbol
  })

  let pool = {
    ...poolInfo,
    ...poolChainData,
    ...poolGraphData
  }

  const sponsoredSupply = pool.totalSponsorship
  const ticketSupply = pool.ticketSupply
  const reserveSupply = pool.reserveTotalSupply
  const tokenDecimals = pool.underlyingCollateralDecimals

  const { erc20ChainData } = useErc20ChainQuery(pool)
  const { erc721ChainData } = useErc721ChainQuery(pool)

  const sablierStreamTokenAddress = poolChainData?.sablierPrize?.tokenAddress

  let addresses = pool.underlyingCollateralToken ? [pool.underlyingCollateralToken] : []
  const erc20Addresses = erc20ChainData
    ?.filter((award) => award.balance.gt(0))
    ?.map((award) => award.address)
  addresses = [...addresses, ...(erc20Addresses || [])]

  if (sablierStreamTokenAddress) {
    addresses.push(sablierStreamTokenAddress)
  }

  const {
    data: uniswapPriceData,
    error: uniswapError,
    isFetching: uniswapIsFetching,
    isFetched: uniswapIsFetched
  } = useUniswapTokensQuery(addresses, blockNumber)
  if (uniswapError) {
    console.error(uniswapError)
  }

  let sablierPrizeUSD = 0
  if (
    uniswapIsFetched &&
    sablierStreamTokenAddress &&
    uniswapPriceData[sablierStreamTokenAddress]?.usd
  ) {
    sablierPrizeUSD =
      poolChainData.sablierPrize.amount * uniswapPriceData[sablierStreamTokenAddress].usd
  }

  const compiledExternalErc20Awards = compileErc20Awards(
    erc20ChainData,
    poolGraphData,
    uniswapPriceData
  )

  const compiledExternalErc721Awards = compileErc721Awards(
    poolGraphData?.externalErc721Awards,
    erc721ChainData
  )

  const externalErcAwards = {
    compiledExternalErc20Awards,
    compiledExternalErc721Awards
  }
  const lootBox = useLootBox(externalErcAwards, blockNumber)

  const numWinners = parseInt(pool.numberOfWinners || 1, 10)

  const tokenValueUSD = uniswapPriceData?.[pool.underlyingCollateralToken]?.usd

  const externalAwardsUSD = calculateEstimatedExternalAwardsValue(lootBox.awards)

  let ticketPrizeUSD = parseFloat(calculateEstimatedPoolPrize(pool)) + sablierPrizeUSD

  // console.log(
  //   parseFloat(calculateEstimatedPoolPrize(pool)),
  //   sablierPrizeUSD,
  //   poolChainData.sablierPrize,
  //   uniswapPriceData
  // )

  if (tokenValueUSD) {
    ticketPrizeUSD = (ticketPrizeUSD * parseInt(tokenValueUSD * 100, 10)) / 100
  } else {
    // console.warn('could not get USD value for price of underlying collateral token')
  }

  const ticketPrizePerWinnerUSD = ticketPrizeUSD / numWinners

  const grandPrizeAmountUSD = externalAwardsUSD
    ? ticketPrizeUSD / numWinners + externalAwardsUSD
    : ticketPrizeUSD / numWinners

  const totalPrizeAmountUSD = externalAwardsUSD
    ? ticketPrizeUSD + externalAwardsUSD
    : ticketPrizeUSD

  const fetchingTotals =
    externalAwardsUSD === null || (ticketPrizeUSD === 0 && uniswapIsFetching && !uniswapIsFetched)

  const totalDepositedUSD = _calculateConvertedValue(ticketSupply, tokenDecimals, tokenValueUSD)
  const totalSponsoredUSD = _calculateConvertedValue(sponsoredSupply, tokenDecimals, tokenValueUSD)
  const totalReserveUSD = _calculateConvertedValue(reserveSupply, tokenDecimals, tokenValueUSD)

  const refetchAllPoolData = () => {
    poolsRefetch()
    communityRefetch()
  }

  // Standardize the USD values so they're either all floats/strings or all bigNums  pool = {
  pool = {
    ...pool,
    fetchingTotals,
    lootBox,
    totalDepositedUSD,
    totalSponsoredUSD,
    totalReserveUSD,
    totalPrizeAmountUSD,
    grandPrizeAmountUSD,
    ticketPrizePerWinnerUSD,
    ticketPrizeUSD,
    externalAwardsUSD,
    compiledExternalErc20Awards,
    compiledExternalErc721Awards
  }

  return {
    pool,
    refetchAllPoolData
  }
}

const _calculateConvertedValue = (tokenValue, decimals, tokenValueUSD) => {
  let convertedValue

  if (tokenValue && decimals) {
    const valueFormatted = ethers.utils.formatUnits(tokenValue, parseInt(decimals, 10))
    convertedValue = tokenValueUSD ? parseFloat(valueFormatted) * tokenValueUSD : valueFormatted
  }

  return convertedValue
}
