import React, { useContext, useState } from 'react'
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
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useAtom } from 'jotai'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { useClaimablePoolComptrollerAddresses } from 'lib/hooks/useClaimablePoolComptrollerAddresses'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useTotalClaimablePool } from 'lib/hooks/useTotalClaimablePool'


export const AccountGovernanceClaims = (props) => {
  const { t } = useTranslation()
  
  const { pools } = usePools()

  const { data: totalClaimablePool, isFetched, isFetching } = useTotalClaimablePool()

  if (!isFetched || (isFetching && !isFetched) || (isFetched && totalClaimablePool === 0)) {
    // TODO: Nicer empty state
    return null
  }
  
  // TODO: Only show if a user has anything deposited in pools

  return <>
    <h6
      className='font-normal text-accent-2 mt-16 mb-4'
    >
      Governance
    </h6>
    <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
      <ClaimHeader />
      {pools.map(pool => <ClaimablePoolPoolItem key={pool.id} pool={pool} /> )}
    </div>
  </>
}

const ClaimHeader = props => {
  const { t } = useTranslation()
  // TODO: disable if there isn't any to claim
  // TODO: Claim All Functionality
  // TODO: Fetch claim amount

  const { data: totalClaimablePool } = useTotalClaimablePool()

  return <div className='flex justify-between flex-col sm:flex-row mb-8  p-2 sm:p-0'>
    <div className='flex sm:flex-col justify-between sm:justify-start mb-4 sm:mb-0'>
      <h4 className='font-normal mb-auto sm:mb-0'>Claimable POOL</h4>
      <h2 className='leading-none'>{numberWithCommas(totalClaimablePool)}</h2>
    </div>
    <div className='flex flex-col-reverse sm:flex-col'>
      <ClaimAllButton />
      <span className='text-accent-1 text-xxs mb-8' >What can I do with POOL?</span>
    </div>
  </div>
}

const ClaimAllButton = props => {
  const { t } = useTranslation()

  const { usersAddress, provider, chainId } = useContext(AuthControllerContext)
  const { isFetched, data: comptrollerAddresses } = useClaimablePoolComptrollerAddresses()
  console.log(comptrollerAddresses)

  const [txId, setTxId] = useState({})
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const [sendTx] = useSendTransaction('Claim All POOL', transactions, setTransactions)
  const txInFlight = transactions?.find((tx) => tx.id === txId)

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [
      usersAddress,
      comptrollerAddresses.data,
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

  // TODO: Transaction states

  const disabled = !isFetched

  return <Button
    // TODO: Disabled if no balance to claim

    type='button'
    onClick={handleClaim}
    className='mb-4'
    disabled={disabled}

    border='green'
    text='primary'
    bg='green'

    hoverBorder='green'
    hoverText='primary'
    hoverBg='green'

    textSize='sm'
  >
    Claim All
  </Button>
}

const ClaimablePoolPoolItem = props => {
  const { pool } = props
  const { name, symbol, tokenListener: comptrollerAddress } = pool

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
    measure,
    totalUnclaimed,
    user
  } = data

  const givingAwayPerDay = 15000
  const earningPerDay = 15
  const poolToClaim = numberWithCommas(user.balance.toString())

  return <div className='bg-body p-6 rounded flex flex-col sm:flex-row sm:justify-between mb-4 sm:mb-8 last:mb-0'>
    <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start mb-2'>
      <PoolCurrencyIcon
        pool={getUnderlyingCollateralSymbol(symbol)}
        className='h-16 w-16 sm:h-16 sm:w-16 sm:mr-4'
      />
      <div>
        <h2 className='leading-none'>{name}</h2>
        <div className='text-accent-1 text-xs mt-1' >{givingAwayPerDay} POOL / day</div>
        <RewardTimeLeft initialSecondsLeft={5000} />
      </div>
    </div>

    <div className='sm:text-right'>
      <h2 className='leading-none'>{poolToClaim} POOL</h2>
      <div className='text-accent-1 text-xs mb-4' >@ {earningPerDay} POOL / day</div>
      <ClaimButton comptrollerAddress={comptrollerAddress} />
    </div>
  </div>
}

const ClaimButton = props => {
  const { comptrollerAddress } = props
  const { t } = useTranslation()
  const { usersAddress, provider, chainId } = useContext(AuthControllerContext)
  const [txId, setTxId] = useState({})
  const [transactions, setTransactions] = useAtom(transactionsAtom)
  const [sendTx] = useSendTransaction(`Claim POOL from ${name}`, transactions, setTransactions)
  const txInFlight = transactions?.find((tx) => tx.id === txId)

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

// TODO: Transaction states
// TODO: Refetch claimable amounts on success
  return <Button className='w-full' onClick={handleClaim}>Claim</Button>
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
