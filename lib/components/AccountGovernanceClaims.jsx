import React, { useContext, useMemo, useState } from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { usePreviousValue } from 'beautiful-react-hooks'

import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import TokenFaucetProxyFactoryAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucetProxyFactory'

import { CUSTOM_CONTRACT_ADDRESSES, DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import { isSelfAtom } from 'lib/components/AccountUI'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AddTokenToMetaMaskButton } from 'lib/components/AddTokenToMetaMaskButton'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { ThemedClipLoader } from 'lib/components/loaders/ThemedClipLoader'
import { Tooltip } from 'lib/components/Tooltip'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useClaimableTokenFromTokenFaucet } from 'lib/hooks/useClaimableTokenFromTokenFaucet'
import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTransaction } from 'lib/hooks/useTransaction'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { getMinPrecision, getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { useGovernancePools } from 'lib/hooks/usePools'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { useWalletChainId } from 'lib/hooks/chainId/useWalletChainId'
import { Erc20Image } from 'lib/components/Erc20Image'

import PoolIcon from 'assets/images/pool-icon.svg'

export const AccountGovernanceClaims = (props) => {
  const { t } = useTranslation()

  const { data: pools, isFetched: poolIsFetched } = useGovernancePools()
  const { usersAddress } = useContext(AuthControllerContext)
  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress
  const { refetch: refetchTotalClaimablePool } = useClaimableTokenFromTokenFaucets(address)
  const { refetch: refetchPoolTokenData } = usePoolTokenData(address)
  const poolTokenChainId = usePoolTokenChainId()
  const walletChainId = useWalletChainId()

  const refetchAllPoolTokenData = () => {
    refetchTotalClaimablePool()
    refetchPoolTokenData()
  }

  if (!address || !poolIsFetched) {
    return (
      <div className='my-16'>
        <IndexUILoader />
      </div>
    )
  }

  return (
    <>
      <h5 id='governance-claims' className='font-normal text-accent-2 mt-16 mb-4'>
        {t('rewards')}
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

        {walletChainId === poolTokenChainId && (
          <div className='mt-7 text-center'>
            <AddTokenToMetaMaskButton
              basic
              showPoolIcon
              textSize='xxs'
              tokenAddress={CUSTOM_CONTRACT_ADDRESSES[poolTokenChainId]?.GovernanceToken}
              tokenDecimals={DEFAULT_TOKEN_PRECISION}
              tokenSymbol='POOL'
            />
          </div>
        )}
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

  const poolTokenChainId = usePoolTokenChainId()
  const poolTokenAddress = CUSTOM_CONTRACT_ADDRESSES[poolTokenChainId].GovernanceToken.toLowerCase()

  const { data: claimableFromTokenFaucets } = useClaimableTokenFromTokenFaucets(address)
  const totalClaimablePool =
    Number(claimableFromTokenFaucets?.totals?.[poolTokenAddress]?.totalClaimableAmount) || 0

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

/**
 * Claims from all POOL token faucets
 * @param {*} props
 * @returns
 */
const ClaimAllButton = (props) => {
  const { t } = useTranslation()
  const { address, claimable, refetchAllPoolTokenData } = props

  const walletChainId = useWalletChainId()
  const poolTokenChainId = usePoolTokenChainId()

  const {
    isFetched: isClaimablePoolDataFetched,
    data: claimablePoolFromTokenFaucets
  } = useClaimableTokenFromTokenFaucets(address)

  const tokenFaucetAddresses = useMemo(() => {
    if (claimablePoolFromTokenFaucets) {
      const addresses = []
      Object.keys(claimablePoolFromTokenFaucets).forEach((key) => {
        if (key === 'totals') return

        const claimablePoolData = claimablePoolFromTokenFaucets[key]
        if (!claimablePoolData?.claimableAmountUnformatted.isZero()) {
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
      CUSTOM_CONTRACT_ADDRESSES[poolTokenChainId].TokenFaucetProxyFactory,
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

  const walletOnWrongNetwork = walletChainId !== poolTokenChainId

  const button = (
    <Button
      type='button'
      onClick={handleClaim}
      className='mb-4'
      disabled={!isClaimablePoolDataFetched || !claimable || txPending || walletOnWrongNetwork}
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

  return walletOnWrongNetwork ? (
    <Tooltip
      className='ml-auto'
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(poolTokenChainId)
      })}
    >
      {button}
    </Tooltip>
  ) : (
    button
  )
}

const ClaimablePoolTokenItem = (props) => {
  const { address, pool, refetchAllPoolTokenData } = props

  const [isSelf] = useAtom(isSelfAtom)
  const { t } = useTranslation()
  const { data: playerTickets } = useUserTicketsFormattedByPool(address)
  const tokenFaucetAddress = pool.tokenListener.address
  const { data: claimablePoolData, isFetched } = useClaimableTokenFromTokenFaucet(
    tokenFaucetAddress,
    address
  )

  if (!isFetched) return null

  const dripRatePerSecond = pool.tokenListener.dripRatePerSecond || 0
  const dripToken = pool.tokens.tokenFaucetDripToken

  const underlyingToken = pool.tokens.underlyingToken
  const name = t('prizePoolTicker', { ticker: underlyingToken.symbol })

  const poolTicketData = playerTickets?.find((t) => t.poolAddress === pool.prizePool.address)
  const ticketData = poolTicketData?.ticket

  const ticketTotalSupply = pool.tokens.ticket.totalSupply
  const totalSupplyOfTickets = parseInt(ticketTotalSupply, 10)
  const usersBalance = ticketData?.amount || 0

  const ownershipPercentage = usersBalance / totalSupplyOfTickets

  const totalDripPerDay = dripRatePerSecond * SECONDS_PER_DAY
  const usersDripPerDay = totalDripPerDay * ownershipPercentage
  const usersDripPerDayFormatted = numberWithCommas(usersDripPerDay, {
    precision: getPrecision(usersDripPerDay)
  })
  const totalDripPerDayFormatted = numberWithCommas(totalDripPerDay, {
    precision: getPrecision(totalDripPerDay)
  })

  let apr = pool.tokenListener?.apr

  if (!apr) {
    const { dripRatePerSecond } = pool.tokenListener
    const totalDripPerDay = Number(dripRatePerSecond) * SECONDS_PER_DAY
    const totalDripDailyValue = totalDripPerDay * 0.86
    const totalSupply = Number(pool.tokens.ticket.totalSupply)
    apr = (totalDripDailyValue / totalSupply) * 365 * 100
  }

  return (
    <div className='bg-body p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between mt-4 sm:items-center'>
      <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start'>
        <PoolCurrencyIcon
          lg
          symbol={underlyingToken.symbol}
          address={underlyingToken.address}
          className='sm:mr-4'
        />
        <div className='xs:w-64 sm:w-96'>
          <div className='flex items-baseline mb-1'>
            <h5 className='leading-none'>{name}</h5>{' '}
            <NetworkBadge className='ml-2' sizeClasses='h-4 w-4' chainId={pool.chainId} />
          </div>

          <div className='text-accent-1 text-xs mb-1 mt-2 sm:mt-1'>
            {t('poolNamesDripRate', { poolName: name })}
            <br />
            {totalDripPerDayFormatted}{' '}
            <Erc20Image
              address={dripToken.address}
              className='relative inline-block w-3 h-3 mx-1'
            />
            {dripToken.symbol} / <span className='lowercase'>{t('day')}</span>
            <br />
            {displayPercentage(apr)}% APR
          </div>
        </div>
      </div>

      <div className='sm:text-right mt-6 sm:mt-0'>
        <p className='text-inverse font-bold'>{t('availableToClaim')}</p>
        <h4
          className={classnames('flex items-center sm:justify-end', {
            'opacity-80': claimablePoolData?.claimableAmountUnformatted?.isZero()
          })}
        >
          <Erc20Image address={dripToken.address} className='inline-block w-6 h-6 mr-2' />
          <ClaimableAmountCountUp amount={Number(claimablePoolData?.claimableAmount)} />
        </h4>
        <div className='text-accent-1 text-xs flex items-center sm:justify-end mt-1 sm:mt-0 mb-2 opacity-80 trans hover:opacity-100'>
          {usersDripPerDayFormatted}{' '}
          <Erc20Image address={dripToken.address} className='inline-block w-4 h-4 mx-2' />
          {dripToken.symbol} /&nbsp;
          <span className='lowercase'>{t('day')}</span>
        </div>
        {isSelf && (
          <div className='sm:w-40 sm:ml-auto'>
            <ClaimButton
              {...props}
              refetch={() => {
                refetchAllPoolTokenData()
              }}
              chainId={pool.chainId}
              name={name}
              dripToken={pool.tokens.tokenFaucetDripToken.symbol}
              tokenFaucetAddress={tokenFaucetAddress}
              claimable={!claimablePoolData?.claimableAmountUnformatted?.isZero()}
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
      separator=','
      {...countUpProps}
    />
  )
}

ClaimableAmountCountUp.defaultProps = {
  amount: 0
}

const ClaimButton = (props) => {
  const { address, dripToken, name, refetch, claimable, tokenFaucetAddress, chainId } = props

  const walletChainId = useWalletChainId()

  const { t } = useTranslation()
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txCompleted = tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    const params = [address]

    const id = await sendTx(
      t('claimTickerFromPool', { ticker: dripToken, poolName: name }),
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

  const walletOnWrongNetwork = walletChainId !== chainId

  const button = (
    <Button
      textSize='xxxs'
      padding='px-4 py-1'
      disabled={txPending || !claimable || walletOnWrongNetwork}
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

  return walletOnWrongNetwork ? (
    <Tooltip
      className='ml-auto'
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(chainId)
      })}
    >
      {button}
    </Tooltip>
  ) : (
    button
  )
}
