import { batch, contract } from '@pooltogether/etherplex'

import ERC20Abi from 'ERC20Abi'

export const fetchUsersChainData = async (
  provider,
  pool,
  usersAddress,
) => {
  const {
    underlyingCollateralToken,
    ticket,
    poolAddress,
  } = pool

  if (
    provider &&
    underlyingCollateralToken &&
    poolAddress &&
    ticket
  ) {
    try {
      const etherplexTokenContract = contract(
        'token',
        ERC20Abi,
        underlyingCollateralToken
      )

      const values = await batch(
        provider,
        etherplexTokenContract
          .balanceOf(usersAddress)
          .allowance(usersAddress, poolAddress)
      )

      return {
        usersTokenAllowance: values.token.allowance[0],
        usersTokenBalance: values.token.balanceOf[0],
      }
    } catch (e) {
      console.warn(e.message)
      throw new Error(e)
    }

  }
}
