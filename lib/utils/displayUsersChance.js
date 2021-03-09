import { ethers } from 'ethers'

import { MAX_SAFE_INTEGER } from 'lib/constants'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function displayUsersChance(total, userBalance, options = {}) {
  total = ethers.BigNumber.from(total)
  userBalance = ethers.BigNumber.from(userBalance)

  let PRECISION_DIVISOR = 1

  // If the numbers we're dealing with are higher than we can do
  // with basic JS math let's make them way smaller before we work
  // with them
  if (total.gt(MAX_SAFE_INTEGER) || userBalance.gt(MAX_SAFE_INTEGER)) {
    PRECISION_DIVISOR = 10000000000000
  }

  total = parseInt(total.div(PRECISION_DIVISOR), 10)
  userBalance = parseInt(userBalance.div(PRECISION_DIVISOR), 10)

  let result = total / userBalance

  // If it's more than 1 in 1,000 then don't show extra decimal precision
  if (result >= 1000) {
    options.precision = 0
  }

  // pass it off with the string locale for spanish or english rules, etc
  return numberWithCommas(result, options)
}
