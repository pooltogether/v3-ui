import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import Dialog from '@reach/dialog'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import { Trans, useTranslation } from 'react-i18next'
import { amountMultByUsd, calculateAPR, calculateLPTokenPrice } from '@pooltogether/utilities'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'

import { formatUnits, parseUnits } from 'ethers/lib/utils'

import ERC20Abi from 'abis/ERC20Abi'
import { Button } from 'lib/components/Button'
import { PoolNumber } from 'lib/components/PoolNumber'
import {
  RewardsTable,
  RewardsTableRow,
  RewardsTableCell,
  RewardsTableContentsLoading,
  RewardsTableAprDisplay
} from 'lib/components/RewardsTable'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { Tooltip } from 'lib/components/Tooltip'
import { TxStatus } from 'lib/components/TxStatus'
import { Erc20Image } from 'lib/components/Erc20Image'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { useClaimableTokenFromTokenFaucet } from 'lib/hooks/useClaimableTokenFromTokenFaucet'
import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'
import { useGovernancePools } from 'lib/hooks/usePools'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
// import {
//   useStakingPoolChainData,
//   useStakingPoolsAddresses
// } from 'lib/hooks/useStakingPools'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId, NETWORK } from 'lib/utils/networks'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { toScaledUsdBigNumber } from 'lib/utils/poolDataUtils'

export const RewardsGovernance = () => {
  const { t } = useTranslation()

  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  const { data: pools, isFetched: poolIsFetched } = useGovernancePools()
  const pool = pools?.find((pool) => pool.symbol === 'PT-stPOOL')
  const usersAddress = useUsersAddress()

  const { refetch: refetchTotalClaimablePool } = useClaimableTokenFromTokenFaucets(
    NETWORK.mainnet,
    usersAddress
  )
  const { refetch: refetchPoolTokenData } = usePoolTokenData(usersAddress)

  const refetchAllPoolTokenData = () => {
    refetchTotalClaimablePool()
    refetchPoolTokenData()
  }

  return (
    <>
      <h5 id='rewards-governance-claims' className='font-normal text-accent-2 mt-20'>
        {t('governanceRewards')}
      </h5>

      <div className='bg-card rounded-lg border border-accent-3 px-4 sm:px-8 py-4 mt-4'>
        <div className='flex items-baseline sm:items-center flex-col sm:flex-row'>
          <div className='pool-gradient-1 px-2 mr-2 mb-2 sm:mb-0 rounded-lg inline-block capitalize text-xxs text-white'>
            {t('tips')}
          </div>
          <h6 className='inline-block'>{t('voteGasFreeWhileEarningRewards')}</h6>
        </div>

        <ol className='list-decimal block mt-2 pl-4 sm:px-8 text-xs text-accent-1'>
          <li>{t('depositPoolTokenToThePoolPoolToGetPtPoolToken')}</li>
          <li>
            <Trans
              i18nKey='earnRewardsImmediately'
              defaults='Earn rewards immediately while eligible for gas-free votes on <linkSnapshot>SnapShot</linkSnapshot>'
              components={{
                linkSnapshot: (
                  <a
                    target='_blank'
                    className='text-accent-1 underline'
                    href='https://snapshot.org/#/poolpool.pooltogether.eth'
                  />
                )
              }}
            />
          </li>
        </ol>
      </div>

      <RewardsTable columnOneWidthClass='sm:w-32'>
        <GovRewardsCard
          address={usersAddress}
          refetchAllPoolTokenData={refetchAllPoolTokenData}
          key={`gov-rewards-card-${pool?.prizePool.address}`}
          pool={pool}
        />

        {/* {faucets.map((faucet) => (
          <GovRewardsPoolCard
            address={usersAddress}
            refetchAllPoolTokenData={refetchAllPoolTokenData}
            key={`gov-rewards-card-${faucet.pool?.prizePool.address}`}
            pool={faucet.pool}
          />
        ))} */}
      </RewardsTable>
    </>
  )
}

