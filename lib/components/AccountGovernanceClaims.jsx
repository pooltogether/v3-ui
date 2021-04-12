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

import { CUSTOM_CONTRACT_ADDRESSES, DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { isSelfAtom } from 'lib/components/AccountUI'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AddTokenToMetaMaskButton } from 'lib/components/AddTokenToMetaMaskButton'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { ThemedClipLoader } from 'lib/components/loaders/ThemedClipLoader'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useClaimablePoolFromTokenFaucet } from 'lib/hooks/useClaimablePoolFromTokenFaucet'
import { useClaimablePoolFromTokenFaucets } from 'lib/hooks/useClaimablePoolFromTokenFaucets'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTransaction } from 'lib/hooks/useTransaction'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { getMinPrecision, getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'

import PoolIcon from 'assets/images/pool-icon.svg'
import { useGovernancePools, usePoolBySymbol } from 'lib/hooks/usePools'

export const AccountGovernanceClaims = (props) => {
  const { t } = useTranslation()

  const { data: pools } = useGovernancePools()
  const { chainId, usersAddress } = useContext(AuthControllerContext)
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
    return (
      <div className='my-16'>
        <IndexUILoader />
      </div>
    )
  }

  // const earningsStarted = Date.now() / 1000 > 1613606400

  return (
    <>
      <h5 id='governance-claims' className='font-normal text-accent-2 mt-16 mb-4'>
        {t('governance')}
      </h5>
      <div className='relative xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
        <ClaimHeader address={address} refetchAllPoolTokenData={refetchAllPoolTokenData} />
        {pools.sort(sortByDripAmount).map((pool) => {
          return (
            <ClaimablePoolTokenItem
              address={address}
              refetchAllPoolTokenData={refetchAllPoolTokenData}
              key={pool.prizePool.address}
              pool={pool}
            />
          )
        })}

        <div className='mt-7 text-center'>
          <AddTokenToMetaMaskButton
            basic
            showPoolIcon
            textSize='xxs'
            tokenAddress={CUSTOM_CONTRACT_ADDRESSES[chainId]?.GovernanceToken}
            tokenSymbol='POOL'
          />
        </div>
      </div>
    </>
  )
}

const sortByDripAmount = (a, b) =>
  b.tokens.tokenFaucetDripToken.amountUnformatted.sub(
    a.tokens.tokenFaucetDripToken.amountUnformatted
  )

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
      CUSTOM_CONTRACT_ADDRESSES[chainId].TokenFaucetProxyFactory,
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
  const { address, pool, refetchAllPoolTokenData } = props

  const { t } = useTranslation()
  const { data: accountData } = useAccountQuery(address, pool.version)
  const { playerTickets } = usePlayerTickets(accountData)

  const tokenFaucetAddress = pool.tokenListener.address
  const { data: claimablePoolData } = useClaimablePoolFromTokenFaucet(tokenFaucetAddress, address)
  const dripRatePerSecond = claimablePoolData?.dripRatePerSecond || ethers.constants.Zero

  const dripToken = pool.tokens.tokenFaucetDripToken
  const underlyingToken = pool.tokens.underlyingToken
  const name = t('prizePoolTicker', { ticker: dripToken.symbol })

  const ticketData = playerTickets?.find((t) => t.poolAddress === pool.prizePool.address)

  const ticketTotalSupply = pool.tokens.ticket.totalSupply
  const totalSupplyOfTickets = parseInt(ticketTotalSupply, 10)
  const usersBalance = Number(
    ethers.utils.formatUnits(ticketData?.balance || 0, underlyingToken.decimals)
  )

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

  const apr = pool.tokenListener?.apr

  if (pool.symbol === 'PT-cUNI') {
    console.log(totalSupplyOfTickets, pool, playerTickets)
  }

  const [isSelf] = useAtom(isSelfAtom)

  return (
    <div className='bg-body p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between mt-4 sm:mt-8 sm:items-center'>
      <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start'>
        <PoolCurrencyIcon
          lg
          symbol={underlyingToken.symbol}
          address={underlyingToken.address}
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
            {displayPercentage(apr)}% APR
          </div>
        </div>
      </div>

      <div className='sm:text-right mt-6 sm:mt-0'>
        <p className='text-inverse font-bold'>{t('availableToClaim')}</p>
        <h4
          className={classnames('flex items-center sm:justify-end mt-1 sm:mt-0', {
            'opacity-80': claimablePoolData?.amountBN.isZero()
          })}
        >
          <img src={PoolIcon} className='inline-block w-6 h-6 mr-2' />{' '}
          <ClaimableAmountCountUp amount={claimablePoolData?.amount} />
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
                refetchAllPoolTokenData()
              }}
              name={name}
              tokenFaucetAddress={tokenFaucetAddress}
              claimable={!claimablePoolData?.amountBN.isZero()}
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
