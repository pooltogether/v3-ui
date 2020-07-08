export const getPrizePoolAddressByTicker = (ticker, addresses) => {
  return addresses[`${ticker.toLowerCase()}PrizePool`]
}