const GovRewardsItem = (props) => {
  const { address, pool, refetchAllPoolTokenData } = props

  const { t } = useTranslation()
  const { data: playerTickets } = useUserTicketsFormattedByPool(address)
  const tokenFaucetAddress = pool.tokenListener.address
  const { data: claimablePoolData, isFetched } = useClaimableTokenFromTokenFaucet(
    pool.chainId,
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

  if (pool.prizePool.address === '0x887e17d791dcb44bfdda3023d26f7a04ca9c7ef4') {
    apr = hardcodedWMaticApr(pool)
  }

  return (
    <div className='bg-body p-6 rounded-lg flex flex-col sm:flex-row sm:justify-between mt-4 sm:items-center'>
      <div className='flex flex-row-reverse sm:flex-row justify-between sm:justify-start'>
        <Link href={`/pools/${pool.networkName}/${pool.symbol}`}>
          <a>
            <PoolCurrencyIcon
              lg
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
                <h5 className='leading-none text-inverse'>{name}</h5>
              </a>
            </Link>{' '}
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

const GovRewardsCard = (props) => {
  const { t } = useTranslation()

  const { pool } = props

  const error = false

  let mainContent, stakingAprJsx
  // don't do this ... ?
  if (!pool) {
    mainContent = <RewardsTableContentsLoading />
  } else if (error) {
    mainContent = <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
  } else {
    stakingAprJsx = <GovRewardsAPR pool={pool} />

    mainContent = (
      <GovRewardsPoolCardMainContents
        {...props}
        // stakingPoolChainData={stakingPoolChainData}
        // stakingPoolAddresses={stakingPoolAddresses}
        // usersAddress={usersAddress}
        // refetch={refetch}
      />
    )
  }

  return (
    <RewardsTableRow
      columnOneWidthClass='sm:w-32'
      columnOneImage={<ColumnOneImage />}
      columnOneContents={<ColumnOneContents />}
      columnTwoContents={stakingAprJsx}
      remainingColumnsContents={mainContent}
    />
  )
}

const ColumnOneImage = (props) => {
  const token = { symbol: 'POOL', address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e' }

  return <Erc20Image address={token.address} className='relative inline-block w-8 h-8 mx-1' />
}

const ColumnOneContents = (props) => {
  return (
    <div
      className='flex flex-col justify-center my-auto leading-none sm:leading-normal font-bold mt-2 mb-4 sm:mt-0 sm:pl-4'
      style={{ minWidth: 'max-content' }}
    >
      ptPOOL
    </div>
  )
}

const GovRewardsPoolCardMainContents = (props) => {
  // const { refetch } = props
  const usersAddress = useUsersAddress()
  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  return (
    <>
      <ClaimTokens {...props} chainId={chainId} usersAddress={usersAddress} />
      <ManageStakedAmount {...props} chainId={chainId} />
    </>
  )
}

const ClaimTokens = (props) => {
  const { t } = useTranslation()

  const { address, pool, refetchAllPoolTokenData, chainId } = props

  const usersAddress = useUsersAddress()

  console.log({ address, pool, refetchAllPoolTokenData, chainId })

  const tokenFaucetAddress = pool.tokenListener.address
  const { data: claimablePoolData, isFetched } = useClaimableTokenFromTokenFaucet(
    pool.chainId,
    tokenFaucetAddress,
    address
  )

  if (!isFetched) return null

  const claimable = claimablePoolData?.claimableAmount
  const claimableUnformatted = claimablePoolData?.claimableAmountUnformatted
  const hasClaimable = !claimableUnformatted?.isZero()

  return (
    <>
      <RewardsTableCell
        wide
        label={t('rewards')}
        topContentJsx={<PoolNumber>{numberWithCommas(claimable)}</PoolNumber>}
        centerContentJsx={
          <>
            <Erc20Image address={pool.tokens.tokenFaucetDripToken.address} sizeClasses='w-4 h-4' />
            <span className='text-xxs uppercase'>{pool.tokens.tokenFaucetDripToken.symbol}</span>
          </>
        }
        bottomContentJsx={
          <ClaimButton
            {...props}
            refetch={() => {
              refetchAllPoolTokenData()
            }}
            chainId={pool.chainId}
            name={name}
            dripToken={pool.tokens.tokenFaucetDripToken.symbol}
            tokenFaucetAddress={tokenFaucetAddress}
            claimable={hasClaimable}
          />
        }
      />
    </>
  )
}

const ClaimButton = (props) => {
  const { address, dripToken, name, refetch, claimable, tokenFaucetAddress, chainId } = props

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

  const button = (
    <button
      disabled={!claimable || walletOnWrongNetwork}
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
  )

  return walletOnWrongNetwork ? (
    <Tooltip
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

// ;<TransactionButton
//   disabled={claimableUnformatted.isZero()}
//   chainId={chainId}
//   className='capitalize text-accent-1 hover:text-green'
//   name={t('claimPool')}
//   abi={TokenFaucetAbi}
//   contractAddress={tokenFaucet.address}
//   method={'claim'}
//   params={[usersAddress]}
//   refetch={refetchAllPoolTokenData}
// >
//   {t('claim')}
// </TransactionButton>

const ManageStakedAmount = (props) => {
  const { t } = useTranslation()
  const { refetch, chainId } = props

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

  return (
    <>
      {/* {!allowance.isZero() && (
      <div className='flex items-center lg:flex-row-reverse'>
          <div className='flex flex-col justify-start ml-8 lg:ml-0 lg:mr-12'>
            // <span className='text-xxs font-bold uppercase'>{t('deposited')}</span> 
          </div>
      </div>
        )} */}

      <span className='w-full sm:w-48 lg:w-64 flex flex-col-reverse sm:flex-row'>
        stuff
        {/* <RewardsTableCell
          label={t('wallet')}
          topContentJsx={<PoolNumber>{numberWithCommas(ticketBalance)}</PoolNumber>}
          centerContentJsx={<span className='text-xxs uppercase'>{underlyingToken.symbol}</span>}
          bottomContentJsx={
            <WithdrawTriggers openWithdrawModal={() => setWithdrawModalIsOpen(true)} />
          }
        />

        <div className='hidden sm:flex flex-col items-center sm:w-20'>
          <div className='border-default h-20 opacity-20' style={{ borderRightWidth: 1 }}>
            &nbsp;
          </div>
        </div>

        <RewardsTableCell
          label={t('yourStake')}
          topContentJsx={<PoolNumber>{numberWithCommas(lpBalance)}</PoolNumber>}
          centerContentJsx={<span className='text-xxs uppercase'>{underlyingToken.symbol}</span>}
          bottomContentJsx={
            <DepositTriggers
              chainId={chainId}
              stakingPoolChainData={stakingPoolChainData}
              stakingPoolAddresses={stakingPoolAddresses}
              openDepositModal={() => setDepositModalIsOpen(true)}
              openWithdrawModal={() => setWithdrawModalIsOpen(true)}
              refetch={refetch}
            />
          }
        /> */}
      </span>

      {/* <DepositModal
        chainId={chainId}
        stakingPoolChainData={stakingPoolChainData}
        stakingPoolAddresses={stakingPoolAddresses}
        isOpen={depositModalIsOpen}
        closeModal={() => setDepositModalIsOpen(false)}
        refetch={refetch}
      />
      <WithdrawModal
        chainId={chainId}
        stakingPoolChainData={stakingPoolChainData}
        stakingPoolAddresses={stakingPoolAddresses}
        isOpen={withdrawModalIsOpen}
        closeModal={() => setWithdrawModalIsOpen(false)}
        refetch={refetch}
      /> */}
    </>
  )
}

const EnableDepositsButton = (props) => {
  const { t } = useTranslation()
  const { stakingPoolChainData, stakingPoolAddresses, refetch, chainId } = props

  const { prizePool, underlyingToken } = stakingPoolAddresses

  const decimals = stakingPoolChainData.user.underlyingToken.decimals

  return (
    <TransactionButton
      chainId={chainId}
      className='inline-block underline'
      name={t('enableDeposits')}
      abi={ERC20Abi}
      contractAddress={underlyingToken.address}
      method={'approve'}
      params={[prizePool.address, ethers.utils.parseUnits('9999999999', Number(decimals))]}
      refetch={refetch}
    >
      {props.children}
    </TransactionButton>
  )
}

const DepositTriggers = (props) => {
  const { t } = useTranslation()
  const { openDepositModal } = props

  // const allowance = stakingPoolChainData.user.underlyingToken.allowance

  // if (allowance.isZero()) {
  //   return (
  //     <div className='flex items-center justify-end'>
  //       <EnableDepositsButton {...props}>{t('enableDeposits')}</EnableDepositsButton>
  //     </div>
  //   )
  // }

  return (
    <button className='capitalize underline hover:text-green' onClick={openDepositModal}>
      {t('stake')}
    </button>
  )
}

const WithdrawTriggers = (props) => {
  const { t } = useTranslation()
  const { openWithdrawModal } = props

  return (
    <button
      className='capitalize underline text-accent-1 hover:text-green'
      onClick={openWithdrawModal}
    >
      {t('withdraw')}
    </button>
  )
}

const TransactionButton = (props) => {
  const { t } = useTranslation()
  const { disabled, name, abi, contractAddress, method, params, refetch, className, chainId } =
    props
  const { network: walletChainId } = useOnboard()

  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const isOnProperNetwork = walletChainId === chainId

  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed
  const txCompleted = tx?.completed && !tx?.cancelled

  if (txCompleted) {
    return (
      <div className={classnames('flex flex-row', className)}>
        <FeatherIcon icon='check-circle' className='w-4 h-4 text-green my-auto' />
        <span className='ml-2'>{t('transactionSuccessful')}</span>
      </div>
    )
  } else if (!isOnProperNetwork) {
    return (
      <Tooltip
        id={method}
        tip={t('yourWalletIsOnTheWrongNetwork', {
          networkName: getNetworkNiceNameByChainId(chainId)
        })}
      >
        <button
          type='button'
          onClick={async () => {
            const id = await sendTx(name, abi, contractAddress, method, params, refetch)
            setTxId(id)
          }}
          className={classnames('flex flex-row underline', className)}
          disabled
        >
          {props.children}
        </button>
      </Tooltip>
    )
  }

  return (
    <>
      <div className='flex items-center'>
        <button
          type='button'
          onClick={async () => {
            const id = await sendTx(name, abi, contractAddress, method, params, refetch)
            setTxId(id)
          }}
          className={classnames('underline', className)}
          disabled={disabled}
        >
          {props.children}
        </button>

        {txPending && (
          <span className='ml-1'>
            <ThemedClipSpinner size={12} color='#bbb2ce' />
          </span>
        )}
      </div>
    </>
  )
}

const WithdrawModal = (props) => {
  const { t } = useTranslation()
  const { stakingPoolAddresses, stakingPoolChainData } = props
  const { ticket } = stakingPoolAddresses

  const usersAddress = useUsersAddress()

  const { tickets } = stakingPoolChainData.user
  const maxAmount = tickets.balance
  const decimals = tickets.decimals
  const maxAmountUnformatted = tickets.balanceUnformatted

  return (
    <ActionModal
      {...props}
      action={t('withdraw')}
      maxAmount={maxAmount}
      maxAmountUnformatted={maxAmountUnformatted}
      method='withdrawInstantlyFrom'
      getParams={(quantity) => [
        usersAddress,
        ethers.utils.parseUnits(quantity, decimals),
        ticket.address,
        ethers.constants.Zero
      ]}
    />
  )
}

const DepositModal = (props) => {
  const { t } = useTranslation()
  const { stakingPoolAddresses, stakingPoolChainData } = props
  const usersAddress = useUsersAddress()
  const { ticket } = stakingPoolAddresses

  const { underlyingToken } = stakingPoolChainData.user

  const maxAmount = underlyingToken.balance
  const decimals = underlyingToken.decimals
  const maxAmountUnformatted = underlyingToken.balanceUnformatted

  return (
    <ActionModal
      {...props}
      action={t('deposit')}
      maxAmount={maxAmount}
      maxAmountUnformatted={maxAmountUnformatted}
      method='depositTo'
      getParams={(quantity) => [
        usersAddress,
        ethers.utils.parseUnits(quantity, decimals),
        ticket.address,
        ethers.constants.AddressZero
      ]}
    />
  )
}

const ActionModal = (props) => {
  const { t } = useTranslation()

  const {
    isOpen,
    closeModal,
    action,
    maxAmount,
    maxAmountUnformatted,
    stakingPoolChainData,
    method,
    getParams,
    refetch,
    chainId,
    stakingPoolAddresses
  } = props

  const { register, handleSubmit, setValue, errors, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const decimals = stakingPoolChainData.user.underlyingToken.decimals

  const { isValid } = formState

  const { prizePool, underlyingToken } = stakingPoolAddresses
  const { token1, token2 } = underlyingToken

  const { network: walletChainId } = useOnboard()
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)
  const txPending = (tx?.sent || tx?.inWallet) && !tx?.completed

  const isOnProperNetwork = walletChainId === chainId

  const onSubmit = async (formData) => {
    const id = await sendTx(
      `${action} ${underlyingToken.symbol}`,
      PrizePoolAbi,
      prizePool.address,
      method,
      getParams(formData[action]),
      refetch
    )
    setTxId(id)
  }

  return (
    <Dialog
      aria-label={`${underlyingToken.symbol} Pool ${action} Modal`}
      isOpen={isOpen}
      onDismiss={closeModal}
    >
      <div className='relative text-inverse p-4 bg-card h-full sm:h-auto rounded-none sm:rounded-xl sm:max-w-xl mx-auto flex flex-col'>
        <div className='flex'>
          <button
            className='absolute r-4 t-4 close-button trans text-inverse hover:opacity-30'
            onClick={closeModal}
          >
            <FeatherIcon icon='x' className='w-6 h-6' />
          </button>
        </div>

        <div className='flex flex-row mb-4 mt-10 sm:mt-0'>
          <h5>
            {action} {underlyingToken.symbol}
          </h5>
        </div>

        <NetworkWarning isOnProperNetwork={isOnProperNetwork} chainId={chainId} />

        {txPending && (
          <div className='mx-auto text-center'>
            <TxStatus gradient='basic' tx={tx} />
          </div>
        )}

        {!txPending && (
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
            <div className='flex flex-row justify-between mt-4 mb-2'>
              <label className='my-0 capitalize' htmlFor={`_${action}`}>
                {action}
              </label>
              <div>
                <span className='mr-1'>{t('balance')}:</span>
                <button
                  type='button'
                  onClick={() => setValue(action, maxAmount, { shouldValidate: true })}
                >
                  {numberWithCommas(maxAmount)}
                </button>
              </div>
            </div>
            <input
              name={action}
              className='bg-body p-2 w-full rounded-xl outline-none focus:outline-none active:outline-none'
              autoFocus
              ref={register({
                required: true,
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: t('pleaseEnterAPositiveNumber')
                },
                validate: {
                  greaterThanBalance: (value) =>
                    parseUnits(value, decimals).lte(maxAmountUnformatted) ||
                    t('pleaseEnterANumberLessThanYourBalance')
                }
              })}
            />
            <span className='h-6 w-full text-xxs text-orange'>
              {errors?.[action]?.message || null}
            </span>

            <div className='flex flex-row w-full justify-between mt-6'>
              <Button type='button' className='mr-2' width='w-full' onClick={closeModal}>
                {t('cancel')}
              </Button>
              <Button
                type='submit'
                border='green'
                text='primary'
                bg='green'
                hoverBorder='green'
                hoverText='primary'
                hoverBg='green'
                className='ml-2'
                width='w-full'
                disabled={!isValid || !isOnProperNetwork}
              >
                {t('confirm')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  )
}

const NetworkWarning = (props) => {
  const { t } = useTranslation()
  const { chainId, isOnProperNetwork } = props

  if (isOnProperNetwork) return null

  return (
    <div className='flex flex-row'>
      <FeatherIcon icon='alert-circle' className='text-orange w-6 h-6 mr-2 my-auto' />
      <span className='text-xxs'>
        {t('yourWalletIsOnTheWrongNetwork', { networkName: getNetworkNiceNameByChainId(chainId) })}
      </span>
    </div>
  )
}

const GovRewardsAPR = (props) => {
  const { pool } = props

  let apr = pool?.tokenListener?.apr

  if (!pool || !apr) {
    return (
      <span className={classnames('flex', className)}>
        <ThemedClipSpinner size={12} />
      </span>
    )
  }

  apr = displayPercentage(apr)

  return <RewardsTableAprDisplay apr={apr} />
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
