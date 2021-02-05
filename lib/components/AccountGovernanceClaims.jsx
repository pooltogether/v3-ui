import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import ClipLoader from 'react-spinners/ClipLoader'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'
import CountUp from 'react-countup'
import { usePreviousValue } from 'beautiful-react-hooks'

import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import TokenFaucetProxyFactoryAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucetProxyFactory'

import {
  CONTRACT_ADDRESSES,
  DEFAULT_TOKEN_PRECISION,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SECONDS_PER_WEEK,
} from 'lib/constants'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { useAccount } from 'lib/hooks/useAccount'
import { useClaimablePool } from 'lib/hooks/useClaimablePool'
import { useClaimablePoolTokenFaucetAddresses } from 'lib/hooks/useClaimablePoolTokenFaucetAddresses'
import { usePools } from 'lib/hooks/usePools'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTimeCountdown } from 'lib/hooks/useTimeCountdown'
import { useTotalClaimablePool } from 'lib/hooks/useTotalClaimablePool'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { usePool } from 'lib/hooks/usePool'
import {
  getMaxPrecision,
  getMinPrecision,
  getPrecision,
  numberWithCommas,
} from 'lib/utils/numberWithCommas'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTransaction } from 'lib/hooks/useTransaction'

export const AccountGovernanceClaims = (props) => {
  const { pools } = usePools()
  const { t } = useTranslation()

  const {
    isFetched,
    isFetching,
    refetch: refetchTotalClaimablePool,
    refetchAllClaimableBalances,
  } = useTotalClaimablePool()
  const { usersAddress } = useContext(AuthControllerContext)
  const { refetch: refetchPoolTokenData } = usePoolTokenData()

  const refetchAllPoolTokenData = () => {
    refetchTotalClaimablePool()
    refetchAllClaimableBalances()
    refetchPoolTokenData()
  }

  if (!isFetched || (isFetching && !isFetched)) {
    return null
  }

  if (!usersAddress) {
    return null
  }

  return (
    <>
      <h6 className='font-normal text-accent-2 mt-16 mb-4'>{t('governance')}</h6>
      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
        <ClaimHeader refetchAllPoolTokenData={refetchAllPoolTokenData} />
        {pools.map((pool) => (
          <ClaimablePoolTokenItem
            refetchAllPoolTokenData={refetchAllPoolTokenData}
            key={pool.id}
            pool={pool}
          />
        ))}
      </div>
    </>
  )
}

const ClaimHeader = (props) => {
  const { t } = useTranslation()
  const { refetchAllPoolTokenData } = props

  // TODO: get a link for "What can I Do with POOL"
  const { data: totalClaimablePool } = useTotalClaimablePool()

  return (
    <div className='flex justify-between flex-col sm:flex-row p-2 sm:p-0'>
      <div className='flex sm:flex-col justify-between sm:justify-start'>
        <h6 className='flex items-center font-normal'>{t('claimablePool')}</h6>
        <h2
          className={classnames('leading-none text-2xl sm:text-3xl mt-0 xs:mt-2', {
            'text-flashy': totalClaimablePool > 0,
          })}
        >
          <ClaimableAmountCountUp amount={totalClaimablePool} />
        </h2>
      </div>

      <div className='flex flex-col-reverse sm:flex-col'>
        <ClaimAllButton
          refetchAllPoolTokenData={refetchAllPoolTokenData}
          claimable={totalClaimablePool > 0}
        />
        <span className='sm:text-right text-accent-1 text-xxs'>{t('whatCanIDoWithPool')}</span>
      </div>
    </div>
  )
}

const ClaimAllButton = (props) => {
  const { t } = useTranslation()
  const { claimable, refetchAllPoolTokenData } = props

  const { usersAddress, chainId } = useContext(AuthControllerContext)
  const { isFetched, data: tokenFaucetAddresses } = useClaimablePoolTokenFaucetAddresses()

  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [usersAddress, tokenFaucetAddresses]

    const id = await sendTx(
      t('claimAll'),
      TokenFaucetProxyFactoryAbi,
      CONTRACT_ADDRESSES[chainId].TokenFaucetProxyFactory,
      'claimAll',
      params,
      refetchAllPoolTokenData
    )
    setTxId(id)
  }

  let text = t('claimAll')
  if (txPending) {
    if (tx.sent) {
      text = t('confirming')
    } else {
      text = t('claiming')
    }
  }

  return (
    <Button
      type='button'
      onClick={handleClaim}
      className='mb-4'
      disabled={!isFetched || !claimable || txPending}
      padding='px-8 py-1'
      border='green'
      text='primary'
      bg='green'
      hoverBorder='green'
      hoverText='primary'
      hoverBg='green'
      textSize='xxs'
    >
      {txPending && (
        <span className='mr-2'>
          <ClipLoader size={14} color={'#049c9c'} />
        </span>
      )}
      {text}
    </Button>
  )
}

