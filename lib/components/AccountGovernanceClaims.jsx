import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'i18n/client'
import { Button } from 'lib/components/Button'
import FeatherIcon from 'feather-icons-react'
import ComptrollerV2Abi from "@pooltogether/pooltogether-contracts/abis/ComptrollerV2"
import ComptrollerV2ProxyFactoryAbi from "@pooltogether/pooltogether-contracts/abis/ComptrollerV2ProxyFactory"

import { CONTRACT_ADDRESSES, SECONDS_PER_DAY, SECONDS_PER_HOUR, SECONDS_PER_WEEK } from 'lib/constants'
import { useTimeCountdown } from 'lib/hooks/useTimeCountdown'
import { useClaimablePool } from 'lib/hooks/useClaimablePool'
import { usePools } from 'lib/hooks/usePools'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useAtom } from 'jotai'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { useClaimablePoolComptrollerAddresses } from 'lib/hooks/useClaimablePoolComptrollerAddresses'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTotalClaimablePool } from 'lib/hooks/useTotalClaimablePool'
import { ethers } from 'ethers'
import { useAccount } from 'lib/hooks/useAccount'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { usePool } from 'lib/hooks/usePool'


export const AccountGovernanceClaims = (props) => {
  const { pools } = usePools()

  const { data: totalClaimablePool, isFetched, isFetching, refetch: refetchTotalClaimablePool } = useTotalClaimablePool()
  const { usersAddress } = useContext(AuthControllerContext)

  if (!isFetched || (isFetching && !isFetched)) {
    // TODO: Nicer empty state
    return null
  }

  if (!usersAddress) {
    return null
  }
  
  return <>
    <h6
      className='font-normal text-accent-2 mt-16 mb-4'
    >
      Governance
    </h6>
    <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
      <ClaimHeader />
      {pools.map(pool => <ClaimablePoolPoolItem 
        refetchTotalClaimablePool={refetchTotalClaimablePool}
        key={pool.id}
        pool={pool}
      /> )}
    </div>
  </>
}

const ClaimHeader = props => {
  const { t } = useTranslation()
  // TODO: get a link for "What can I Do with POOL"

  const { data: totalClaimablePool, refetch } = useTotalClaimablePool()

  const totalClaimablePoolFormatted = numberWithCommas(totalClaimablePool, { precision: getPrecision(totalClaimablePool) })

  return <div className='flex justify-between flex-col sm:flex-row mb-8  p-2 sm:p-0'>
    <div className='flex sm:flex-col justify-between sm:justify-start mb-4 sm:mb-0'>
      <h4 className='font-normal mb-auto sm:mb-0'>Claimable POOL</h4>
      <h2 className={classnames(
        'leading-none text-2xl sm:text-3xl', {
          'text-flashy': totalClaimablePool > 0
        })}
      >{totalClaimablePoolFormatted}</h2>
    </div>
    <div className='flex flex-col-reverse sm:flex-col'>
      <ClaimAllButton
        amt={totalClaimablePoolFormatted}
        refetch={refetch}
        claimable={totalClaimablePool > 0}
      />
      <span className='sm:text-right text-accent-1 text-xxs mb-8' >What can I do with POOL?</span>
    </div>
  </div>
}

const ClaimAllButton = props => {
  const { t } = useTranslation()
  const { claimable, refetch, amt } = props

  const { usersAddress, provider, chainId } = useContext(AuthControllerContext)
  const { isFetched, data: comptrollerAddresses } = useClaimablePoolComptrollerAddresses()

  const [txId, setTxId] = useState({})
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const [sendTx] = useSendTransaction('Claim All', transactions, setTransactions)
  const txInFlight = transactions?.find((tx) => tx.id === txId)

  const [refetching, setRefetching] = useState(false)

  const txPending = (txInFlight?.sent || txInFlight?.inWallet) && !txInFlight?.completed
  const txCompleted = txInFlight?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress,
      comptrollerAddresses,
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      ComptrollerV2ProxyFactoryAbi,
      CONTRACT_ADDRESSES[chainId].ComptrollerProxyFactory,
      'claimAll',
      params,
    )
    setTxId(id)
  }

  let text = 'Claim All'
  if (txPending || refetching) {
    if (txInFlight.sent) {
      text = 'Confirming...'
    } else {
      text = 'Claiming...'
    }
  }

  useEffect(() => {
    const refreshData = async () => {
      setRefetching(true)
      await refetch()
      setRefetching(false)
    }

    if (txCompleted) {
      refreshData()
    }
  }, [txCompleted])


  return <Button
    type='button'
    onClick={handleClaim}
    className='mb-4'
    disabled={!isFetched || !claimable || txPending}

    border='green'
    text='primary'
    bg='green'

    hoverBorder='green'
    hoverText='primary'
    hoverBg='green'

    textSize='sm'
  >
    {text}
  </Button>
}

