import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'

import { useTranslation } from 'lib/../i18n'
import { ethers } from 'ethers'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { PoolNumber } from 'lib/components/PoolNumber'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { useTokenFaucetAPY } from 'lib/hooks/useTokenFaucetAPY'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { Tooltip } from 'lib/components/Tooltip'
import { Card, CardDetailsList } from 'lib/components/Card'
import { useTokenFaucetData } from 'lib/hooks/useTokenFaucetData'
import Dialog from '@reach/dialog'
import { TicketsSoldGraph } from 'lib/components/TicketsSoldGraph'
import { PrizeValueGraph } from 'lib/components/PrizeValueGraph'

export const PoolStats = (props) => {
  const { pool } = props

  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

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
    <>
      <Card>
        <div className='flex justify-between'>
          <h3>Pool's Stats</h3>
          <button className='text-accent-1' onClick={() => setIsOpen(true)}>
            {t('showMore')}
          </button>
        </div>
        <CardDetailsList>
          <StatsList {...props} />
        </CardDetailsList>
      </Card>
      <StatsModal pool={pool} isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  )
}

const StatsModal = (props) => {
  const { pool, closeModal, isOpen } = props

  const decimals = pool.underlyingCollateralDecimals
  const totalDeposits = ethers.BigNumber.from(pool.ticketToken.totalSupply)
  const totalDepositsFormatted = ethers.utils.formatUnits(totalDeposits, decimals)
  const tokenSymbol = pool.underlyingCollateralSymbol
  const currentPrize = pool.prizePool.captureAwardBalance[0]
  const currentPrizeFormatted = ethers.utils.formatUnits(currentPrize, decimals)

  // console.log(pool)

  return (
    <Dialog aria-label='Pool Stats Modal' isOpen={isOpen} onDismiss={closeModal}>
      <div className='text-inverse p-4 bg-card h-full sm:h-auto rounded-none sm:rounded-xl sm:max-w-lg mx-auto flex flex-col'>
        <div className='flex'>
          <button
            className='my-auto ml-auto close-button trans text-inverse hover:opacity-30'
            onClick={closeModal}
          >
            <FeatherIcon icon='x' className='w-6 h-6' />
          </button>
        </div>

        <div className='mb-8'>
          <div className='flex'>
            <h5>Historic Deposits</h5>
            <Tooltip
              id={'historic-prizes'}
              className='ml-2 my-auto text-accent-1'
              tip={'Deposits include both tickets & sponsorship'}
            />
          </div>
          <span>Current deposits:</span>
          <span className='ml-4'>
            <PoolNumber>{numberWithCommas(totalDepositsFormatted, { precision: 2 })}</PoolNumber>
            <span>{tokenSymbol}</span>
          </span>
          <TicketsSoldGraph pool={pool} />
        </div>

        <div className='mb-8'>
          <div className='flex'>
            <h5>Historic Prizes </h5>
            <Tooltip
              id={'historic-prizes'}
              className='ml-2 my-auto text-accent-1'
              tip={'Prizes shown do not include externally added tokens'}
            />
          </div>
          <span>Current prize:</span>
          <span className='ml-4'>
            <PoolNumber>{numberWithCommas(currentPrizeFormatted, { precision: 2 })}</PoolNumber>
            <span>{tokenSymbol}</span>
          </span>
          <PrizeValueGraph pool={pool} />
        </div>
      </div>
    </Dialog>
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
  const { title, tokenSymbol, tokenAmount, value, percent, tooltip } = props
  return (
    <li className='flex justify-between mb-2 last:mb-0 xs:mx-4'>
      <span className='text-accent-1 flex'>
        {title}:{' '}
        {tooltip && <Tooltip id={title} className='ml-2 my-auto text-accent-1' tip={tooltip} />}
      </span>
      {value && <span>{value}</span>}
      {tokenSymbol && tokenAmount && (
        <span>
          <PoolNumber>{numberWithCommas(tokenAmount, { precision: 2 })}</PoolNumber>
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
      // TODO: Get better tooltips from leighton
      tooltip='Governance controlled funds contributing interest to the prize without being eligible to win'
    />
  )
}

const ReserveRateStat = (props) => {
  const { pool } = props

  const reserveRatePercentage = pool.reserveRate.mul(100)
  const reserveRate = ethers.utils.formatUnits(reserveRatePercentage, DEFAULT_TOKEN_PRECISION)

  return (
    <Stat
      title='Reserve rate'
      percent={reserveRate}
      tooltip='Percent of each prize deposited into reserve'
    />
  )
}

const YieldSourceStat = (props) => {
  const { pool } = props

  // TODO: Update `isStakePrizePool` across the app to support any yield source
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
      tooltip='Deposited funds contributing interest to the prize without being eligible to win'
    />
  )
}

// APR Stats

const AprStats = (props) => {
  const { pool } = props

  // TODO: hardcode reserve rate for dai pool

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

  const { data, isFetched } = useTokenFaucetData(pool.tokenListener)

  let tokenAmount = '0'
  if (isFetched) {
    const dripRatePerDay = data.dripRatePerSecond.mul(SECONDS_PER_DAY)
    tokenAmount = ethers.utils.formatUnits(dripRatePerDay, DEFAULT_TOKEN_PRECISION)
  }

  return <Stat title='Daily POOL distribution' tokenSymbol={'POOL'} tokenAmount={tokenAmount} />
}

const EffectiveAprStat = (props) => {
  const { apy } = props
  return (
    <Stat
      title='Effective APR'
      percent={apy}
      tooltip='Current APR of deposited funds based on value of POOL tokens received'
    />
  )
}
