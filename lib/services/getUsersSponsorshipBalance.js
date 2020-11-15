export const getUsersSponsorshipBalance = (currentPool, graphSponsorData) => {
  const poolAddress = currentPool?.poolAddress
  const underlyingCollateralDecimals = currentPool?.underlyingCollateralDecimals

  let usersSponsorshipBalance = 0
  let usersSponsorshipBalanceBN = ethers.utils.bigNumberify(0)

  if (currentPool && graphSponsorData) {
    const sponsor = graphSponsorData.find(data => data.prizePool.id === poolAddress)

    if (sponsor && underlyingCollateralDecimals) {
      usersSponsorshipBalance = Number(ethers.utils.formatUnits(
        sponsor.balance,
        Number(underlyingCollateralDecimals)
      ))
      usersSponsorshipBalanceBN = ethers.utils.bigNumberify(sponsor.balance)
    }
  }


  return {
    usersSponsorshipBalance,
    usersSponsorshipBalanceBN,
  }
}