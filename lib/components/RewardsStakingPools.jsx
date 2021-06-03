import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import Dialog from '@reach/dialog'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import ContentLoader from 'react-content-loader'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import { isMobile } from 'react-device-detect'
import { amountMultByUsd, calculateAPR, calculateLPTokenPrice } from '@pooltogether/utilities'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'

import { formatUnits, parseUnits } from 'ethers/lib/utils'

import ERC20Abi from 'abis/ERC20Abi'
import { Trans, useTranslation } from 'react-i18next'
import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { TOKEN_IMAGES_BY_SYMBOL } from 'lib/constants/tokenImages'
import { UI_LOADER_ANIM_DEFAULTS } from 'lib/constants'
import { Card } from 'lib/components/Card'
import { Button } from 'lib/components/Button'
import { PoolNumber } from 'lib/components/PoolNumber'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { Tooltip } from 'lib/components/Tooltip'
import { TxStatus } from 'lib/components/TxStatus'
import { Erc20Image } from 'lib/components/Erc20Image'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { LinkIcon } from 'lib/components/BlockExplorerLink'
import { useStakingPoolChainData, useStakingPoolsAddresses } from 'lib/hooks/useStakingPools'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId, NETWORK } from 'lib/utils/networks'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { toScaledUsdBigNumber } from 'lib/utils/poolDataUtils'

const UNISWAP_V2_PAIR_URL = 'https://app.uniswap.org/#/add/v2/ETH/'

// This component should only show up for the currentUser viewing their own account
export const RewardsStakingPools = () => {
  const { t } = useTranslation()

  const stakingPoolsAddresses = useStakingPoolsAddresses()

  return (
    <>
      <h5 id='governance-claims' className='font-normal text-accent-2 mt-16 mb-4'>
        {t('lpStakingRewards')}
      </h5>

      <div className='bg-card rounded-lg border border-accent-3 px-4 xs:px-8 py-4'>
        <div className='flex items-baseline flex-row-reverse xs:flex-row'>
          <div className='pool-gradient-1 px-2 mr-2 rounded-lg inline-block capitalize text-xxs text-white'>
            {t('tips')}
          </div>
          <h5 className='inline-block'>{t('earnStakingRewardsTipDescription')}</h5>
        </div>

        <ol className='list-decimal block mt-2 px-8 text-xs text-accent-1'>
          <li>{t('earnStakingRewardsTipOne')}</li>
          <li>{t('earnStakingRewardsTipTwo')}</li>
          <li>{t('earnStakingRewardsTipThree')}</li>
        </ol>
      </div>

      {stakingPoolsAddresses.map((stakingPoolAddresses) => (
        <StakingPoolCard
          key={stakingPoolAddresses.prizePool.address}
          stakingPoolAddresses={stakingPoolAddresses}
        />
      ))}
    </>
  )
}

const StakingPoolCard = (props) => {
  const { stakingPoolAddresses } = props
  const { t } = useTranslation()
  const usersAddress = useUsersAddress()
  const {
    data: stakingPoolChainData,
    isFetched,
    refetch,
    error
  } = useStakingPoolChainData(stakingPoolAddresses, usersAddress)

  const cardClassName = 'flex flex-col lg:flex-row py-2'

  if (!isFetched || !usersAddress) {
    return (
      <Card noPad className={cardClassName}>
        <LPTokenCardHeader stakingPoolAddresses={stakingPoolAddresses} />
        <CardMainContentsLoading />
      </Card>
    )
  } else if (error) {
    return (
      <Card noPad className={cardClassName}>
        <LPTokenCardHeader stakingPoolAddresses={stakingPoolAddresses} />
        <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
      </Card>
    )
  }

  return (
    <Card noPad className={cardClassName}>
      <LPTokenCardHeader stakingPoolAddresses={stakingPoolAddresses} />
      <CardMainContents
        stakingPoolChainData={stakingPoolChainData}
        stakingPoolAddresses={stakingPoolAddresses}
        usersAddress={usersAddress}
        refetch={refetch}
      />
    </Card>
  )
}

const LPTokenCardHeader = (props) => {
  const { t } = useTranslation()
  const { stakingPoolAddresses } = props
  const { underlyingToken, dripToken } = stakingPoolAddresses
  const { token1, token2, pair: tokenPair } = underlyingToken
  return (
    <div className='border-body lg:border-dotted lg:border-r-4 py-4 xs:py-6 px-4 xs:px-6 lg:px-10 flex'>
      <div
        className='flex flex-row lg:flex-col justify-center my-auto'
        style={{ minWidth: 'max-content' }}
      >
        <LPTokenLogo className='lg:mx-auto' token1={token1} token2={token2} />
        <a
          href={`${UNISWAP_V2_PAIR_URL}${dripToken.address}`}
          target='_blank'
          rel='noreferrer noopener'
          className='text-xs font-bold my-auto ml-2 lg:ml-0 lg:mt-2 text-inverse hover:opacity-70 flex'
        >
          {t('tokenPair', { tokens: tokenPair, interpolation: { escapeValue: false } })}
          <LinkIcon className='h-4 w-4' />
        </a>
      </div>
      <div className='lg:bg-body'></div>
    </div>
  )
}

