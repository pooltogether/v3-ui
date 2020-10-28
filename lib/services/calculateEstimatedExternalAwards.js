export function calculateEstimatedExternalAwards(
  externalAwardsChainData,
) {
  let totalUsd = null
  
  externalAwardsChainData?.forEach(award => {
    if (!award.value) {
      return
    }

    if (totalUsd === null) {
      totalUsd = 0
    }

    totalUsd += award.value
  })

  return totalUsd
}
