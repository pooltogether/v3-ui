import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { ethers } from 'ethers'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { PoolNumber } from 'lib/components/PoolNumber'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { useTokenFaucetAPY } from 'lib/hooks/useTokenFaucetAPY'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { useTokenFaucetDripRate } from 'lib/hooks/useTokenFaucetDripRate'

export const PoolStats = (props) => {
  const { pool } = props

  const loading =
    !pool.ticketToken || !pool.sponsorshipToken || !pool.reserveRegistry || !pool.reserveTotalSupply

  if (loading) {
    return (
      <Card>
        <h3 className='mb-4'>Pool's Stats</h3>
        <IndexUILoader />
      </Card>
    )
  }

  return (
    <Card>
      <h3>Pool's Stats</h3>
      <CardDetails>
        <StatsList {...props} />
      </CardDetails>
    </Card>
  )
}

const StatsList = (props) => {
  const { pool } = props

  return (
    <div className='flex flex-col'>
      <DepositsStat pool={pool} />
      <SponsorshipStat pool={pool} />
      <ReserveStat pool={pool} />
      <ReserveRateStat pool={pool} />
      <YieldSourceStat pool={pool} />
      <AprStats pool={pool} />
    </div>
  )
}

const Stat = (props) => {
  const { title, tokenSymbol, tokenAmount, value, percent } = props
  return (
    <div className='flex justify-between text-sm xs:text-base sm:text-lg mb-4 last:mb-0 xs:mx-4'>
      <span className='text-accent-1'>{title}:</span>
      {value && <span>{value}</span>}
      {tokenSymbol && tokenAmount && (
        <span>
          <PoolNumber>{numberWithCommas(tokenAmount, { precision: 2 })}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
      )}
      {percent && <span>{displayPercentage(percent)}%</span>}
    </div>
  )
}

// Stat components

const DepositsStat = (props) => {
  const { pool } = props

  const ticketDeposits = ethers.BigNumber.from(pool.ticketToken.totalSupply)
  const ticketDepositsFormatted = ethers.utils.formatUnits(
    ticketDeposits,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title='Total deposits'
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={ticketDepositsFormatted}
    />
  )
}

const ReserveStat = (props) => {
  const { pool } = props

  const reserveAmount = ethers.utils.formatUnits(
    pool.reserveTotalSupply,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title='Reserve'
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={reserveAmount}
    />
  )
}

const ReserveRateStat = (props) => {
  const { pool } = props

  const reserveRatePercentage = pool.reserveRate.mul(100)
  const reserveRate = ethers.utils.formatUnits(reserveRatePercentage, DEFAULT_TOKEN_PRECISION)

  return <Stat title='Reserve rate' percent={reserveRate} />
}

const YieldSourceStat = (props) => {
  const { pool } = props

  const yeildSource = pool.isStakePrizePool ? 'Stake' : 'Compound Finance'

  return <Stat title='Yield source' value={yeildSource} />
}

const SponsorshipStat = (props) => {
  const { pool } = props

  const sponsorshipDeposits = ethers.BigNumber.from(pool.sponsorshipToken.totalSupply)
  const sponsorshipDepositsFormatted = ethers.utils.formatUnits(
    sponsorshipDeposits,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title='Sponsorship'
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={sponsorshipDepositsFormatted}
    />
  )
}

// APR Stats

const AprStats = (props) => {
  const { pool } = props

  const apy = useTokenFaucetAPY(pool)

  if (!apy) return null

  return (
    <>
      <hr />
      <DailyPoolDistributionStat pool={pool} />
      <EffectiveAprStat apy={apy} />
    </>
  )
}

const DailyPoolDistributionStat = (props) => {
  const { pool } = props

  const { data, isFetched } = useTokenFaucetDripRate(pool.tokenListener)

  let tokenAmount = '0'
  if (isFetched) {
    const dripRatePerDay = data.dripRatePerSecond.mul(SECONDS_PER_DAY)
    tokenAmount = ethers.utils.formatUnits(dripRatePerDay, DEFAULT_TOKEN_PRECISION)
  }

  return <Stat title='Daily POOL distribution' tokenSymbol={'POOL'} tokenAmount={tokenAmount} />
}

const EffectiveAprStat = (props) => {
  const { apy } = props
  return <Stat title='Effective APR' percent={apy} />
}

// Cards

const Card = (props) => (
  <div className='non-interactable-card my-6 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'>
    {props.children}
  </div>
)

const CardDetails = (props) => (
  <div className='xs:bg-primary theme-light--no-gutter text-inverse rounded-lg p-0 sm:px-4 sm:py-8 mt-4'>
    {props.children}
  </div>
)
