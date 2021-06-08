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
import { TOKEN_IMAGES_BY_SYMBOL } from 'lib/constants/tokenImages'
import { Button } from 'lib/components/Button'
import { PoolNumber } from 'lib/components/PoolNumber'
import {
  RewardsTable,
  RewardsTableRow,
  RewardsTableCell,
  RewardsTableContentsLoading
} from 'lib/components/RewardsTable'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { Tooltip } from 'lib/components/Tooltip'
import { TxStatus } from 'lib/components/TxStatus'
import { Erc20Image } from 'lib/components/Erc20Image'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useStakingPoolChainData, useStakingPoolsAddresses } from 'lib/hooks/useStakingPools'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId, NETWORK } from 'lib/utils/networks'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { toScaledUsdBigNumber } from 'lib/utils/poolDataUtils'

export const RewardsGovernanceRewards = () => {
  const { t } = useTranslation()

  const stakingPoolsAddresses = useStakingPoolsAddresses()

  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

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
            {t(
              'earnRewardsImmediately',
              'Earn rewards immediately while eligible for gas-free votes on SnapShot'
            )}
          </li>
        </ol>
      </div>

      <RewardsTable>
        {stakingPoolsAddresses.map((stakingPoolAddresses) => (
          <StakingPoolCard
            chainId={chainId}
            key={`staking-pool-card-${stakingPoolAddresses.underlyingToken.dex}-${stakingPoolAddresses.underlyingToken.address}`}
            stakingPoolAddresses={stakingPoolAddresses}
          />
        ))}
      </RewardsTable>
    </>
  )
}

const StakingPoolCard = (props) => {
  const { t } = useTranslation()

  const { stakingPoolAddresses, chainId } = props

  const usersAddress = useUsersAddress()
  const {
    data: stakingPoolChainData,
    isFetched,
    refetch,
    error
  } = useStakingPoolChainData(stakingPoolAddresses, usersAddress)

  let mainContent, stakingAprJsx
  if (!isFetched || !usersAddress || !stakingPoolChainData) {
    mainContent = <RewardsTableContentsLoading />
  } else if (error) {
    mainContent = <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
  } else {
    const { user, tokenFaucet: tokenFaucetData } = stakingPoolChainData
    const { tickets, underlyingToken: underlyingTokenData } = user
    const { dripRatePerDayUnformatted } = tokenFaucetData

    const { underlyingToken, dripToken } = stakingPoolAddresses

    stakingAprJsx = (
      <StakingAPR
        chainId={chainId}
        underlyingToken={underlyingToken}
        underlyingTokenData={underlyingTokenData}
        dripToken={dripToken}
        dripRatePerDayUnformatted={dripRatePerDayUnformatted}
        tickets={tickets}
      />
    )

    mainContent = (
      <StakingPoolCardMainContents
        stakingPoolChainData={stakingPoolChainData}
        stakingPoolAddresses={stakingPoolAddresses}
        usersAddress={usersAddress}
        refetch={refetch}
      />
    )
  }

  return (
    <RewardsTableRow
      columnOneImage={<ColumnOneImage stakingPoolAddresses={stakingPoolAddresses} />}
      columnOneContents={<ColumnOneContents stakingPoolAddresses={stakingPoolAddresses} />}
      columnTwoContents={stakingAprJsx}
      remainingColumnsContents={mainContent}
    />
  )
}

const ColumnOneImage = (props) => {
  const { stakingPoolAddresses } = props
  const { underlyingToken } = stakingPoolAddresses
  const { token1, token2 } = underlyingToken

  return <LPTokensLogo className='' token1={token1} token2={token2} />
}

const ColumnOneContents = (props) => {
  const { t } = useTranslation()
  const { stakingPoolAddresses } = props
  const { underlyingToken, dripToken } = stakingPoolAddresses
  const { pair: tokenPair, dex } = underlyingToken

  return (
    <div
      className='flex flex-col justify-center my-auto leading-none sm:leading-normal'
      style={{ minWidth: 'max-content' }}
    >
      <div className='text-sm font-bold mt-3 sm:mt-0'>{tokenPair}</div>
      <div className='text-xs mt-1 sm:mt-0'>{dex}</div>
    </div>
  )
}

const StakingPoolCardMainContents = (props) => {
  const { stakingPoolAddresses, stakingPoolChainData, refetch } = props
  const usersAddress = useUsersAddress()
  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  return (
    <>
      <ClaimTokens
        chainId={chainId}
        usersAddress={usersAddress}
        stakingPoolAddresses={stakingPoolAddresses}
        stakingPoolChainData={stakingPoolChainData}
        refetch={refetch}
      />
      <ManageStakedAmount
        chainId={chainId}
        stakingPoolAddresses={stakingPoolAddresses}
        stakingPoolChainData={stakingPoolChainData}
        refetch={refetch}
      />
    </>
  )
}

const LPTokensLogo = (props) => (
  <div className={classnames('w-16 h-8 relative', props.className)}>
    <TokenIcon
      token={props.token1}
      className={classnames('absolute', {
        'w-8 h-8': !props.small,
        'w-4 h-4': props.small
      })}
      style={{ zIndex: 2 }}
    />
    <TokenIcon
      token={props.token2}
      className={classnames('absolute', {
        'w-8 h-8': !props.small,
        'w-4 h-4': props.small
      })}
      style={{ left: 20, top: 0 }}
    />
  </div>
)

