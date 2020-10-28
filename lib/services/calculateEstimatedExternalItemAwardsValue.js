export function calculateEstimatedExternalItemAwardsValue(
  externalItemAwardsChainData,
) {
  let totalUsd = null
  
  externalItemAwardsChainData?.forEach(award => {
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
