import { SECONDS_PER_DAY } from '@pooltogether/current-pool-data'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts_3_3/abis/TokenFaucet'
import classnames from 'classnames'
import { ThemedClipSpinner, TokenIcon, Tooltip } from '@pooltogether/react-components'
import {
  getMinPrecision,
  getNetworkNiceNameByChainId,
  getPrecision,
  numberWithCommas
} from '@pooltogether/utilities'
import { useAtom } from 'jotai'
import { isSelfAtom } from 'lib/components/AccountUI'
import {
  FIRST_POLYGON_USDT_FAUCET_ADDRESS,
  FIRST_SUSHI_FAUCET_ADDRESS,
  SECOND_POLYGON_USDT_FAUCET_ADDRESS
} from 'lib/constants/tokenFaucets'
import { useClaimableTokenFromTokenFaucet } from 'lib/hooks/useClaimableTokenFromTokenFaucet'
import { useTokenFaucetApr } from 'lib/hooks/useTokenFaucetApr'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import Link from 'next/link'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreviousValue } from 'beautiful-react-hooks'
import CountUp from 'react-countup'
import { useOnboard } from '@pooltogether/hooks'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'

export const TokenFaucetTableHeader = () => {
  const { t } = useTranslation()

  return (
    <div className='hidden sm:flex bg-card-selected justify-between rounded-lg px-4 sm:px-8 py-2 mt-5 text-xxs text-accent-1'>
      <div className={'w-full'}>Pool</div>
      <div className={'w-full'}>
        {t('asset')} &amp; {t('rate')}
      </div>
      <div className='w-full'>APR</div>
      <div className='w-full'>{t('earning')}</div>
      <div className='w-full text-right'>{t('rewards')}</div>
    </div>
  )
}

