import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'
import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

export const fetchUsersChainData = async (
  provider,
  pool,
  usersAddress,
) => {
  const {
    underlyingCollateralToken,
    id,
    ticket,
  } = pool

  const poolAddress = id

  if (
    provider &&
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
      console.warn(e.message)
      throw new Error(e)
    }

  }
}