const ClaimablePoolPoolItem = props => {
  const { pool, refetchTotalClaimablePool } = props
  const { usersAddress } = useContext(AuthControllerContext)
  const { accountData } = useAccount(usersAddress)
  const { playerTickets } = usePlayerTickets(accountData)
  const { name, symbol } = pool
  const { pool: poolChainData } = usePool(symbol)
  const comptrollerAddress = poolChainData.tokenListener

  const {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  } = useClaimablePool(symbol)

  if (!isFetched || (isFetching && !isFetched)) {
    return null
  }

  const {
    dripRatePerSecond,
    exchangeRateMantissa,
    lastDripTimestamp,
    measureTokenAddress,
    totalSupply,
    amountClaimable,
    user
  } = data

  // TODO: Does this get updated when a user buys more tickets?
  
  const ticketData = playerTickets.find(ticket => ticket.pool.ticket.id === measureTokenAddress)
  if (!ticketData) {
    return null
  }

  const decimals = ticketData.pool.underlyingCollateralDecimals
  const totalSupplyOfTickets = Number(ethers.utils.formatUnits(ethers.utils.bigNumberify(ticketData.pool.ticketSupply), decimals))
  const usersBalance = Number(ethers.utils.formatUnits(ticketData.balance, decimals))
  
  const ownershipPercentage = usersBalance / totalSupplyOfTickets
  const dripRatePerSecondNumber = Number(ethers.utils.formatUnits(dripRatePerSecond, decimals))

  const totalDripPerDay = dripRatePerSecondNumber * 60 * 60 * 24
  const usersDripPerDay = totalDripPerDay * ownershipPercentage
  const usersDripPerDayFormatted = numberWithCommas(usersDripPerDay, { precision: getPrecision(usersDripPerDay) })
  const totalDripPerDayFormatted = numberWithCommas(totalDripPerDay, { precision: getPrecision(totalDripPerDay) })

  const secondsLeft = totalSupply.div(dripRatePerSecond).toNumber()

  const claimablePoolNumber = Number(ethers.utils.formatUnits(amountClaimable, 18))
  const claimablePoolFormatted = numberWithCommas(claimablePoolNumber, { precision: getPrecision(claimablePoolNumber) })

  return <div className='bg-body p-6 rounded flex flex-col sm:flex-row sm:justify-between mb-4 sm:mb-8 last:mb-0'>
    <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start mb-2'>
      <PoolCurrencyIcon
        pool={getUnderlyingCollateralSymbol(symbol)}
        className='h-16 w-16 sm:h-16 sm:w-16 sm:mr-4'
      />
      <div>
        <h2 className='leading-none'>{name}</h2>
        <div className='text-accent-1 text-xs mt-1' >{totalDripPerDayFormatted} POOL / day</div>
        <RewardTimeLeft initialSecondsLeft={secondsLeft} />
      </div>
    </div>

    <div className='sm:text-right'>
      <h2 className='leading-none'>{claimablePoolFormatted} POOL</h2>
      <div className='text-accent-1 text-xs mb-4' >@ {usersDripPerDayFormatted} POOL / day</div>
      <ClaimButton
        refetch={() => {
          refetch()
          refetchTotalClaimablePool()
        }}
        name={name}
        comptrollerAddress={comptrollerAddress}
        claimable={claimablePoolNumber > 0}
      />
    </div>
  </div>
}

const ClaimButton = props => {
  const { name, refetch, claimable } = props
  const { comptrollerAddress } = props
  const { t } = useTranslation()
  const { usersAddress, provider, chainId } = useContext(AuthControllerContext)
  const [txId, setTxId] = useState({})
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const [sendTx] = useSendTransaction(`Claim POOL from ${name}`, transactions, setTransactions)
  const txInFlight = transactions?.find((tx) => tx.id === txId)

  const [refetching, setRefetching] = useState(false)

  const txPending = (txInFlight?.sent || txInFlight?.inWallet) && !txInFlight?.completed
  const txCompleted = txInFlight?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      ComptrollerV2Abi,
      comptrollerAddress,
      'claim',
      params,
    )
    setTxId(id)
  }

  let text = 'Claim'
  if (txPending || refetching) {
    if (txInFlight.sent) {
      text = 'Confirming...'
    } else {
      text = 'Claiming...'
    }
  }

  useEffect(() => {
    const refreshData = async () => {
      setRefetching(true)
      await refetch()
      setRefetching(false)
    }

    if (txCompleted) {
      refreshData()
    }
  }, [txCompleted])

// TODO: Transaction states
// TODO: Refetch claimable amounts on success
  return <Button disabled={txPending || refetching || !claimable} className='w-full' onClick={handleClaim}>{text}</Button>
}

const RewardTimeLeft = props => {
  const { initialSecondsLeft } = props

  const { days, hours, minutes, secondsLeft } = useTimeCountdown(initialSecondsLeft, 60000)

  const textColor = determineColor(secondsLeft)
  
  return <div className='flex text-accent-1 sm:mt-4'>
    Ends in
    <FeatherIcon className={classnames(`h-4 w-4 stroke-current stroke-2 my-auto ml-2 mr-1`, textColor)} icon='clock' />{' '}
    <span className={classnames(textColor)}>
      {!days ? null : `${days}d, `}
      {!hours && !days ? null :  `${hours}h, `}
      {`${minutes}m`}
    </span>
  </div>
}

const determineColor = (secondsLeft) => {
  // 1 day
  if (secondsLeft <= SECONDS_PER_HOUR) {
    return 'text-red'
  } else if (secondsLeft <= SECONDS_PER_DAY) {
    return 'text-orange'
  }

  return ''
}

const getUnderlyingCollateralSymbol = (ticketSymbol) => {
  switch (ticketSymbol) {
    case 'PT-cDAI': {
      return { underlyingCollateralSymbol: 'dai' }
    }
    case 'PT-cBAT': {
      return { underlyingCollateralSymbol: 'bat' }
    }
    case 'PT-cUNI': {
      return { underlyingCollateralSymbol: 'uni' }
    }
    case 'PT-cUSDC': {
      return { underlyingCollateralSymbol: 'usdc' }
    }
  }
}
