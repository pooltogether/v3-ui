import { SECONDS_PER_DAY } from 'lib/constants'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

const ETH_MAINNET_MATIC_ADDRESS = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
const POLYGON_WMATIC_ADDRESS = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'

export const useWMaticApr = (pool) => {
  const currentBlock = -1
  const { data: tokenPrices } = useTokenPrices(1, {
    [currentBlock]: [ETH_MAINNET_MATIC_ADDRESS]
  })
  const wmaticUsd = tokenPrices?.[currentBlock][ETH_MAINNET_MATIC_ADDRESS].usd

  const tokenFaucet = pool.tokenFaucets.find(
    (tokenFaucet) => tokenFaucet.asset === POLYGON_WMATIC_ADDRESS
  )

  const { dripRatePerSecond } = tokenFaucet
  const totalDripPerDay = Number(dripRatePerSecond) * SECONDS_PER_DAY
  const totalDripDailyValue = totalDripPerDay * wmaticUsd // USD MATIC PRICE
  const totalSupply = Number(pool.tokens.ticket.totalSupply)

  return (totalDripDailyValue / totalSupply) * 365 * 100
}
