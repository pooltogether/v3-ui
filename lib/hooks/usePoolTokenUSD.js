import { useContext } from 'react'
import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export function usePoolTokenUSD() {
  const { chainId } = useContext(AuthControllerContext)

  const govTokenAddress = CONTRACT_ADDRESSES[chainId]?.GovernanceToken?.toLowerCase()
  const addresses = [govTokenAddress]
  const { data: uniswapPriceData, error: uniswapError } = useUniswapTokensQuery(addresses)

  if (uniswapError) {
    console.error(uniswapError)
  }

  return uniswapPriceData?.[govTokenAddress]?.usd
}
