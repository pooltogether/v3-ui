export const PodTokenFaucetListItem = () => {
  const [isSelf] = useAtom(isSelfAtom)
  const { t } = useTranslation()

  const tokenFaucetAddress = tokenFaucet?.address

  const apr = useTokenFaucetApr(tokenFaucet)

  if (!tokenFaucet?.dripToken) {
    return null
  }

  const dripRatePerSecond = tokenFaucet?.dripRatePerSecond || 0
  const dripToken = tokenFaucet?.dripToken

  const name = t('prizePoolTicker', { ticker: underlyingToken.symbol })

  const poolTicketData = playerTickets?.find((t) => t.poolAddress === pool.prizePool.address)
  const ticketData = poolTicketData?.ticket

  const ticketTotalSupply = pool.tokens.ticket.totalSupply
  const totalSupplyOfTickets = parseInt(ticketTotalSupply, 10)
  const usersBalance = ticketData?.amount || 0

  const ownershipPercentage = usersBalance / totalSupplyOfTickets

  const isFirstSushiFaucet = tokenFaucet.address === FIRST_SUSHI_FAUCET_ADDRESS
  const isFirstPolygonUsdtFaucet = tokenFaucet.address === FIRST_POLYGON_USDT_FAUCET_ADDRESS
  let totalDripPerDay = dripRatePerSecond * SECONDS_PER_DAY
  if (isFirstSushiFaucet || isFirstPolygonUsdtFaucet) {
    totalDripPerDay = 0
  }

  const isSecondPolygonUsdtFaucet = tokenFaucet.address === SECOND_POLYGON_USDT_FAUCET_ADDRESS
  if (isSecondPolygonUsdtFaucet) {
    return null
  }

  const usersDripPerDay = totalDripPerDay * ownershipPercentage
  const usersDripPerDayFormatted = numberWithCommas(usersDripPerDay)
  const totalDripPerDayFormatted = numberWithCommas(Math.round(totalDripPerDay))

  const isClaimable = !claimableAmountUnformatted?.isZero()
  return <TokenFaucetListItem />
}
