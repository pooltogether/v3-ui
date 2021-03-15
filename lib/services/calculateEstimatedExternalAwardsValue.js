import { isEmpty } from 'lodash'

export function calculateEstimatedExternalAwardsValue(awards) {
  let totalUsd = null

  // TODO: these need to come from the parent as an indication that we're still fetching data
  const calculatingExternalAwardValues = false
  const calculatingLootBoxAwardValues = false

  const stillCalculating = calculatingExternalAwardValues || calculatingLootBoxAwardValues

  if (stillCalculating) {
    return null
  }

  if (isEmpty(awards)) {
    return 0
  }

  const keys = Object.keys(awards)

  keys.forEach((key) => {
    const award = awards[key]

    if (!award.value) {
      return
    }

    if (totalUsd === null) {
      totalUsd = 0
    }

    totalUsd += award.value
  })

  if (totalUsd === null) {
    totalUsd = 0
  }

  return totalUsd
}
