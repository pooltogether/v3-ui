import { isEmpty } from 'lodash'

export function calculateExternalAwardsValue(
  externalAwardsGraphData,
) {
  let totalUsd = null

  if (isEmpty(externalAwardsGraphData)) {
    return totalUsd
  }

  const keys = Object.keys(externalAwardsGraphData)

  keys.forEach(key => {
    const award = externalAwardsGraphData[key]

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
