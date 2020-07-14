import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'
import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { readProvider } from 'lib/utils/getReadProvider'

export const fetchGenericChainValues = async (
  provider,
  pool,
) => {
  const {
    id,
    ticket,
    sponsorship,
    underlyingCollateralToken,
  } = pool

  const poolAddress = id
  
  if (
    provider &&
    poolAddress &&
    ticket &&
    sponsorship
  ) {
    // TODO: don't need to get most of this from infura!

    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        CompoundPeriodicPrizePoolAbi,
        poolAddress
      )
      const etherplexTicketContract = contract(
        'ticket',
        ERC20Abi,
        ticket
      )
      const etherplexSponsorshipContract = contract(
        'sponsorship',
        ERC20Abi,
        sponsorship
      )
      const etherplexTokenContract = contract(
        'token',
        ERC20Abi,
        underlyingCollateralToken
      )

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          .isRngRequested() // used to determine if the pool is locked
          .canStartAward()
          .canCompleteAward()
          .prizePeriodRemainingSeconds()
          .estimateRemainingPrize(),
        etherplexTicketContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexSponsorshipContract
          .name()
          .symbol()
          .totalSupply(),
        etherplexTokenContract
          .decimals()
          .symbol(),
      )

      let decimals = values.token.decimals[0]
      // default to 18 if the ERC20 contract returns 0 for decimals
      decimals = decimals === 0 ? 18 : decimals

      return {
        canStartAward: values.prizePool.canStartAward[0],
        canCompleteAward: values.prizePool.canCompleteAward[0],
        estimateRemainingPrize: values.prizePool.estimateRemainingPrize[0],
        isRngRequested: values.prizePool.isRngRequested[0],
        prizePeriodRemainingSeconds: values.prizePool.prizePeriodRemainingSeconds[0],
        sponsorshipName: values.sponsorship.name,
        sponsorshipSymbol: values.sponsorship.symbol,
        sponsorshipTotalSupply: values.sponsorship.totalSupply,
        ticketName: values.ticket.name,
        ticketSymbol: values.ticket.symbol,
        ticketTotalSupply: values.ticket.totalSupply,
        tokenDecimals: decimals,
        tokenSymbol: values.token.symbol[0],
        loading: false,
      }
    } catch (e) {
      // setGenericChainValues({
      //   error: true,
      //   errorMessage: e.message,
      // })

      console.warn(e.message)
      // console.error(e)
    }

  }
}

export const fetchUsersChainValues = async (
  provider,
  usersAddress,
  pool,
) => {
  const {
    underlyingCollateralToken,
    id,
    ticket,
  } = pool

  const poolAddress = id

  if (
    underlyingCollateralToken &&
    poolAddress &&
    ticket
  ) {
    try {
      const etherplexPrizePoolContract = contract(
        'prizePool',
        CompoundPeriodicPrizePoolAbi,
        poolAddress
      )
      const etherplexTicketContract = contract(
        'ticket',
        ERC20Abi,
        ticket
      )
      const etherplexTokenContract = contract(
        'token',
        ERC20Abi,
        underlyingCollateralToken
      )

      const values = await batch(
        provider,
        etherplexPrizePoolContract
          .timelockBalanceOf(usersAddress)
          .timelockBalanceAvailableAt(usersAddress),
        etherplexTicketContract
          .balanceOf(usersAddress),
        etherplexTokenContract
          .balanceOf(usersAddress)
          .allowance(usersAddress, poolAddress)
      )
      // console.log({values})
      // console.log(usersTokenAllowance, values.token.allowance[0].toString())

      return {
        usersTicketBalance: values.ticket.balanceOf[0],
        usersTokenAllowance: values.token.allowance[0],
        usersTokenBalance: values.token.balanceOf[0],
        usersTimelockBalanceAvailableAt: values.prizePool.timelockBalanceAvailableAt[0],
        usersTimelockBalance: values.prizePool.timelockBalanceOf[0],
      }
    } catch (e) {
      // setUsersChainValues({
      //   error: true,
      //   errorMessage: e.message,
      // })

      console.warn(e.message)
    }

  }
}

export const fetchChainData = async (
  networkName,
  usersAddress,
  pool,
) => {
  const provider = await readProvider(networkName)
  
  let genericValues = {}
  let usersValues = {}

  if (pool) {
    genericValues = fetchGenericChainValues(provider, pool)
  }

  if (usersAddress) {
    usersValues = fetchUsersChainValues(provider, usersAddress, pool)
  }

  return {
    genericValues,
    usersValues,
  }
}