const CardMainContents = (props) => {
  const { stakingPoolAddresses, stakingPoolChainData, refetch } = props
  const usersAddress = useUsersAddress()
  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  return (
    <div className='flex flex-col lg:flex-row justify-between w-full py-2 px-4 xs:px-6 lg:px-10'>
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
    </div>
  )
}

const CardMainContentsLoading = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  if (isMobile) {
    return (
      <div className='w-full p-4'>
        <ContentLoader
          {...UI_LOADER_ANIM_DEFAULTS}
          viewBox='0 0 100% 20'
          width='100%'
          height={90}
          backgroundColor={bgColor}
          foregroundColor={foreColor}
        >
          <rect x='0' y='0' rx='2' ry='2' width='60%' height='40' />
          <rect x='0' y='50' rx='2' ry='2' width='40%' height='30' />
        </ContentLoader>
      </div>
    )
  }

  return (
    <div className='w-full p-4'>
      <ContentLoader
        {...UI_LOADER_ANIM_DEFAULTS}
        viewBox='0 0 100% 20'
        width='100%'
        height={90}
        backgroundColor={bgColor}
        foregroundColor={foreColor}
      >
        <rect x='0' y='0' rx='2' ry='2' width='90' height='45' />
        <rect x='85%' y='0' rx='2' ry='2' width='80' height='30' />
        <rect x='85%' y='45' rx='2' ry='2' width='80' height='30' />
      </ContentLoader>
    </div>
  )
}

const LPTokenLogo = (props) => (
  <div className={classnames('relative', props.className)}>
    <TokenIcon
      token={props.token1}
      className={classnames('absolute', {
        'w-8 h-8': !props.small,
        'w-4 h-4': props.small
      })}
    />
    <TokenIcon
      token={props.token2}
      className={{
        'w-8 h-8 ml-4': !props.small,
        'w-4 h-4 ml-2': props.small
      }}
    />
  </div>
)

const TokenIcon = (props) => {
  if (props.token.symbol === 'POOL') {
    return (
      <img
        src={TOKEN_IMAGES_BY_SYMBOL.pool}
        className={classnames('rounded-full', props.className)}
      />
    )
  } else if (props.token.symbol === 'ETH') {
    return (
      <img
        src={TOKEN_IMAGES_BY_SYMBOL.eth}
        className={classnames('rounded-full', props.className)}
      />
    )
  }
  return <Erc20Image {...props.token} className={props.className} />
}

