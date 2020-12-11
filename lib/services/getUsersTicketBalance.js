import { ethers } from "ethers"

export const getUsersTicketBalance = (pool, playerData) => {
  const ticketAddress = pool?.ticketToken?.id
  const userAddress = playerData?.id
  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

  let usersTicketBalance = 0
  let usersTicketBalanceBN = ethers.utils.bigNumberify(0)

  if (ticketAddress && userAddress && playerData) {
    const playerTicketData = playerData?.controlledTokenBalances.find(data => data.controlledToken.id === ticketAddress)

    if (playerTicketData && underlyingCollateralDecimals) {
      usersTicketBalance = Number(ethers.utils.formatUnits(
        playerTicketData.balance,
        underlyingCollateralDecimals
      ))
      usersTicketBalanceBN = ethers.utils.bigNumberify(playerTicketData.balance)
    }
  }

  return {
    usersTicketBalance,
    usersTicketBalanceBN,
  }
}