import React from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { PoolNumber } from 'lib/components/PoolNumber'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Tooltip } from 'lib/components/Tooltip'
import { useTokenFaucetAPR } from 'lib/hooks/useTokenFaucetAPR'
import { Card, CardDetailsList } from 'lib/components/Card'
import { useTokenFaucetData } from 'lib/hooks/useTokenFaucetData'
import { determineYieldSource, YieldSources } from 'lib/utils/determineYieldSource'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import CompSvg from 'assets/images/comp.svg'

export const PoolStats = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const loading =
    !pool.ticketToken || !pool.sponsorshipToken || !pool.reserveRegistry || !pool.reserveTotalSupply

  if (loading) {
    return (
      <Card>
        <h3 className='mb-4'>{t('poolsStats')}</h3>
        <IndexUILoader />
      </Card>
    )
  }

  return (
    <>
      <Card>
        <div className='flex justify-between'>
          <h3>{t('poolsStats')}</h3>
        </div>
        <CardDetailsList>
          <StatsList {...props} />
        </CardDetailsList>
      </Card>
    </>
  )
}

const StatsList = (props) => {
  const { pool } = props

  return (
    <>
      <DepositsStat pool={pool} />
      <SponsorshipStat pool={pool} />
      <ReserveStat pool={pool} />
      <ReserveRateStat pool={pool} />
      <YieldSourceStat pool={pool} />
      <AprStats pool={pool} />
    </>
  )
}

// Generic stat component

const Stat = (props) => {
  const { title, tokenSymbol, sourceImage, tokenAmount, value, percent, tooltip } = props

  return (
    <li className='flex justify-between mb-2 last:mb-0'>
      <span className='text-accent-1 flex'>
        {title}:{' '}
        {tooltip && <Tooltip id={title} className='ml-2 my-auto text-accent-1' tip={tooltip} />}
      </span>
      {(sourceImage || value) && (
        <span className='flex items-center'>
          {sourceImage} {value && <span>{value}</span>}
        </span>
      )}
      {tokenSymbol && tokenAmount && (
        <span>
          <PoolNumber>{numberWithCommas(tokenAmount)}</PoolNumber>
          <span>{tokenSymbol}</span>
        </span>
      )}
      {percent && <span>{displayPercentage(percent)}%</span>}
    </li>
  )
}

// Stat components

const DepositsStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const ticketDeposits = ethers.BigNumber.from(pool.ticketToken.totalSupply)
  const ticketDepositsFormatted = ethers.utils.formatUnits(
    ticketDeposits,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title={t('totalDeposits')}
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={ticketDepositsFormatted}
    />
  )
}

const ReserveStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const reserveAmount = ethers.utils.formatUnits(
    pool.reserveTotalSupply,
    pool.underlyingCollateralDecimals
  )

  return (
    <Stat
      title={t('reserve')}
      tokenSymbol={pool.underlyingCollateralSymbol}
      tokenAmount={reserveAmount}
      tooltip={t('reserveInfo')}
    />
  )
}

const ReserveRateStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const reserveRatePercentage = pool.reserveRate.mul(100)
  const reserveRate = ethers.utils.formatUnits(reserveRatePercentage, DEFAULT_TOKEN_PRECISION)

  return <Stat title={t('reserveRate')} percent={reserveRate} tooltip={t('reserveRateInfo')} />
}

const YieldSourceStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const yieldSource = determineYieldSource(pool)

  let sourceImage
  if (yieldSource === YieldSources.compoundFinanceYieldSource) {
    sourceImage = <img src={CompSvg} className='w-6 mr-2' />
  }

  if (yieldSource === YieldSources.customYieldSource) {
    sourceImage = <img src='/ticket-bg--light-sm.png' className='w-6 mr-2' />
  }

  return <Stat title={t('yieldSource')} value={t(yieldSource)} sourceImage={sourceImage} />
}

const SponsorshipStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const sponsorshipDeposits = ethers.BigNumber.from(pool.sponsorshipToken.totalSupply)
  const sponsorshipDepositsFormatted = ethers.utils.formatUnits(
    sponsorshipDeposits,
    pool.underlyingCollateralDecimals
  )

  return (
    <>
      <Stat
        title={t('sponsorship')}
        tokenSymbol={pool.underlyingCollateralSymbol}
        tokenAmount={sponsorshipDepositsFormatted}
        tooltip={t('sponsorshipInfo')}
      />
    </>
  )
}

// APR Stats

const AprStats = (props) => {
  const { pool } = props

  const apr = useTokenFaucetAPR(pool)

  if (!apr) return null

  return (
    <>
      <hr />
      <DailyPoolDistributionStat pool={pool} />
      <EffectiveAprStat apr={apr} />
    </>
  )
}

const DailyPoolDistributionStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const { data, isFetched } = useTokenFaucetData(pool.tokenListener)

  let tokenAmount = '0'
  if (isFetched) {
    const dripRatePerDay = data.dripRatePerSecond.mul(SECONDS_PER_DAY)
    tokenAmount = ethers.utils.formatUnits(dripRatePerDay, DEFAULT_TOKEN_PRECISION)
  }

  return <Stat title={t('dailyPoolDistribution')} tokenSymbol={'POOL'} tokenAmount={tokenAmount} />
}

const EffectiveAprStat = (props) => {
  const { apr } = props

  const { t } = useTranslation()

  return <Stat title={t('effectiveApr')} percent={apr} tooltip={t('effectiveAprInfo')} />
}
