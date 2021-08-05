import React, { useMemo, useState } from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Button, Tooltip } from '@pooltogether/react-components'
import { usePreviousValue } from 'beautiful-react-hooks'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

import TokenFaucetAbi from '@pooltogether/pooltogether-contracts_3_3/abis/TokenFaucet'
import TokenFaucetProxyFactoryAbi from '@pooltogether/pooltogether-contracts_3_3/abis/TokenFaucetProxyFactory'

import { CUSTOM_CONTRACT_ADDRESSES, DEFAULT_TOKEN_PRECISION, SECONDS_PER_DAY } from 'lib/constants'
import {
  FIRST_SUSHI_FAUCET_ADDRESS,
  FIRST_POLYGON_USDT_FAUCET_ADDRESS,
  SECOND_POLYGON_USDT_FAUCET_ADDRESS
} from 'lib/constants/tokenFaucets'
import { isSelfAtom } from 'lib/components/AccountUI'
import { AddTokenToMetaMaskButton } from 'lib/components/AddTokenToMetaMaskButton'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useClaimableTokenFromTokenFaucet } from 'lib/hooks/useClaimableTokenFromTokenFaucet'
import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useTokenFaucetApr } from 'lib/hooks/useTokenFaucetApr'
import { getMinPrecision, getPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { useGovernancePools } from 'lib/hooks/usePools'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { Erc20Image } from 'lib/components/Erc20Image'

export const AccountGovernanceClaims = (props) => {
  const { t } = useTranslation()

  const { data: pools, isFetched: poolIsFetched } = useGovernancePools()
  const usersAddress = useUsersAddress()
  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  // This currently is `refetchTotalClaimablePool`, assuming it's only mainnet but may need to be updated to include
  // refetching Polygon data claimable data (and renamed)
  const { refetch: refetchTotalClaimablePool } = useClaimableTokenFromTokenFaucets(
    NETWORK.mainnet,
    address
  )
  const { refetch: refetchPoolTokenData } = usePoolTokenData(address)
  const poolTokenChainId = usePoolTokenChainId()
  const { network: walletChainId } = useOnboard()

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

  const mainnetPools = pools
    .filter((pool) => pool.chainId === NETWORK.mainnet)
    .filter((pool) => pool.tokenFaucets?.length > 0)
  const polygonPools = pools
    .filter((pool) => pool.chainId === NETWORK.polygon)
    .filter((pool) => pool.tokenFaucets?.length > 0)
  const binancePools = pools
    .filter((pool) => pool.chainId === NETWORK.bsc)
    .filter((pool) => pool.tokenFaucets?.length > 0)

  return (
    <>
      <div
        id='governance-claims'
        className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-sm'
      >
        {t('depositRewards')}
      </div>
      <div className='relative xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-3 py-3 sm:px-10 sm:py-10'>
        <div>
          <ClaimHeader
            chainId={NETWORK.mainnet}
            address={address}
            refetchAllPoolTokenData={refetchAllPoolTokenData}
          />
          {mainnetPools.map((pool) => {
            return (
              <ClaimablePool
                address={address}
                refetchAllPoolTokenData={refetchAllPoolTokenData}
                key={pool.prizePool.address}
                pool={pool}
              />
            )
          })}
        </div>

        {polygonPools.length > 0 && (
          <div className='mt-10'>
            <ClaimHeader
              chainId={NETWORK.polygon}
              address={address}
              refetchAllPoolTokenData={refetchAllPoolTokenData}
            />
            {polygonPools.map((pool) => {
              return (
                <ClaimablePool
                  address={address}
                  refetchAllPoolTokenData={refetchAllPoolTokenData}
                  key={pool.prizePool.address}
                  pool={pool}
                />
              )
            })}
          </div>
        )}

        {binancePools.length > 0 && (
          <div className='mt-10'>
            <ClaimHeader
              chainId={NETWORK.bsc}
              address={address}
              refetchAllPoolTokenData={refetchAllPoolTokenData}
            />
            {binancePools.map((pool) => {
              return (
                <ClaimablePool
                  address={address}
                  refetchAllPoolTokenData={refetchAllPoolTokenData}
                  key={pool.prizePool.address}
                  pool={pool}
                />
              )
            })}
          </div>
        )}
      </div>
      <div className='mt-4 text-center'>
        {walletChainId === poolTokenChainId && (
          <AddTokenToMetaMaskButton
            basic
            showPoolIcon
            textSize='xxs'
            tokenAddress={CUSTOM_CONTRACT_ADDRESSES[poolTokenChainId]?.GovernanceToken}
            tokenDecimals={DEFAULT_TOKEN_PRECISION}
            tokenSymbol='POOL'
          />
        )}
      </div>
    </>
  )
}

const ClaimHeader = (props) => {
  const { address, chainId } = props

  const { t } = useTranslation()
  const { refetchAllPoolTokenData } = props

  const poolTokenChainId = usePoolTokenChainId()
  const poolTokenAddress = CUSTOM_CONTRACT_ADDRESSES[poolTokenChainId].GovernanceToken.toLowerCase()

  // Hard-coded to 1 for mainnet as $POOL is only on mainnet
  const { data: claimableFromTokenFaucets } = useClaimableTokenFromTokenFaucets(
    NETWORK.mainnet,
    address
  )
  const totalClaimablePool =
    Number(claimableFromTokenFaucets?.totals?.[poolTokenAddress]?.totalClaimableAmount) || 0

  const [isSelf] = useAtom(isSelfAtom)

  return (
    <>
      <NetworkBadge
        chainId={chainId}
        textClassName='text-xs sm:text-base'
        sizeClassName='w-4 sm:w-6 h-4 sm:h-6'
        className='m-2 sm:m-0'
      />

      {chainId === NETWORK.mainnet && (
        <div className='flex justify-between flex-col sm:flex-row p-2 sm:p-0'>
          <div className='flex sm:flex-col justify-between sm:justify-start mt-6'>
            <>
              <h6 className='flex items-center font-normal'>{t('claimablePool')}</h6>
              <h2
                className={classnames('leading-none text-2xl sm:text-3xl mt-0 xs:mt-2', {
                  'text-flashy': totalClaimablePool > 0
                })}
              >
                <ClaimableAmountCountUp amount={totalClaimablePool} />
              </h2>
            </>
          </div>

          <div className='flex flex-col-reverse sm:flex-col mt-7'>
            {isSelf && chainId === NETWORK.mainnet && (
              <ClaimAllButton
                {...props}
                chainId={NETWORK.mainnet}
                refetchAllPoolTokenData={refetchAllPoolTokenData}
                claimable={totalClaimablePool > 0}
              />
            )}

            {chainId === NETWORK.mainnet && (
              <a
                href='https://medium.com/p/23b09f36db48'
                className='sm:text-right text-accent-1 text-xxs mb-3 sm:mb-0'
              >
                {t('whatCanIDoWithPool')}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const ClaimablePool = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  const underlyingToken = pool.tokens.underlyingToken
  const name = t('prizePoolTicker', { ticker: underlyingToken.symbol })

  return (
    <>
      <div className='px-2 sm:px-0 pt-4 flex flex-col sm:flex-row sm:justify-between mt-8 sm:items-center'>
        <div className='flex items-center flex-row-reverse sm:flex-row justify-between sm:justify-start'>
          <Link href={`/pools/${pool.networkName}/${pool.symbol}`}>
            <a>
              <PoolCurrencyIcon
                md
                symbol={underlyingToken.symbol}
                address={underlyingToken.address}
                className='sm:mr-4'
              />
            </a>
          </Link>
          <div className='xs:w-64 sm:w-96'>
            <div className='flex items-baseline mb-1'>
              <Link href={`/pools/${pool.networkName}/${pool.symbol}`}>
                <a>
                  <h6 className='leading-none text-inverse'>{name}</h6>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='hidden sm:flex bg-card-selected justify-between rounded-lg px-4 sm:px-8 py-2 mt-5 text-xxs text-accent-1'>
        <div className={'w-1/4'}>
          {t('asset')} &amp; {t('rate')}
        </div>
        <div className='w-1/4'>APR</div>
        <div className='w-1/4'>{t('earning')}</div>
        <div className='w-1/4 text-right'>{t('rewards')}</div>
      </div>

      <div className='flex flex-col'>
        {pool?.tokenFaucets?.map((tokenFaucet) => {
          return (
            <ClaimablePoolTokenFaucetRow
              key={`faucet-${pool.prizePool.address}-${tokenFaucet.address}`}
              tokenFaucet={tokenFaucet}
              {...props}
            />
          )
        })}
      </div>
    </>
  )
}

const ClaimablePoolTokenFaucetRow = (props) => {
  const { address, pool, refetchAllPoolTokenData, tokenFaucet } = props

  const [isSelf] = useAtom(isSelfAtom)
  const { t } = useTranslation()
  const { data: playerTickets } = useUserTicketsFormattedByPool(address)

  const tokenFaucetAddress = tokenFaucet?.address
  const { data: claimableData, isFetched } = useClaimableTokenFromTokenFaucet(
    pool.chainId,
    tokenFaucetAddress,
    address
  )

  const apr = useTokenFaucetApr(tokenFaucet)

  if (!isFetched || !tokenFaucet?.dripToken) {
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

  const isClaimable = !claimableData?.claimableAmountUnformatted?.isZero()

  return (
    <div
      className='border-2 rounded-lg px-5 sm:px-7 py-6 flex flex-col sm:flex-row sm:justify-between mt-1 sm:items-center'
      style={{
        borderColor: '#43286e'
      }}
    >
      <div className={'w-full sm:w-1/4 py-1 sm:py-0'}>
        <div className='flex  justify-between sm:justify-start'>
          <div className='text-accent-1 text-xs mb-1 sm:mt-1'>
            {totalDripPerDayFormatted}{' '}
            <Erc20Image
              address={dripToken.address}
              className='relative inline-block w-3 h-3 mx-1'
            />
            {dripToken.symbol} / <span className='lowercase'>{t('day')}</span>
            <br />
          </div>
        </div>
      </div>

      <div className='w-full sm:w-1/4 pt-5 sm:py-0'>
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

      <div className='w-full sm:w-1/4 py-1 sm:py-0 text-right'>
        <div className='text-accent-1 text-xs flex items-center mt-1 sm:mt-0 mb-2 sm:mb-0 opacity-80 trans hover:opacity-100'>
          {usersDripPerDayFormatted}{' '}
          <Erc20Image address={dripToken.address} className='inline-block w-4 h-4 mx-2' />
          {dripToken.symbol} /&nbsp;
          <span className='lowercase'>{t('day')}</span>
        </div>
      </div>
      <div className='w-full sm:w-1/4 py-1 sm:py-0 sm:text-right'>
        <div
          className={classnames(`mt-6 sm:mt-0`, {
            'opacity-40': !isClaimable
          })}
        >
          <p className='font-inter text-inverse text-xxs uppercase'>{t('availableToClaim')}</p>
          <h5 className={classnames('flex items-center sm:justify-end mt-1')}>
            {!claimableData ? (
              <ThemedClipSpinner size={12} />
            ) : (
              <ClaimableAmountCountUp amount={Number(claimableData?.claimableAmount)} />
            )}
            <Erc20Image address={dripToken.address} className='inline-block w-6 h-6 ml-2' />
          </h5>

          {isSelf && (
            <div className='sm:ml-auto'>
              <ClaimButton
                {...props}
                refetch={() => {
                  refetchAllPoolTokenData()
                }}
                chainId={pool.chainId}
                name={name}
                dripToken={dripToken.symbol}
                tokenFaucetAddress={tokenFaucetAddress}
                isClaimable={isClaimable}
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
  const { address, dripToken, name, refetch, isClaimable, tokenFaucetAddress, chainId } = props

  const { network: walletChainId } = useOnboard()

  const { t } = useTranslation()
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txCompleted = tx?.completed

  const handleClaim = async (e) => {
    e.preventDefault()

    if (txPending) {
      return
    }

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

/**
 * Claims from all POOL token faucets
 * @param {*} props
 * @returns
 */
const ClaimAllButton = (props) => {
  const { t } = useTranslation()
  const { address, chainId, claimable, refetchAllPoolTokenData } = props

  const { network: walletChainId } = useOnboard()

  const { isFetched: isClaimablePoolDataFetched, data: claimablePoolFromTokenFaucets } =
    useClaimableTokenFromTokenFaucets(chainId, address)

  const tokenFaucetAddresses = useMemo(() => {
    if (claimablePoolFromTokenFaucets) {
      const addresses = []
      Object.keys(claimablePoolFromTokenFaucets).forEach((key) => {
        if (key === 'totals') return

        const claimablePoolData = claimablePoolFromTokenFaucets[key]
        const hasBalance = !claimablePoolData?.claimableAmountUnformatted.isZero()
        if (hasBalance) {
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

  const walletOnWrongNetwork = walletChainId !== chainId

  return (
    <Tooltip
      isEnabled={walletOnWrongNetwork}
      id={`account-gov-claim-all-button-tooltip`}
      className='ml-auto'
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(chainId)
      })}
    >
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
            <ThemedClipSpinner />
          </span>
        )}
        {text}
      </Button>
    </Tooltip>
  )
}
