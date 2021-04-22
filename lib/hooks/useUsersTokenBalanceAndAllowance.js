import { useContext } from 'react'
import { useQuery } from 'react-query'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useWalletChainId } from 'lib/hooks/chainId/useWalletChainId'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

import ERC20Abi from 'lib/../abis/ERC20Abi'
import { batch, contract } from '@pooltogether/etherplex'
import { useCurrentPool } from 'lib/hooks/usePools'

// TODO: Optimize & batch these calls

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
    [QUERY_KEYS.ethereumUsersChainQuery, chainId, usersAddress],
    () => getUsersTokenBalance(readProvider, usersAddress, tokenAddress, poolAddress),
    {
      enabled
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
  const { usersAddress } = useContext(AuthControllerContext)

  return useUsersTokenBalanceAndAllowance(
    pool?.chainId,
    usersAddress,
    pool?.tokens.underlyingToken.address,
    pool?.prizePool.address
  )
}

/**
 *
 * @param {*} chainId
 * @param {*} tokenAddress
 * @param {*} poolAddress
 * @returns
 */
export const useCurrentUsersTokenBalanceAndAllowance = (chainId, tokenAddress, poolAddress) => {
  const { usersAddress } = useContext(AuthControllerContext)
  return useUsersTokenBalanceAndAllowance(chainId, usersAddress, tokenAddress, poolAddress)
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