const TokenIcon = (props) => {
  const { style, className, token } = props

  if (token.symbol === 'POOL') {
    return (
      <img
        src={TOKEN_IMAGES_BY_SYMBOL.pool}
        className={classnames('rounded-full', className)}
        style={style}
      />
    )
  } else if (token.symbol === 'ETH') {
    return (
      <img
        src={TOKEN_IMAGES_BY_SYMBOL.eth}
        className={classnames('rounded-full', className)}
        style={style}
      />
    )
  }
  return <Erc20Image {...token} className={className} />
}

LPTokensLogo.defaultProps = {
  small: false
}

const ManageStakedAmount = (props) => {
  const { t } = useTranslation()
  const { stakingPoolChainData, refetch, chainId, stakingPoolAddresses } = props
  const { user } = stakingPoolChainData
  const { underlyingToken: underlyingTokenChainData, tickets } = user
  const { balance: lpBalance, allowance } = underlyingTokenChainData
  const { balance: ticketBalance } = tickets

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

  const { underlyingToken } = stakingPoolAddresses

  return (
    <>
      {/* {!allowance.isZero() && (
      <div className='flex items-center lg:flex-row-reverse'>
          <div className='flex flex-col justify-start ml-8 lg:ml-0 lg:mr-12'>
            // <span className='text-xxs font-bold uppercase'>{t('deposited')}</span> 
          </div>
      </div>
        )} */}

      <span className='w-full sm:w-64 flex flex-col-reverse sm:flex-row'>
        <RewardsTableCell
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
        />
      </span>

      <DepositModal
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
      />
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

const ClaimTokens = (props) => {
  const { t } = useTranslation()
  const usersAddress = useUsersAddress()
  const { stakingPoolChainData, refetch, chainId, stakingPoolAddresses } = props
  const { user, tokenFaucet: tokenFaucetData } = stakingPoolChainData
  const {
    claimableBalance,
    claimableBalanceUnformatted,
    tickets,
    dripTokensPerDay,
    underlyingToken: underlyingTokenData
  } = user

  const { underlyingToken, tokenFaucet, dripToken } = stakingPoolAddresses
  const token1 = underlyingToken.token1

  return (
    <>
      <RewardsTableCell
        label={t('rewards')}
        topContentJsx={<PoolNumber>{numberWithCommas(claimableBalance)}</PoolNumber>}
        centerContentJsx={
          <>
            <TokenIcon token={dripToken} className='mr-2 rounded-full w-4 h-4' />
            <span className='text-xxs uppercase'>{token1.symbol}</span>
          </>
        }
        bottomContentJsx={
          <TransactionButton
            disabled={claimableBalanceUnformatted.isZero()}
            chainId={chainId}
            className='capitalize text-accent-1 hover:text-green'
            name={t('claimPool')}
            abi={TokenFaucetAbi}
            contractAddress={tokenFaucet.address}
            method={'claim'}
            params={[usersAddress]}
            refetch={refetch}
          >
            {t('claim')}
          </TransactionButton>
        }
      />
    </>
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
          <LPTokensLogo small className='my-auto mr-2' token1={token1} token2={token2} />
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

const StakingAPR = (props) => {
  const {
    chainId,
    underlyingToken,
    underlyingTokenData,
    dripRatePerDayUnformatted,
    dripToken,
    className,
    tickets
  } = props
  const { token1, token2 } = underlyingToken

  const currentBlock = '-1'

  const { data: lPTokenBalances, isFetched: tokenBalancesIsFetched } = useTokenBalances(
    chainId,
    underlyingToken.address,
    [token1.address, token2.address]
  )
  const { data: tokenPrices, isFetched: tokenPricesIsFetched } = useTokenPrices(chainId, {
    [currentBlock]: [token1.address, token2.address, dripToken.address]
  })

  if (!tokenPricesIsFetched || !tokenBalancesIsFetched) {
    return (
      <span className={classnames('flex', className)}>
        <ThemedClipSpinner size={12} />
      </span>
    )
  }

  const lpTokenPrice = calculateLPTokenPrice(
    formatUnits(
      lPTokenBalances[token1.address].amountUnformatted,
      lPTokenBalances[token1.address].decimals
    ),
    formatUnits(
      lPTokenBalances[token2.address].amountUnformatted,
      lPTokenBalances[token2.address].decimals
    ),
    tokenPrices[currentBlock][token1.address.toLowerCase()]?.usd || '0',
    tokenPrices[currentBlock][token2.address.toLowerCase()]?.usd || '0',
    underlyingTokenData.totalSupply
  )

  const totalDailyValueUnformatted = amountMultByUsd(
    dripRatePerDayUnformatted,
    tokenPrices[currentBlock][dripToken.address.toLowerCase()]?.usd || '0'
  )
  const totalDailyValue = formatUnits(totalDailyValueUnformatted, underlyingTokenData.decimals)
  const totalDailyValueScaled = toScaledUsdBigNumber(totalDailyValue)

  const totalValueUnformatted = amountMultByUsd(
    tickets.totalSupplyUnformatted,
    lpTokenPrice.toNumber()
  )
  const totalValue = formatUnits(totalValueUnformatted, underlyingTokenData.decimals)
  const totalValueScaled = toScaledUsdBigNumber(totalValue)

  const apr = calculateAPR(totalDailyValueScaled, totalValueScaled)

  return (
    <>
      <span className='font-bold'>{apr.split('.')?.[0]}</span>.{apr.split('.')?.[1]}%{' '}
      <span className='sm:hidden text-xxs text-accent-1'>APY</span>
    </>
  )
}
