import { useWMaticApr } from 'lib/hooks/useWMaticApr'

import {
  FIRST_SUSHI_FAUCET_ADDRESS,
  FIRST_POLYGON_USDT_FAUCET_ADDRESS
} from 'lib/constants/tokenFaucets'

export const useTokenFaucetApr = (pool, tokenFaucet) => {
  let apr = tokenFaucet?.apr

  const isFirstSushiFaucet = tokenFaucet.address === FIRST_SUSHI_FAUCET_ADDRESS
  const isFirstPolygonUsdtFaucet = tokenFaucet.address === FIRST_POLYGON_USDT_FAUCET_ADDRESS

  // sushi token faucet for sushi pool
  if (isFirstSushiFaucet || isFirstPolygonUsdtFaucet) {
    apr = 0
  }

  // // regular wmatic faucet for usdt polygon pool
  // if (tokenFaucet.address === '0x90a8d8ee6fdb1875028c6537877e6704b2646c51') {
  //   apr = useWMaticApr(pool)
  // }

  return apr
}

export const findSponsorshipFaucet = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.find((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })
}