LPTokenLogo.defaultProps = {
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
  const { token1, token2 } = underlyingToken

  return (
    <div className='flex flex-col text-left lg:text-right'>
      <div className='flex lg:justify-end mb-2'>
        <LPTokenLogo small className='my-auto' token1={token1} token2={token2} />
        <span className='ml-2 text-xxs font-bold uppercase'>{underlyingToken.symbol}</span>
      </div>

      <div className='flex items-center lg:flex-row-reverse'>
        <div className='flex flex-col'>
          <span className='text-xxxs font-bold uppercase'>{t('balance')}</span>
          <span className='text-xl font-bold leading-none mb-2'>
            <PoolNumber>{numberWithCommas(lpBalance)}</PoolNumber>
          </span>
        </div>

        {!allowance.isZero() && (
          <div className='flex flex-col justify-start ml-8 lg:ml-0 lg:mr-12'>
            <span className='text-xxxs font-bold uppercase'>{t('deposited')}</span>
            <span className='text-xl font-bold leading-none mb-2'>
              <PoolNumber>{numberWithCommas(ticketBalance)}</PoolNumber>
            </span>
          </div>
        )}
      </div>

      <ManageDepositTriggers
        chainId={chainId}
        stakingPoolChainData={stakingPoolChainData}
        stakingPoolAddresses={stakingPoolAddresses}
        openDepositModal={() => setDepositModalIsOpen(true)}
        openWithdrawModal={() => setWithdrawModalIsOpen(true)}
        refetch={refetch}
      />

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
    </div>
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

const ManageDepositTriggers = (props) => {
  const { t } = useTranslation()
  const { openDepositModal, openWithdrawModal, stakingPoolChainData } = props

  const allowance = stakingPoolChainData.user.underlyingToken.allowance

  if (allowance.isZero()) {
    return (
      <div className='flex items-center justify-end'>
        <EnableDepositsButton {...props}>{t('enableDeposits')}</EnableDepositsButton>
      </div>
    )
  }

  return (
    <div className='flex flex-row mr-auto lg:mr-0 lg:ml-auto lg:flex-row-reverse'>
      <button className='underline' onClick={openDepositModal}>
        {t('deposit')}
      </button>
      <span className='mx-2 opacity-20'>&mdash;</span>
      <button className='underline' onClick={openWithdrawModal}>
        {t('withdraw')}
      </button>
    </div>
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
  const { dripRatePerDayUnformatted } = tokenFaucetData
  const { balanceUnformatted: ticketBalanceUnformatted } = tickets

  const { underlyingToken, tokenFaucet, dripToken } = stakingPoolAddresses
  const token1 = underlyingToken.token1
  const token2 = underlyingToken.token2

  const showClaimable = !ticketBalanceUnformatted.isZero() || !claimableBalanceUnformatted.isZero()

  if (!showClaimable) {
    return (
      <div className='flex flex-col mb-6 lg:mb-0 text-xxs lg:text-xs'>
        <span
          className='text-base mb-4 bg-body px-2 rounded-full'
          style={{ maxWidth: 'max-content' }}
        >
          <StakingAPR
            chainId={chainId}
            underlyingToken={underlyingToken}
            underlyingTokenData={underlyingTokenData}
            dripToken={dripToken}
            dripRatePerDayUnformatted={dripRatePerDayUnformatted}
            tickets={tickets}
          />
        </span>
        <span className='mb-2 font-bold'>
          {t('participateInTokenStaking', {
            token: underlyingToken.symbol,
            interpolation: { escapeValue: false }
          })}
        </span>
        <ol className='list-decimal pl-4 '>
          <li>
            <span className=''>
              <Trans
                i18nKey='uniswapLPInstructionsStep1'
                defaults='Deposit {{token1}} and {{token2}} into <a>Uniswap V2</a>'
                components={{
                  a: (
                    <a
                      href={`${UNISWAP_V2_PAIR_URL}${dripToken.address}`}
                      target='_blank'
                      rel='noreferrer noopener'
                      className='inline-flex'
                    />
                  ),
                  token1: token1.symbol,
                  token2: token2.symbol
                }}
              />
            </span>
          </li>
          <li>
            <EnableDepositsButton {...props}>
              {t('uniswapLPInstructionsStep2')}
            </EnableDepositsButton>
          </li>
          <li>
            {t('uniswapLPInstructionsStep3', {
              token: underlyingToken.symbol,
              interpolation: { escapeValue: false }
            })}
          </li>
        </ol>
      </div>
    )
  }

  return (
    <div className='flex flex-col text-left mb-4 lg:mb-0'>
      <div className='flex mb-2'>
        <TokenIcon token={dripToken} className='my-auto mr-2 rounded-full w-4 h-4' />
        <span className='text-xxs font-bold capitalize'>
          {t('tokenEarned', { token: token1.symbol })}
        </span>
      </div>

      <span className='text-2xl font-bold leading-none mb-1'>
        <PoolNumber>{numberWithCommas(claimableBalance)}</PoolNumber>
      </span>

      <span className='text-xxs my-2 bg-body px-2 rounded-full' style={{ maxWidth: 'max-content' }}>
        <StakingAPR
          chainId={chainId}
          underlyingToken={underlyingToken}
          underlyingTokenData={underlyingTokenData}
          dripToken={dripToken}
          dripRatePerDayUnformatted={dripRatePerDayUnformatted}
          tickets={tickets}
        />
      </span>

      <span className='text-xxs flex'>
        <span className='mr-1'>{t('earning')}</span>
        <b>{numberWithCommas(dripTokensPerDay)}</b>
        <TokenIcon token={dripToken} className='my-auto ml-2 mr-1 rounded-full w-4 h-4' />
        {token1.symbol} / {t('day')}
      </span>

      {!claimableBalanceUnformatted.isZero() && (
        <TransactionButton
          chainId={chainId}
          className='mr-auto mt-2 capitalize'
          name={t('claimPool')}
          abi={TokenFaucetAbi}
          contractAddress={tokenFaucet.address}
          method={'claim'}
          params={[usersAddress]}
          refetch={refetch}
        >
          {t('claim')}
        </TransactionButton>
      )}
    </div>
  )
}

const TransactionButton = (props) => {
  const { t } = useTranslation()
  const { name, abi, contractAddress, method, params, refetch, className, chainId } = props
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
          className={classnames('flex flex-row', className)}
          disabled
        >
          {props.children}
        </button>
      </Tooltip>
    )
  }

  return (
    <>
      {txPending && (
        <span className='mr-1'>
          <ThemedClipSpinner size={12} color='#bbb2ce' />
        </span>
      )}

      <button
        type='button'
        onClick={async () => {
          const id = await sendTx(name, abi, contractAddress, method, params, refetch)
          setTxId(id)
        }}
        className={classnames(className)}
        // className={classnames('flex flex-row', className)}
      >
        {props.children}
      </button>
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
          <LPTokenLogo small className='my-auto mr-2' token1={token1} token2={token2} />
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
        <img src={TOKEN_IMAGES_BY_SYMBOL.pool} className='rounded-full w-4 h-4 my-auto mr-1' />
        <div className='mx-1'>
          <ThemedClipSpinner size={12} />
        </div>
        <span className='ml-1'>APR</span>
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
    <span className={classnames('flex', className)}>
      <img src={TOKEN_IMAGES_BY_SYMBOL.pool} className='rounded-full w-4 h-4 my-auto mr-1' />
      <b className='mr-1'>{apr}%</b>
      <span className='flex'>APR</span>
    </span>
  )
}
