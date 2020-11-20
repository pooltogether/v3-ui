export const getUsersSponsorshipBalance = (pool, graphSponsorData) => {
  const poolAddress = pool?.poolAddress
  const underlyingCollateralDecimals = pool?.underlyingCollateralDecimals

  let usersSponsorshipBalance = 0
  let usersSponsorshipBalanceBN = ethers.utils.bigNumberify(0)

  if (pool && graphSponsorData) {
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