const TokenFaucetListItem = (props) => {
  const {
    chainId,
    usersAddress,
    refetchData,
    tokenFaucet,
    isClaimableAmountFetched,
    claimableAmount,
    claimableAmountUnformatted,
    claim
  } = props

  const [isSelf] = useAtom(isSelfAtom)
  const { t } = useTranslation()
  const { data: playerTickets } = useUserTicketsFormattedByPool(usersAddress)

  const tokenFaucetAddress = tokenFaucet?.address

  const apr = useTokenFaucetApr(tokenFaucet)

  if (!tokenFaucet?.dripToken) {
    return null
  }

  const dripRatePerSecond = tokenFaucet?.dripRatePerSecond || 0
  const dripToken = tokenFaucet?.dripToken

  const underlyingToken = pool.tokens.underlyingToken
  const name = t('prizePoolTicker', { ticker: underlyingToken.symbol })

  const poolTicketData = playerTickets?.find((t) => t.poolAddress === pool.prizePool.address)
  const ticketData = poolTicketData?.ticket

  const ticketTotalSupply = pool.tokens.ticket.totalSupply
  const totalSupplyOfTickets = parseInt(ticketTotalSupply, 10)
  const usersBalance = ticketData?.amount || 0

  const ownershipPercentage = usersBalance / totalSupplyOfTickets

  const isFirstSushiFaucet = tokenFaucet.address === FIRST_SUSHI_FAUCET_ADDRESS
  const isFirstPolygonUsdtFaucet = tokenFaucet.address === FIRST_POLYGON_USDT_FAUCET_ADDRESS
  let totalDripPerDay = dripRatePerSecond * SECONDS_PER_DAY
  if (isFirstSushiFaucet || isFirstPolygonUsdtFaucet) {
    totalDripPerDay = 0
  }

  const isSecondPolygonUsdtFaucet = tokenFaucet.address === SECOND_POLYGON_USDT_FAUCET_ADDRESS
  if (isSecondPolygonUsdtFaucet) {
    return null
  }

  const usersDripPerDay = totalDripPerDay * ownershipPercentage
  const usersDripPerDayFormatted = numberWithCommas(usersDripPerDay)
  const totalDripPerDayFormatted = numberWithCommas(Math.round(totalDripPerDay))

  const isClaimable = !claimableAmountUnformatted?.isZero()

  return (
    <div
      className='border-2 rounded-lg px-5 sm:px-7 py-6 flex flex-col sm:flex-row sm:justify-between mt-1 sm:items-center'
      style={{
        borderColor: '#43286e'
      }}
    >
      <div className={'w-full py-1 sm:py-0'}>
        <div className=''>
          <TokenIcon
            address={pool.tokens.underlyingToken.address}
            chainId={pool.chainId}
            className='mx-auto'
            sizeClassName='w-6 h-6'
          />
          <Link href={`/pools/${pool.networkName}/${pool.symbol}`}>
            <a className='capitalize ml-2 mt-2 mx-auto text-xs font-bold text-inverse-purple'>
              {underlyingToken.symbol.toUpperCase()} POOL
            </a>
          </Link>
        </div>
      </div>

      <div className={'w-full py-1 sm:py-0'}>
        <div className='flex  justify-between sm:justify-start'>
          <div className='text-accent-1 text-xs mb-1 sm:mt-1'>
            {totalDripPerDayFormatted}{' '}
            <TokenIcon
              address={dripToken.address}
              chainId={pool.chainId}
              className='mx-1'
              sizeClassName='w-3 h-3'
            />
            {dripToken.symbol} / <span className='lowercase'>{t('day')}</span>
            <br />
          </div>
        </div>
      </div>

      <div className='w-full pt-5 sm:py-0'>
        <div className='mt-3 sm:mt-0 leading-snug'>
          {!apr || apr === 0 ? (
            <></>
          ) : (
            <>
              <span className='font-bold'>{apr.toString().split('.')?.[0]}</span>.
              {apr.toString().split('.')?.[1]?.substr(0, 2)}%{' '}
            </>
          )}
          <span className='sm:hidden text-xxs text-accent-1 mt-1 sm:mt-2'>APR</span>
        </div>
      </div>

      <div className='w-full py-1 sm:py-0 text-right'>
        <div className='text-accent-1 text-xs flex items-center mt-1 sm:mt-0 mb-2 sm:mb-0 opacity-80 trans hover:opacity-100'>
          {usersDripPerDayFormatted}{' '}
          <TokenIcon
            address={dripToken.address}
            chainId={chainId}
            className='mx-2'
            sizeClassName='w-4 h-4'
          />
          {dripToken.symbol} /&nbsp;
          <span className='lowercase'>{t('day')}</span>
        </div>
      </div>
      <div className='w-full py-1 sm:py-0 sm:text-right'>
        <div
          className={classnames(`mt-6 sm:mt-0`, {
            'opacity-40': !isClaimable
          })}
        >
          <p className='font-inter text-inverse text-xxs uppercase'>{t('availableToClaim')}</p>
          <h5 className={classnames('flex items-center sm:justify-end mt-1')}>
            {!isClaimableAmountFetched ? (
              <ThemedClipSpinner size={12} />
            ) : (
              <ClaimableAmountCountUp amount={Number(claimableAmount)} />
            )}
            <TokenIcon
              address={dripToken.address}
              chainId={chainId}
              className='ml-2'
              sizeClassName='w-6 h-6'
            />
          </h5>

          {isSelf && (
            <div className='sm:ml-auto'>
              <ClaimButton
                {...props}
                refetch={() => {
                  refetchData()
                }}
                chainId={chainId}
                name={name}
                dripToken={dripToken.symbol}
                tokenFaucetAddress={tokenFaucetAddress}
                isClaimable={isClaimable}
                claim={claim}
              />
            </div>
          )}
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
      separator=','
      {...countUpProps}
    />
  )
}

ClaimableAmountCountUp.defaultProps = {
  amount: 0
}

const ClaimButton = (props) => {
  const { address, dripToken, name, refetch, isClaimable, tokenFaucetAddress, chainId, claim } =
    props

  const { network: walletChainId } = useOnboard()

  const { t } = useTranslation()
  const [txId, setTxId] = useState(0)
  // TODO: Make pool & pod version to pass down
  // const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txCompleted = tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    if (txPending) {
      return
    }

    const params = [address]

    const id = claim()
    // const id = await sendTx(
    //   t('claimTickerFromPool', { ticker: dripToken, poolName: name }),
    //   TokenFaucetAbi,
    //   tokenFaucetAddress,
    //   'claim',
    //   params,
    //   refetch
    // )
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

  return (
    <Tooltip
      isEnabled={walletOnWrongNetwork}
      id={`account-gov-claims-wrong-network-tooltip`}
      className='ml-auto'
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(chainId)
      })}
    >
      <button
        disabled={!isClaimable || walletOnWrongNetwork}
        className={classnames('underline trans trans-fast', {
          'text-flashy': txPending,
          'text-accent-1 hover:text-green': !txPending
        })}
        onClick={handleClaim}
        style={{
          opacity: 1
        }}
      >
        {txPending && (
          <span className='mr-2'>
            <ThemedClipSpinner size={12} />
          </span>
        )}
        {text}
      </button>
    </Tooltip>
  )
}
