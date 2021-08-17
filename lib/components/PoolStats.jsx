import React from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'
import { Tooltip, TokenIcon } from '@pooltogether/react-components'
import { PRIZE_POOL_TYPES } from '@pooltogether/current-pool-data'

import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import {
  CUSTOM_YIELD_SOURCE_NAMES,
  CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS
} from 'lib/constants/customYieldSourceImages'
import { BlockExplorerLink, LinkIcon } from 'lib/components/BlockExplorerLink'
import { Erc20Image } from 'lib/components/Erc20Image'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Card, CardDetailsList } from 'lib/components/Card'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { findSponsorshipFaucet } from 'lib/utils/findSponsorshipFaucet'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { NETWORK, toNonScaledUsdString } from '@pooltogether/utilities'

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
      <TicketDepositsStat pool={pool} />
      <SponsorshipStat pool={pool} />
      <ReserveStat pool={pool} />
      <TotalDepositsStat pool={pool} />
      <ReserveRateStat pool={pool} />
      <YieldSourceStat pool={pool} />
      <AprStats pool={pool} />
    </>
  )
}

// Generic stat component

const Stat = (props) => {
  const {
    chainId,
    title,
    convertedValue,
    sourceName,
    sourceAddress,
    tokenAddress,
    tokenAmount,
    tokenSymbol,
    value,
    content,
    percent,
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
          {sourceAddress && (
            <TokenIcon chainId={NETWORK.mainnet} address={sourceAddress} className='ml-1' />
          )}
          {value && <span className='flex items-center'>{value}</span>}
        </div>
      )}

      {tokenSymbol && tokenAmount && (
        <div className='flex flex-col sm:flex-row flex-wrap justify-end items-end sm:items-center'>
          <div className='flex items-center'>
            <PoolNumber>{numberWithCommas(tokenAmount)}</PoolNumber>
            {tokenAddress && (
              <TokenIcon chainId={chainId} address={tokenAddress} className='mx-1' />
            )}
            <span>{tokenSymbol}</span>
          </div>
          {Boolean(convertedValue) && (
            <span className='opacity-30 sm:order-first sm:mr-2'>
              (${numberWithCommas(convertedValue)})
            </span>
          )}
        </div>
      )}

      {percent && `${displayPercentage(percent)}%`}

      {content}
    </li>
  )
}

// Stat components

const TicketDepositsStat = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  return (
    <Stat
      chainId={pool.chainId}
      title={t('prizeEligibleDeposits')}
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

  return (
    <>
      <Stat
        chainId={pool.chainId}
        title={t('sponsorship')}
        convertedValue={pool.tokens.sponsorship.totalValueUsd}
        tokenAddress={pool.tokens.underlyingToken.address}
        tokenSymbol={pool.tokens.underlyingToken.symbol}
        tokenAmount={pool.tokens.sponsorship.totalSupply}
        tooltip={t('sponsorshipInfo')}
      />
    </>
  )
}

const ReserveStat = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  return (
    <Stat
      chainId={pool.chainId}
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

const TotalDepositsStat = (props) => {
  const { pool } = props
  const { t } = useTranslation()
  const { underlyingToken } = pool.tokens

  const depositedTokensTotalValueUsdScaled = pool.tokens.sponsorship.totalValueUsdScaled.add(
    pool.tokens.ticket.totalValueUsdScaled
  )
  const depositedTokensTotalValueUsd = toNonScaledUsdString(depositedTokensTotalValueUsdScaled)
  const depositedTokensTotalSupplyUnformatted = pool.tokens.sponsorship.totalSupplyUnformatted.add(
    pool.tokens.ticket.totalSupplyUnformatted
  )
  const depositedTokensTotalSupply = ethers.utils.formatUnits(
    depositedTokensTotalSupplyUnformatted,
    underlyingToken.decimals
  )

  return (
    <>
      <Stat
        chainId={pool.chainId}
        title={t('totalDeposits')}
        convertedValue={depositedTokensTotalValueUsd}
        tokenAddress={underlyingToken.address}
        tokenSymbol={underlyingToken.symbol}
        tokenAmount={depositedTokensTotalSupply}
      />
    </>
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
    sourceAddress = CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS.comp
  } else if (yieldSource === PRIZE_POOL_TYPES.cream) {
    sourceName = 'CREAM Finance'
    sourceAddress = ''
    sourceAddress = CUSTOM_YIELD_SOURCE_TOKEN_ADDRESS.cream
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
      chainId={pool.chainId}
      title={t('yieldSource')}
      value={value}
      sourceName={sourceName}
      sourceAddress={sourceAddress}
    />
  )
}

const AprStats = (props) => {
  const { pool } = props

  return pool?.tokenFaucets?.map((tokenFaucet) => (
    <TokenFaucetAprRow
      key={`token-faucet-apr-row-${tokenFaucet.address}`}
      pool={pool}
      tokenFaucet={tokenFaucet}
    />
  ))
}

const TokenFaucetAprRow = (props) => {
  const { pool, tokenFaucet } = props

  const { apr } = tokenFaucet

  if (!apr) return null

  return (
    <>
      <hr />
      <DailyRewardsDistributionStat tokenFaucet={tokenFaucet} pool={pool} />
      <EffectiveAprStat tokenFaucet={tokenFaucet} pool={pool} apr={apr} />
    </>
  )
}

const DailyRewardsDistributionStat = (props) => {
  const { t } = useTranslation()
  const { pool, tokenFaucet } = props

  const dripToken = tokenFaucet?.dripToken
  const dripRatePerDay = tokenFaucet?.dripRatePerDay || 0

  return (
    <Stat
      chainId={pool.chainId}
      title={t('dailyPoolDistribution')}
      tokenAddress={dripToken?.address}
      tokenSymbol={dripToken?.symbol}
      tokenAmount={Math.round(Number(dripRatePerDay))}
    />
  )
}

const EffectiveAprStat = (props) => {
  const { apr, pool, tokenFaucet } = props

  const { t } = useTranslation()

  const faucetIncentivizesSponsorship = findSponsorshipFaucet(pool) === tokenFaucet

  return (
    <Stat
      title={
        <>
          {t('effectiveApr')}
          {faucetIncentivizesSponsorship && (
            <Link href='/rewards#sponsorship'>
              <a className='opacity-50 hover:opacity-100 trans trans-fast hover:text-highlight-1 ml-1 underline'>
                ({t('sponsorship')})
              </a>
            </Link>
          )}
        </>
      }
      content={<span>{displayPercentage(apr)}%</span>}
      tooltip={
        <>
          {t('effectiveAprInfo')}
          {faucetIncentivizesSponsorship && <>. {t('rewardsAreForSponsorshipOnly')}</>}
        </>
      }
    />
  )
}
