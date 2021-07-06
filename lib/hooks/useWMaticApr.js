import { SECONDS_PER_DAY } from 'lib/constants'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

const WMATIC_ADDRESS = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'

export const useWMaticApr = (pool) => {
  const currentBlock = -1
  const { data: tokenPrices } = useTokenPrices(1, {
    [currentBlock]: [WMATIC_ADDRESS]
  })
  const wmaticUsd = tokenPrices?.[currentBlock][WMATIC_ADDRESS].usd

  const { dripRatePerSecond } = pool.tokenListener
  const totalDripPerDay = Number(dripRatePerSecond) * SECONDS_PER_DAY
  const totalDripDailyValue = totalDripPerDay * wmaticUsd // USD MATIC PRICE
  const totalSupply = Number(pool.tokens.ticket.totalSupply)

  return (totalDripDailyValue / totalSupply) * 365 * 100
}
