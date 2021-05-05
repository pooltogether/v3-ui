import { useContext } from 'react'
import { formatUnits } from '@ethersproject/units'
import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import ERC20Abi from 'abis/ERC20Abi'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { NETWORK } from 'lib/utils/networks'
import { SECONDS_PER_DAY } from '@pooltogether/current-pool-data'
import { ethers } from 'ethers'

export const useUniswapStakingPool = () => {
  const { appEnv } = useAppEnv()
  // const { usersAddress } = useContext(AuthControllerContext)
  const usersAddress = '0x89a77a6Ac47094140BbdaA47AdBEf6fab1cD282b' // user with LP tokens
  const { data: readProvider, isFetched: readProviderIsFetched } = useReadProvider(NETWORK.mainnet)
  const enabled =
    appEnv === APP_ENVIRONMENT.mainnets && Boolean(usersAddress) && readProviderIsFetched

  return useQuery(
    [QUERY_KEYS.uniswapLPStakingPool],
    () => getUniswapStakingPoolData(readProvider, usersAddress),
    { enabled }
  )
}

const getUniswapStakingPoolData = async (readProvider, usersAddress) => {
  const chainId = NETWORK.mainnet

  const uniswapLPTokenFaucet = CUSTOM_CONTRACT_ADDRESSES[chainId].UniswapLPTokenFaucet
  const uniswapPOOLLPToken = CUSTOM_CONTRACT_ADDRESSES[chainId].UniswapPOOLLPToken
  const uniswapLPPoolTicket = CUSTOM_CONTRACT_ADDRESSES[chainId].UniswapLPPoolTicket
  const poolTokenAddress = CUSTOM_CONTRACT_ADDRESSES[chainId].GovernanceToken

  const lpTokenContract = contract('lpToken', ERC20Abi, uniswapPOOLLPToken)
  const poolTokenContract = contract('pool', ERC20Abi, poolTokenAddress)
  const lpPoolTicketContract = contract('ticket', ERC20Abi, uniswapLPPoolTicket)
  const lpTokenFaucetContract = contract('tokenFaucet', TokenFaucetABI, uniswapLPTokenFaucet)

  const response = await batch(
    readProvider,
    lpTokenContract.balanceOf(usersAddress).decimals(),
    lpPoolTicketContract.balanceOf(usersAddress).totalSupply().decimals(),
    lpTokenFaucetContract.dripRatePerSecond().claim(usersAddress),
    poolTokenContract.balanceOf(uniswapLPTokenFaucet).decimals()
  )

  const dripRatePerSecondUnformatted = response.tokenFaucet.dripRatePerSecond[0]
  const dripRatePerSecond = formatUnits(dripRatePerSecondUnformatted, response.pool.decimals[0])
  const dripRatePerDayUnformatted = dripRatePerSecondUnformatted.mul(SECONDS_PER_DAY)
  const dripRatePerDay = formatUnits(dripRatePerDayUnformatted, response.pool.decimals[0])

  const usersTicketBalanceUnformatted = response.ticket.balanceOf[0]
  const ticketTotalSupplyUnformatted = response.ticket.totalSupply[0]
  const ownershipPercentage = usersTicketBalanceUnformatted
    .mul(100)
    .div(ticketTotalSupplyUnformatted)
  const usersDripPerDayUnformatted = dripRatePerDayUnformatted.mul(ownershipPercentage).div(100)

  let a = {
    tokenFaucet: {
      balance: formatUnits(response.pool.balanceOf[0], response.pool.decimals[0]),
      balanceUnformatted: response.pool.balanceOf[0],
      dripRatePerSecond,
      dripRatePerSecondUnformatted,
      dripRatePerDay,
      dripRatePerDayUnformatted
    },
    user: {
      lpToken: {
        decimals: response.lpToken.decimals[0],
        balance: formatUnits(response.lpToken.balanceOf[0], response.lpToken.decimals[0]),
        balanceUnformatted: response.lpToken.balanceOf[0]
      },
      tickets: {
        decimals: response.ticket.decimals[0],
        balance: formatUnits(usersTicketBalanceUnformatted, response.ticket.decimals[0]),
        balanceUnformatted: usersTicketBalanceUnformatted,
        totalSupply: formatUnits(ticketTotalSupplyUnformatted, response.ticket.decimals[0]),
        totalSupplyUnformatted: ticketTotalSupplyUnformatted,
        ownershipPercentage
      },
      claimableBalance: formatUnits(response.tokenFaucet.claim[0], response.pool.decimals[0]),
      claimableBalanceUnformatted: response.tokenFaucet.claim[0],
      dripTokensPerDay: formatUnits(usersDripPerDayUnformatted, response.pool.decimals[0]),
      dripTokensPerDayUnformatted: usersDripPerDayUnformatted
    }
  }
  console.log(response, a)
  return a
}
