import { formatUnits } from '@ethersproject/units'
import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import ERC20Abi from 'abis/ERC20Abi'

import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { NETWORK } from 'lib/utils/networks'
import { SECONDS_PER_DAY } from '@pooltogether/current-pool-data'
import { ethers } from 'ethers'
import { ONE_MINUTE_IN_MILLISECONDS } from 'lib/constants'

const STAKING_POOLS = Object.freeze({
  1: [
    {
      prizePool: {
        address: '0x3af7072d29adde20fc7e173a7cb9e45307d2fb0a'
      },
      ticket: {
        address: '0xeb8928ee92efb06c44d072a24c2bcb993b61e543'
      },
      dripToken: {
        address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
        symbol: 'POOL'
      },
      tokenFaucet: {
        address: '0x9a29401ef1856b669f55ae5b24505b3b6faeb370'
      },
      underlyingToken: {
        address: '0x85cb0bab616fe88a89a35080516a8928f38b518b',
        pair: 'POOL/ETH',
        symbol: 'POOL/ETH UNI-V2 LP',
        token1: {
          symbol: 'POOL',
          address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e'
        },
        token2: {
          symbol: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH
        }
      }
    }
  ],
  4: [
    {
      prizePool: {
        address: '0x8A358f613ddCca865D005414c1690920E4e9b132'
      },
      ticket: {
        address: '0x9b8c6fd165e0bffb93e6f2cf564d2cc7271e120f'
      },
      dripToken: {
        address: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A',
        symbol: 'POOL'
      },
      tokenFaucet: {
        address: '0x97B99693613aaA74A3fa0B2f05378b8F6A74a893' // BAT POOL TOKEN FAUCET
      },
      underlyingToken: {
        address: '0x91A590A2D78c71775318524c198a0f2000112108',
        pair: 'POOL/ETH',
        symbol: 'POOL/ETH UNI-V2 LP',
        token1: {
          symbol: 'POOL',
          address: '0xc4E90a8Dc6CaAb329f08ED3C8abc6b197Cf0F40A'
        },
        token2: {
          symbol: 'ETH',
          address: '0xc778417e063141139fce010982780140aa0cd5ab'
        }
      }
    }
  ]
})

export const useStakingPoolChainData = (stakingPoolAddresses, usersAddress) => {
  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby
  const { data: readProvider, isFetched: readProviderIsFetched } = useReadProvider(chainId)
  const enabled = Boolean(usersAddress) && readProviderIsFetched

  return useQuery(
    [
      QUERY_KEYS.uniswapLPStakingPool,
      chainId,
      usersAddress,
      stakingPoolAddresses.prizePool.address
    ],
    () => getStakingPoolData(readProvider, usersAddress, stakingPoolAddresses),
    { enabled, refetchInterval: ONE_MINUTE_IN_MILLISECONDS }
  )
}

export const useStakingPoolChainId = () => {
  const { appEnv } = useAppEnv()
  return appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby
}

export const useStakingPoolsAddresses = () => {
  const chainId = useStakingPoolChainId()
  return STAKING_POOLS[chainId]
}

const getStakingPoolData = async (readProvider, usersAddress, stakingPoolAddresses) => {
  const { prizePool, tokenFaucet, underlyingToken, ticket, dripToken } = stakingPoolAddresses

  const prizePoolAddress = prizePool.address
  const tokenFaucetAddress = tokenFaucet.address
  const underlyingTokenAddress = underlyingToken.address
  const ticketAddress = ticket.address
  const dripTokenAddress = dripToken.address

  const underlyingTokenContract = contract('underlyingToken', ERC20Abi, underlyingTokenAddress)
  const dripTokenContract = contract('dripToken', ERC20Abi, dripTokenAddress)
  const lpPoolTicketContract = contract('ticket', ERC20Abi, ticketAddress)
  const underlyingTokenFaucetContract = contract('tokenFaucet', TokenFaucetABI, tokenFaucetAddress)

  const response = await batch(
    readProvider,
    underlyingTokenContract
      .balanceOf(usersAddress)
      .decimals()
      .allowance(usersAddress, prizePoolAddress)
      .totalSupply(),
    lpPoolTicketContract.balanceOf(usersAddress).totalSupply().decimals(),
    underlyingTokenFaucetContract.dripRatePerSecond().claim(usersAddress),
    dripTokenContract.balanceOf(tokenFaucetAddress).decimals()
  )

  const dripRatePerSecondUnformatted = response.tokenFaucet.dripRatePerSecond[0]
  const dripRatePerSecond = formatUnits(
    dripRatePerSecondUnformatted,
    response.dripToken.decimals[0]
  )
  const dripRatePerDayUnformatted = dripRatePerSecondUnformatted.mul(SECONDS_PER_DAY)
  const dripRatePerDay = formatUnits(dripRatePerDayUnformatted, response.dripToken.decimals[0])

  const usersTicketBalanceUnformatted = response.ticket.balanceOf[0]
  const ticketTotalSupplyUnformatted = response.ticket.totalSupply[0]
  const ownershipPercentageScaled = ticketTotalSupplyUnformatted.isZero()
    ? ethers.constants.Zero
    : usersTicketBalanceUnformatted.mul(1000000).div(ticketTotalSupplyUnformatted)
  const usersDripPerDayUnformatted = dripRatePerDayUnformatted
    .mul(ownershipPercentageScaled)
    .div(1000000)

  const ownershipPercentage = formatUnits(ownershipPercentageScaled, 6)

  const underlyingTokenTotalSupplyUnformatted = response.underlyingToken.totalSupply[0]

  return {
    tokenFaucet: {
      balance: formatUnits(response.dripToken.balanceOf[0], response.dripToken.decimals[0]),
      balanceUnformatted: response.dripToken.balanceOf[0],
      dripRatePerSecond,
      dripRatePerSecondUnformatted,
      dripRatePerDay,
      dripRatePerDayUnformatted
    },
    user: {
      underlyingToken: {
        decimals: response.underlyingToken.decimals[0],
        balance: formatUnits(
          response.underlyingToken.balanceOf[0],
          response.underlyingToken.decimals[0]
        ),
        balanceUnformatted: response.underlyingToken.balanceOf[0],
        allowance: response.underlyingToken.allowance[0],
        totalSupply: formatUnits(
          underlyingTokenTotalSupplyUnformatted,
          response.underlyingToken.decimals[0]
        ),
        totalSupplyUnformatted: underlyingTokenTotalSupplyUnformatted
      },
      tickets: {
        decimals: response.ticket.decimals[0],
        balance: formatUnits(usersTicketBalanceUnformatted, response.ticket.decimals[0]),
        balanceUnformatted: usersTicketBalanceUnformatted,
        totalSupply: formatUnits(ticketTotalSupplyUnformatted, response.ticket.decimals[0]),
        totalSupplyUnformatted: ticketTotalSupplyUnformatted,
        ownershipPercentage
      },
      claimableBalance: formatUnits(response.tokenFaucet.claim[0], response.dripToken.decimals[0]),
      claimableBalanceUnformatted: response.tokenFaucet.claim[0],
      dripTokensPerDay: formatUnits(usersDripPerDayUnformatted, response.dripToken.decimals[0]),
      dripTokensPerDayUnformatted: usersDripPerDayUnformatted
    }
  }
}
