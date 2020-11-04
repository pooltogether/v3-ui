import { isEmpty } from 'lodash'

export function calculateEstimatedExternalAwardsValue(
  externalAwardsChainData,
) {
  let totalUsd = null

  if (isEmpty(externalAwardsChainData)) {
    return totalUsd
  }
  
  externalAwardsChainData.forEach(award => {
    if (!award.value) {
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
