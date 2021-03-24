export const YieldSources = Object.freeze({
  compoundFinanceYieldSource: 'compoundFinanceYieldSource',
  stakePrizeSource: 'stakePrizeSource',
  customYieldSource: 'customYieldSource'
})

export const determineYieldSource = (pool) => {
  if (pool.compoundPrizePool) {
    return YieldSources.compoundFinanceYieldSource
  }

  if (pool.stakePrizePool) {
    return YieldSources.stakePrizeSource
  }

  if (pool.yieldSource) {
    return YieldSources.customYieldSource
  }
}
