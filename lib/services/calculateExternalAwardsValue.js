import { isEmpty } from 'lodash'

export function calculateExternalAwardsValue(awards) {
  let totalUsd = null

  if (isEmpty(awards)) {
    return totalUsd
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

  return totalUsd
}
