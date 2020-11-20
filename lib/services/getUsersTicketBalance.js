export const getUsersTicketBalance = (pool, graphPlayerData) => {
  const poolAddress = pool?.poolAddress
  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

  let usersTicketBalance = 0
  let usersTicketBalanceBN = ethers.utils.bigNumberify(0)

  if (pool && graphPlayerData) {
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