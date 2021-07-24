import {
  FIRST_SUSHI_FAUCET_ADDRESS,
  FIRST_POLYGON_USDT_FAUCET_ADDRESS
} from 'lib/constants/tokenFaucets'

export const useTokenFaucetApr = (tokenFaucet) => {
  let apr = tokenFaucet?.apr

  const isFirstSushiFaucet = tokenFaucet.address === FIRST_SUSHI_FAUCET_ADDRESS
  const isFirstPolygonUsdtFaucet = tokenFaucet.address === FIRST_POLYGON_USDT_FAUCET_ADDRESS

  // sushi token faucet for sushi pool
  if (isFirstSushiFaucet || isFirstPolygonUsdtFaucet) {
    apr = 0
  }

  return apr
}

export const findSponsorshipFaucet = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.find((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })
}
