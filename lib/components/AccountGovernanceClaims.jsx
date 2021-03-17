import React, { useContext, useMemo, useState } from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { ethers } from 'ethers'
import { usePreviousValue } from 'beautiful-react-hooks'

import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import TokenFaucetProxyFactoryAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucetProxyFactory'

import { CONTRACT_ADDRESSES, DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { isSelfAtom } from 'lib/components/AccountUI'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { ThemedClipLoader } from 'lib/components/ThemedClipLoader'
import { useAccount } from 'lib/hooks/useAccount'
import { usePools } from 'lib/hooks/usePools'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useClaimablePoolFromTokenFaucet } from 'lib/hooks/useClaimablePoolFromTokenFaucet'
import { useClaimablePoolFromTokenFaucets } from 'lib/hooks/useClaimablePoolFromTokenFaucets'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { usePool } from 'lib/hooks/usePool'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useTokenFaucetAPY } from 'lib/hooks/useTokenFaucetAPY'
import { addTokenToMetaMask } from 'lib/services/addTokenToMetaMask'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { getMinPrecision, getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'

import PoolIcon from 'assets/images/pool-icon.svg'

export const AccountGovernanceClaims = (props) => {
  const { t } = useTranslation()

  const { pools, poolsGraphData } = usePools()

  const { chainId, usersAddress, walletName } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { refetch: refetchTotalClaimablePool } = useClaimablePoolFromTokenFaucets(address)
  const { refetch: refetchPoolTokenData } = usePoolTokenData(address)

  const refetchAllPoolTokenData = () => {
    refetchTotalClaimablePool()
    refetchPoolTokenData()
  }

  if (!address) {
    return null
  }

  // const earningsStarted = Date.now() / 1000 > 1613606400

  const handleAddTokenToMetaMask = (e) => {
    e.preventDefault()

    const tokenAddress = CONTRACT_ADDRESSES[chainId].GovernanceToken
    addTokenToMetaMask('POOL', tokenAddress)
  }

  return (
    <>
      <h5 id='governance-claims' className='font-normal text-accent-2 mt-16 mb-4'>
        {t('governance')}
      </h5>
      <div className='relative xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
        <ClaimHeader address={address} refetchAllPoolTokenData={refetchAllPoolTokenData} />
        {pools.map((pool) => {
          return (
            <ClaimablePoolTokenItem
              address={address}
              refetchAllPoolTokenData={refetchAllPoolTokenData}
              key={pool.id}
              pool={pool}
              poolGraphData={poolsGraphData[pool.symbol]}
            />
          )
        })}

        {walletName === 'MetaMask' && (
          <>
            <div className='mt-7 text-center'>
              <button
                type='button'
                onClick={handleAddTokenToMetaMask}
                className='font-bold mx-auto'
              >
                <img
                  src={PoolIcon}
                  className='relative inline-block w-4 h-4 mx-1'
                  style={{ top: -2 }}
                />
                {t('addTicketTokenToMetamask', {
                  token: 'POOL'
                })}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const ClaimHeader = (props) => {
  const { address } = props

  const { t } = useTranslation()
  const { refetchAllPoolTokenData } = props

  const { data: claimablePoolFromTokenFaucets } = useClaimablePoolFromTokenFaucets(address)
  const totalClaimablePool = claimablePoolFromTokenFaucets?.total

  const [isSelf] = useAtom(isSelfAtom)

  return (
    <div className='flex justify-between flex-col sm:flex-row p-2 sm:p-0'>
      <div className='flex sm:flex-col justify-between sm:justify-start'>
        <h6 className='flex items-center font-normal'>{t('claimablePool')}</h6>
        <h2
          className={classnames('leading-none text-2xl sm:text-3xl mt-0 xs:mt-2', {
            'text-flashy': totalClaimablePool > 0
          })}
        >
          <ClaimableAmountCountUp amount={totalClaimablePool} />
        </h2>
      </div>

      <div className='flex flex-col-reverse sm:flex-col'>
        {isSelf && (
          <ClaimAllButton
            {...props}
            refetchAllPoolTokenData={refetchAllPoolTokenData}
            claimable={totalClaimablePool > 0}
          />
        )}
        <a
          href='https://medium.com/p/23b09f36db48'
          className='sm:text-right text-accent-1 text-xxs mb-3 sm:mb-0'
        >
          {t('whatCanIDoWithPool')}
        </a>
      </div>
    </div>
  )
}

const ClaimAllButton = (props) => {
  const { t } = useTranslation()
  const { address, claimable, refetchAllPoolTokenData } = props

  const { chainId } = useContext(AuthControllerContext)
  const {
    isFetched: isClaimablePoolDataFetched,
    data: claimablePoolFromTokenFaucets
  } = useClaimablePoolFromTokenFaucets(address)

  const tokenFaucetAddresses = useMemo(() => {
    if (claimablePoolFromTokenFaucets) {
      const addresses = []
      Object.keys(claimablePoolFromTokenFaucets).forEach((key) => {
        if (key === 'total') return

        const claimablePoolData = claimablePoolFromTokenFaucets[key]
        if (claimablePoolData.amount) {
          addresses.push(key)
        }
      })

      return addresses
    }
  }, [claimablePoolFromTokenFaucets])

  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [address, tokenFaucetAddresses]

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
      disabled={!isClaimablePoolDataFetched || !claimable || txPending}
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
          <ThemedClipLoader />
        </span>
      )}
      {text}
    </Button>
  )
}

const ClaimablePoolTokenItem = (props) => {
  const { address, pool, poolGraphData, refetchAllPoolTokenData } = props

  const { t } = useTranslation()
  const { accountData } = useAccount(address)
  const { playerTickets } = usePlayerTickets(accountData)

  const { symbol } = pool
  const { pool: poolInfo } = usePool(symbol)
  const tokenFaucetAddress = poolInfo.tokenListener
  const { underlyingCollateralDecimals, underlyingCollateralSymbol } = poolInfo
  const name = t('prizePoolTicker', { ticker: underlyingCollateralSymbol })

  const { refetch: refetchClaimablePool, data } = useClaimablePoolFromTokenFaucet(
    tokenFaucetAddress,
    address
  )

  const { dripRatePerSecond, measureTokenAddress, amount } = data || {}

  const ticketData = playerTickets.find(
    (playerTicket) => playerTicket.pool.ticket.id === measureTokenAddress
  )

  const ticketTotalSupply = poolGraphData?.ticket?.totalSupply || 0
  const totalSupplyOfTickets = Number(
    ethers.utils.formatUnits(
      ethers.BigNumber.from(ticketTotalSupply),
      Number(underlyingCollateralDecimals || 0)
    )
  )
  const usersBalance = ticketData?.balance
    ? Number(
        ethers.utils.formatUnits(ticketData.balance, Number(underlyingCollateralDecimals || 0))
      )
    : 0

  const ownershipPercentage = usersBalance / totalSupplyOfTickets
  const dripRatePerSecondNumber = dripRatePerSecond
    ? Number(ethers.utils.formatUnits(dripRatePerSecond, DEFAULT_TOKEN_PRECISION))
    : 0
  const totalDripPerDay = dripRatePerSecondNumber * SECONDS_PER_DAY
  const usersDripPerDay = totalDripPerDay * ownershipPercentage
  const usersDripPerDayFormatted = numberWithCommas(usersDripPerDay, {
    precision: getPrecision(usersDripPerDay)
  })
  const totalDripPerDayFormatted = numberWithCommas(totalDripPerDay, {
    precision: getPrecision(totalDripPerDay)
  })

  const apy = useTokenFaucetAPY(poolInfo)

  const [isSelf] = useAtom(isSelfAtom)

  return (
    <div className='bg-body p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between mt-4 sm:mt-8 sm:items-center'>
      <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start mb-6 sm:mb-0'>
        <PoolCurrencyIcon
          lg
          pool={{ underlyingCollateralSymbol: poolInfo.underlyingCollateralSymbol }}
          className='sm:mr-4'
        />
        <div className='xs:w-64'>
          <h5 className='leading-none'>{name}</h5>

          <div className='text-accent-1 text-xs mb-1 mt-2 sm:mt-1 opacity-80 trans hover:opacity-100'>
            {t('poolNamesDripRate', { poolName: name })}
            <br />
            {totalDripPerDayFormatted}{' '}
            <img
              src={PoolIcon}
              className='relative inline-block w-4 h-4 mx-1'
              style={{ top: -2 }}
            />{' '}
            POOL / <span className='lowercase'>{t('day')}</span>
            <br />
            {displayPercentage(apy)}% APY
          </div>
        </div>
      </div>

      <div className='sm:text-right'>
        <p className='text-inverse font-bold'>{t('availableToClaim')}</p>
        <h4
          className={classnames('flex items-center sm:justify-end mt-1 sm:mt-0', {
            'opacity-80': amount === 0
          })}
        >
          <img src={PoolIcon} className='inline-block w-6 h-6 mr-2' />{' '}
          <ClaimableAmountCountUp amount={amount} />
        </h4>
        <div className='text-accent-1 text-xs flex items-center sm:justify-end mt-1 sm:mt-0 mb-2 opacity-80 trans hover:opacity-100'>
          {usersDripPerDayFormatted} <img src={PoolIcon} className='inline-block w-4 h-4 mx-2' />{' '}
          POOL /&nbsp;<span className='lowercase'>{t('day')}</span>
        </div>
        {isSelf && (
          <div className='sm:w-40 sm:ml-auto'>
            <ClaimButton
              {...props}
              refetch={() => {
                refetchClaimablePool()
                refetchAllPoolTokenData()
              }}
              name={name}
              tokenFaucetAddress={tokenFaucetAddress}
              claimable={amount > 0}
            />
          </div>
        )}
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
  amount: 0
}

const ClaimButton = (props) => {
  const { address, name, refetch, claimable, tokenFaucetAddress } = props

  const { t } = useTranslation()
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const [refetching, setRefetching] = useState(false)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txCompleted = tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [address]

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
          <ThemedClipLoader />
        </span>
      )}
      {text}
    </Button>
  )
}
