export const findActiveSponsorshipFaucet = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.find((tokenFaucet) => {
    return (
      tokenFaucet.measure.toLowerCase() === sponsorshipAddress &&
      !tokenFaucet.remainingDaysUnformatted.isZero()
    )
  })
}

export const hasSponsorshipFaucets = (pool) => {
  const sponsorshipFaucets = findSponsorshipFaucets(pool)
  return sponsorshipFaucets && sponsorshipFaucets.length > 0
}

export const findSponsorshipFaucets = (pool) => {
  const sponsorshipAddress = pool.tokens.sponsorship.address.toLowerCase()

  return pool.tokenFaucets?.filter((tokenFaucet) => {
    return tokenFaucet.measure.toLowerCase() === sponsorshipAddress
  })
}
