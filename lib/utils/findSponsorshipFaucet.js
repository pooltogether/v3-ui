export const findSponsorshipFaucet = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.find((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })
}

export const findSponsorshipFaucets = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.filter((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })
}
