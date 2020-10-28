export function calculateEstimatedExternalAwards(
  externalAwardsChainData,
) {
  let totalUsd = null
  
  // console.log('8***********8')
  externalAwardsChainData?.forEach(award => {
    if (!award.value) {
      // console.log(award.name, award.address)

      return
    }

    if (totalUsd === null) {
      totalUsd = 0
    }
    // console.log(award.name, award.address)

    totalUsd += award.value
  })

  return totalUsd
}
