import React from 'react'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@pooltogether/react-components'

import { DEFAULT_TOKEN_PRECISION, PRIZE_POOL_TYPES } from 'lib/constants'
import {
  CUSTOM_YIELD_SOURCE_NAMES,
  CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS
} from 'lib/constants/customYieldSourceImages'
import { BlockExplorerLink, LinkIcon } from 'lib/components/BlockExplorerLink'
import { Erc20Image } from 'lib/components/Erc20Image'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Card, CardDetailsList } from 'lib/components/Card'
import { useWMaticApr } from 'lib/hooks/useWMaticApr'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const PoolStats = (props) => {
  const { t } = useTranslation()

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
  const {
    title,
    convertedValue,
    sourceName,
    sourceAddress,
    tokenAddress,
    tokenAmount,
    tokenSymbol,
    value,
    content,
    tooltip
  } = props

  return (
    <li className='flex items-center justify-between mb-2 last:mb-0'>
      <span className='text-accent-1 flex mb-auto'>
        {title}:{' '}
        {tooltip && (
          <Tooltip
            id={`pool-stats-${title}-tooltip`}
            className='ml-1 sm:ml-2 my-auto text-accent-1'
            tip={tooltip}
          />
        )}
      </span>
      {(sourceAddress || value) && (
        <div className='flex items-center'>
          {sourceName && <span className='capitalize'>{sourceName}</span>}
          {sourceAddress && <Erc20Image address={sourceAddress} marginClasses='ml-1' />}
          {value && <span className='flex items-center'>{value}</span>}
        </div>
      )}

      {tokenSymbol && tokenAmount && (
        <div className='flex flex-col sm:flex-row flex-wrap justify-end items-end sm:items-center'>
          <div className='flex items-center'>
            <PoolNumber>{numberWithCommas(tokenAmount)}</PoolNumber>
            {tokenAddress && <Erc20Image address={tokenAddress} marginClasses='mx-1' />}
            <span>{tokenSymbol}</span>
          </div>
          {Boolean(convertedValue) && (
            <span className='opacity-30 sm:order-first sm:mr-2'>
              (${numberWithCommas(convertedValue)})
            </span>
          )}
        </div>
      )}

      {content}
    </li>
  )
}

// Stat components

const DepositsStat = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  return (
    <Stat
      title={t('totalDeposits')}
      convertedValue={pool.tokens.ticket.totalValueUsd}
      tokenAddress={pool.tokens.underlyingToken.address}
      tokenSymbol={pool.tokens.underlyingToken.symbol}
      tokenAmount={pool.tokens.ticket.totalSupply}
    />
  )
}

const SponsorshipStat = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  const poolIncentivizesSponsorship = pool.incentivizesSponsorship

  return (
    <>
      <Stat
        title={t('sponsorship')}
        convertedValue={pool.tokens.sponsorship.totalValueUsd}
        tokenAddress={pool.tokens.underlyingToken.address}
        tokenSymbol={pool.tokens.underlyingToken.symbol}
        tokenAmount={pool.tokens.sponsorship.totalSupply}
        tooltip={
          <>
            {t('sponsorshipInfo')}{' '}
            {poolIncentivizesSponsorship && <>. {t('rewardsAreForSponsorshipOnly')}</>}
          </>
        }
      />
    </>
  )
}

const ReserveStat = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  return (
    <Stat
      title={t('reserve')}
      convertedValue={pool.reserve.totalValueUsd}
      tokenAddress={pool.tokens.underlyingToken.address}
      tokenSymbol={pool.tokens.underlyingToken.symbol}
      tokenAmount={pool.reserve.amount}
      tooltip={t('reserveInfo')}
    />
  )
}

const ReserveRateStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  if (!pool.reserve.rateUnformatted) return null

  const reserveRateUnformattedPercentage = pool.reserve.rateUnformatted.mul(100)
  const reserveRatePercentage = ethers.utils.formatUnits(
    reserveRateUnformattedPercentage,
    DEFAULT_TOKEN_PRECISION
  )

  return (
    <Stat title={t('reserveRate')} percent={reserveRatePercentage} tooltip={t('reserveRateInfo')} />
  )
}

const YieldSourceStat = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const yieldSource = pool.prizePool.type

  let sourceAddress, sourceName, value
  if (yieldSource === PRIZE_POOL_TYPES.compound) {
    sourceName = 'Compound Finance'
    sourceAddress = ''
    sourceAddress = CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS['comp']
  } else if (yieldSource === PRIZE_POOL_TYPES.genericYield) {
    const yieldSourceAddress = pool.prizePool.yieldSource.address
    value = (
      <BlockExplorerLink chainId={pool.chainId} address={yieldSourceAddress}>
        <LinkIcon />
      </BlockExplorerLink>
    )

    sourceName = CUSTOM_YIELD_SOURCE_NAMES[pool.chainId]?.[yieldSourceAddress]
    if (!sourceName) {
      sourceName = t('customYieldSource')
    }

    sourceAddress = CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS[sourceName]
  } else {
    value = <span className='opacity-40'>--</span>
  }

  return (
    <Stat
      title={t('yieldSource')}
      value={value}
      sourceName={sourceName}
      sourceAddress={sourceAddress}
    />
  )
}

// audited vs unaudited

// APR Stats

const AprStats = (props) => {
  const { pool } = props

  let apr = pool.tokenListener?.apr

  if (pool.prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4') {
    apr = useWMaticApr(pool)
  }

  if (!apr) return null

  return (
    <>
      <hr />
      <DailyRewardsDistributionStat pool={pool} />
      <EffectiveAprStat pool={pool} apr={apr} />
    </>
  )
}

const DailyRewardsDistributionStat = (props) => {
  const { t } = useTranslation()
  const { pool } = props

  const dripRatePerDay = pool.tokenListener?.dripRatePerDay || ethers.constants.Zero
  const dripTokenSymbol = pool.tokens.tokenFaucetDripToken?.symbol
  const dripTokenAddress = pool.tokens.tokenFaucetDripToken?.address

  // TODO: Hardcoded to POOL but we might let people drip other tokens
  return (
    <Stat
      title={t('dailyPoolDistribution')}
      tokenAddress={dripTokenAddress}
      tokenSymbol={dripTokenSymbol}
      tokenAmount={dripRatePerDay}
    />
  )
}

const EffectiveAprStat = (props) => {
  const { apr, pool } = props

  const { t } = useTranslation()

  const poolIncentivizesSponsorship = pool.incentivizesSponsorship

  return (
    <Stat
      title={t('effectiveApr')}
      content={
        <span>
          {poolIncentivizesSponsorship && (
            <span className='opacity-30 mr-1'>{t('sponsorship')} </span>
          )}{' '}
          {displayPercentage(apr)}%
        </span>
      }
      tooltip={
        <>
          {t('effectiveAprInfo')}
          {poolIncentivizesSponsorship && <>. {t('rewardsAreForSponsorshipOnly')}</>}
        </>
      }
    />
  )
}
