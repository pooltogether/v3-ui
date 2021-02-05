export const getCurrentPool = (querySymbol, pools) => {
  let pool = null

  if (querySymbol && pools?.length > 0) {
    pool = pools.find((_pool) => {
      let symbol = _pool?.symbol?.toLowerCase()

      return symbol === querySymbol
    })
  }

  return pool
}
