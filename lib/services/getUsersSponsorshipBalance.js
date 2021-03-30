import { ethers } from 'ethers'

export const getUsersSponsorshipBalance = (pool, playerData) => {
  const sponsorshipTicketAddress = pool?.sponsorshipToken?.id

  const usersAddress = playerData?.id
  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

  let usersSponsorshipBalance = '0'
  let usersSponsorshipBalanceBN = ethers.BigNumber.from(0)

  if (sponsorshipTicketAddress && usersAddress && playerData) {
    const playerSponsorshipTicketData = playerData?.controlledTokenBalances.find(
      (data) => data.controlledToken.id === sponsorshipTicketAddress
    )

    if (playerSponsorshipTicketData && underlyingCollateralDecimals) {
      usersSponsorshipBalance = ethers.utils.formatUnits(
        playerSponsorshipTicketData.balance,
        Number(underlyingCollateralDecimals)
      )
      usersSponsorshipBalanceBN = ethers.BigNumber.from(playerSponsorshipTicketData.balance)
    }
  }

  return {
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN
  }
}
