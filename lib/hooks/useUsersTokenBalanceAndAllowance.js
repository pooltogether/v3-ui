import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { useUsersAddress } from '@pooltogether/hooks'

import ERC20Abi from 'lib/../abis/ERC20Abi'
import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'
import { useCurrentPool } from 'lib/hooks/usePools'

// TODO: Optimize & batch these calls
//       maybe just use the useTokenBalances() hook?

/**
 * Core hook for fetching a users balance and the allowance of the pool
 * @param {*} chainId
 * @param {*} usersAddress
 * @param {*} tokenAddress
 * @param {*} poolAddress
 * @returns
 */
export const useUsersTokenBalanceAndAllowance = (
  chainId,
  usersAddress,
  tokenAddress,
  poolAddress
) => {
  const { data: readProvider, isFetched: readProviderIsReady } = useReadProvider(chainId)

  const enabled = Boolean(chainId) && Boolean(usersAddress) && readProviderIsReady

  return useQuery(
    [QUERY_KEYS.ethereumUsersChainQuery, chainId, usersAddress, tokenAddress, poolAddress],
    () => getUsersTokenBalance(readProvider, usersAddress, tokenAddress, poolAddress),
    {
      enabled,
      refetchInterval: MAINNET_POLLING_INTERVAL
    }
  )
}

// Variants

/**
 * Supplies the Pool based on the route and users address based on the connected wallet
 * @returns
 */
export const useCurrentUsersTokenBalanceAndAllowanceOfCurrentPool = () => {
  const { data: pool } = useCurrentPool()
  const usersAddress = useUsersAddress()

  return useUsersTokenBalanceAndAllowance(
    pool?.chainId,
    usersAddress,
    pool?.tokens.underlyingToken.address,
    pool?.prizePool.address
  )
}

// Fetcher

const getUsersTokenBalance = async (readProvider, usersAddress, tokenAddress, poolAddress) => {
  const etherplexTokenContract = contract('token', ERC20Abi, tokenAddress)
  const values = await batch(
    readProvider,
    etherplexTokenContract.balanceOf(usersAddress).allowance(usersAddress, poolAddress)
  )

  return {
    usersTokenAllowance: values.token.allowance[0],
    usersTokenBalance: values.token.balanceOf[0]
  }
}
