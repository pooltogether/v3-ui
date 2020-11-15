export const getUsersTicketBalance = (currentPool, graphPlayerData) => {
  const poolAddress = currentPool?.poolAddress
  const underlyingCollateralDecimals = currentPool?.underlyingCollateralDecimals

  let usersTicketBalance = 0
  let usersTicketBalanceBN = ethers.utils.bigNumberify(0)

  if (currentPool && graphPlayerData) {
    const player = graphPlayerData.find(data => data.prizePool.id === poolAddress)

    if (player && underlyingCollateralDecimals) {
      usersTicketBalance = ethers.utils.formatUnits(
        player.balance,
        underlyingCollateralDecimals
      )
      usersTicketBalanceBN = ethers.utils.bigNumberify(player.balance)
    }
  }

  return {
    usersTicketBalance,
    usersTicketBalanceBN,
  }
}