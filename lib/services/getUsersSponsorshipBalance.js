import { ethers } from "ethers"

export const getUsersSponsorshipBalance = (pool, playerData) => {
  const sponsorshipTicketAddress = pool?.sponsorshipToken?.id
  const userAddress = playerData?.id
  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

  let usersSponsorshipBalance = 0
  let usersSponsorshipBalanceBN = ethers.utils.bigNumberify(0)

  if (sponsorshipTicketAddress && userAddress && playerData) {
    const playerSponsorshipTicketData = playerData?.controlledTokenBalances.find(data => data.controlledToken.id === sponsorshipTicketAddress)

    if (playerSponsorshipTicketData && underlyingCollateralDecimals) {
      usersSponsorshipBalance = Number(ethers.utils.formatUnits(
        playerSponsorshipTicketData.balance,
        Number(underlyingCollateralDecimals)
      ))
      usersSponsorshipBalanceBN = ethers.utils.bigNumberify(playerSponsorshipTicketData.balance)
    }
  }


  return {
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN,
  }
}