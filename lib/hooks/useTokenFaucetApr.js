import { useWMaticApr } from 'lib/hooks/useWMaticApr'

export const useTokenFaucetApr = (pool, tokenFaucet) => {
  let apr = tokenFaucet?.apr

  // sushi token faucet for sushi pool
  if (tokenFaucet.address === '0xddcf915656471b7c44217fb8c51f9888701e759a') {
    apr = 0
  }

  // wmatic faucet for usdt polygon pool
  if (pool.prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4') {
    apr = useWMaticApr(pool)
  }

  return apr
}

export const findSponsorshipFaucet = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.find((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })
}
