export function calculateEstimatedExternalAwards(
  coingeckoData,
  externalAwardsChainData,
) {
  let totalUsd = null
  externalAwardsChainData?.forEach(award => {
    const priceData = coingeckoData?.[award.address]

    if (!priceData) {
      return
    }

    const priceUsd = priceData.usd
    const balance = ethers.utils.formatUnits(award.balance, award.decimals)
    

    if (totalUsd === null) {
      totalUsd = 0
    }

    totalUsd += parseFloat(balance) * priceUsd
    // console.log(`${balance} * ${priceUsd} = ${parseFloat(balance) * priceUsd}`)
  })
  // console.log({ totalUsd})

  return totalUsd
}
