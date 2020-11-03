import { isEmpty } from 'lodash'

export function calculateEstimatedExternalAwardsValue(
  externalAwardsChainData,
) {
  let totalUsd = null

  console.log(externalAwardsChainData)
  if (isEmpty(externalAwardsChainData)) {
    console.log('is empty!')
    return totalUsd
  }
  
  console.log(externalAwardsChainData)
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