const ClaimablePoolTokenItem = (props) => {
  const { t } = useTranslation()
  const { pool, refetchAllPoolTokenData } = props
  const { usersAddress } = useContext(AuthControllerContext)
  const { accountData } = useAccount(usersAddress)
  const { playerTickets } = usePlayerTickets(accountData)
  const { name, symbol } = pool
  const { pool: poolInfo } = usePool(symbol)
  const tokenFaucetAddress = poolInfo.tokenListener

  const { refetch: refetchClaimablePool, data, isFetching, isFetched, error } = useClaimablePool(
    symbol
  )

  if (!isFetched || (isFetching && !isFetched)) {
    return null
  }

  const { dripRatePerSecond, measureTokenAddress, totalSupply, amountClaimable } = data

  const ticketData = playerTickets.find(
    (playerTicket) => playerTicket.pool.ticket.id === measureTokenAddress
  )
  if (!ticketData) {
    return null
  }

  const totalSupplyOfTickets = Number(
    ethers.utils.formatUnits(
      ethers.utils.bigNumberify(ticketData.pool.ticketSupply),
      DEFAULT_TOKEN_PRECISION
    )
  )
  const usersBalance = Number(ethers.utils.formatUnits(ticketData.balance, DEFAULT_TOKEN_PRECISION))

  const ownershipPercentage = usersBalance / totalSupplyOfTickets
  const dripRatePerSecondNumber = Number(
    ethers.utils.formatUnits(dripRatePerSecond, DEFAULT_TOKEN_PRECISION)
  )

  const totalDripPerDay = dripRatePerSecondNumber * SECONDS_PER_DAY
  const usersDripPerDay = totalDripPerDay * ownershipPercentage
  const usersDripPerDayFormatted = numberWithCommas(usersDripPerDay, {
    precision: getPrecision(usersDripPerDay),
  })
  const totalDripPerDayFormatted = numberWithCommas(totalDripPerDay, {
    precision: getPrecision(totalDripPerDay),
  })

  const secondsLeft = totalSupply.div(dripRatePerSecond).toNumber()

  const claimablePoolNumber = Number(
    ethers.utils.formatUnits(amountClaimable, DEFAULT_TOKEN_PRECISION)
  )

  return (
    <div className='bg-body p-6 rounded flex flex-col sm:flex-row sm:justify-between mt-4 sm:mt-8'>
      <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start mb-6 sm:mb-0'>
        <PoolCurrencyIcon
          pool={{ underlyingCollateralSymbol: poolInfo.underlyingCollateralSymbol }}
          className='h-16 w-16 sm:h-16 sm:w-16 sm:mr-4'
        />
        <div className='xs:w-64'>
          <h3 className='leading-none'>{name}</h3>
          <div className='text-accent-1 text-xs mt-1'>
            {totalDripPerDayFormatted} POOL / {t('day')}
          </div>
          <RewardTimeLeft initialSecondsLeft={secondsLeft} />
        </div>
      </div>

      <div className='sm:text-right'>
        <h3 className='leading-none'>
          <ClaimableAmountCountUp amount={claimablePoolNumber} suffix=' POOL' />
        </h3>
        <div className='text-accent-1 text-xs mb-4'>
          @ {usersDripPerDayFormatted} POOL / {t('day')}
        </div>
        <div className='sm:max-w-xxs sm:ml-auto'>
          <ClaimButton
            refetch={() => {
              refetchClaimablePool()
              refetchAllPoolTokenData()
            }}
            name={name}
            tokenFaucetAddress={tokenFaucetAddress}
            claimable={claimablePoolNumber > 0}
          />
        </div>
      </div>
    </div>
  )
}

const ClaimableAmountCountUp = (props) => {
  const { amount, ...countUpProps } = props
  const prevAmount = usePreviousValue(amount)

  return (
    <CountUp
      start={prevAmount}
      end={amount}
      decimals={getMinPrecision(amount, { additionalDigits: getPrecision(amount) || 2 })}
      {...countUpProps}
    />
  )
}

ClaimableAmountCountUp.defaultProps = {
  amount: 0,
}

const ClaimButton = (props) => {
  const { name, refetch, claimable } = props
  const { tokenFaucetAddress } = props
  const { t } = useTranslation()
  const { usersAddress } = useContext(AuthControllerContext)
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const [refetching, setRefetching] = useState(false)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txCompleted = tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [usersAddress]

    const id = await sendTx(
      t('claimPoolFromPool', { poolName: name }),
      TokenFaucetAbi,
      tokenFaucetAddress,
      'claim',
      params,
      refetch
    )
    setTxId(id)
  }

  let text = t('claim')
  if (txPending && !txCompleted) {
    if (tx.sent) {
      text = t('confirming')
    } else {
      text = t('claiming')
    }
  }

  return (
    <Button
      textSize='xxxs'
      padding='px-4 py-1'
      disabled={txPending || !claimable}
      className='w-full'
      onClick={handleClaim}
    >
      {txPending && (
        <span className='mr-2'>
          <ClipLoader size={14} color={'#049c9c'} />
        </span>
      )}
      {text}
    </Button>
  )
}

const RewardTimeLeft = (props) => {
  const { t } = useTranslation()
  const { initialSecondsLeft } = props

  const { days, hours, minutes, secondsLeft } = useTimeCountdown(initialSecondsLeft, 60000)

  const textColor = determineColor(secondsLeft)

  return (
    <div className='flex flex-col xs:flex-row xs:items-center text-accent-1 sm:mt-4'>
      <span className='inline-block'>{t('endsIn')}</span>

      <div className='inline-flex items-center'>
        <FeatherIcon
          className={classnames(`h-4 w-4 stroke-current stroke-2 my-auto xs:ml-2 mr-1`, textColor)}
          icon='clock'
        />{' '}
        <span className={classnames(textColor)}>
          {!days ? null : `${days}d, `}
          {!hours && !days ? null : `${hours}h, `}
          {`${minutes}m`}
        </span>
      </div>
    </div>
  )
}

const determineColor = (secondsLeft) => {
  if (secondsLeft <= SECONDS_PER_HOUR) {
    return 'text-red'
  } else if (secondsLeft <= SECONDS_PER_DAY) {
    return 'text-orange'
  }

  return ''
}
