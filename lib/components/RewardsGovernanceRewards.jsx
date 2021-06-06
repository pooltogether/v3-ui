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
import { Trans, useTranslation } from 'react-i18next'
import { amountMultByUsd, calculateAPR, calculateLPTokenPrice } from '@pooltogether/utilities'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'

import { formatUnits, parseUnits } from 'ethers/lib/utils'

import ERC20Abi from 'abis/ERC20Abi'
import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { TOKEN_IMAGES_BY_SYMBOL } from 'lib/constants/tokenImages'
import { CONTRACT_ADDRESSES, UI_LOADER_ANIM_DEFAULTS } from 'lib/constants'
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
import { DEXES, useStakingPoolChainData, useStakingPoolsAddresses } from 'lib/hooks/useStakingPools'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId, NETWORK } from 'lib/utils/networks'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { toScaledUsdBigNumber } from 'lib/utils/poolDataUtils'

export const RewardsGovernanceRewards = () => {
  const { t } = useTranslation()

  return (
    <>
      <h5 id='governance-claims' className='font-normal text-accent-2 my-4'>
        {t('governanceRewards', 'Governance rewards')}
      </h5>

      <div className='bg-card rounded-lg border border-accent-3 px-4 xs:px-8 py-4'>
        <div className='flex items-baseline xs:items-center flex-row-reverse xs:flex-row'>
          <div className='pool-gradient-1 px-2 mr-2 rounded-lg inline-block capitalize text-xxs text-white'>
            {t('tips')}
          </div>
          <h5 className='inline-block'>
            {t('voteGasFreeWhileEarningRewards', 'Vote gas-free while earning rewards!')}
          </h5>
        </div>

        <ol className='list-decimal block mt-2 px-8 text-xs text-accent-1'>
          <li>
            {t(
              'depositPoolTokenToThePoolPoolToGetPtPoolToken',
              'Deposit POOL token to POOL Pool to get ptPOOL token'
            )}
          </li>
          <li>
            {t(
              'earnRewardsImmediatelyWhileEligibleForGasFree',
              'Earn rewards immediately while eligible for gas-free votes on SnapShot'
            )}
          </li>
        </ol>
      </div>

      <div className='bg-card flex justify-between rounded-lg px-4 xs:px-8 py-2 mt-5 text-xxs text-accent-1 capitalize'>
        <div className='w-64'>{t('asset')}</div>
        <div className='w-20'>{t('apr')}</div>
        <div className='w-20'>{t('rewards')}</div>
        <div className='w-20'>{t('yourStake')}</div>
        <div className='w-20'></div>
        <div className='w-20'>{t('wallet')}</div>
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

  let mainContent
  if (!isFetched || !usersAddress) {
    mainContent = <StakingPoolCardMainContentsLoading />
  } else if (error) {
    mainContent = <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
  } else {
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
    <Card noMargin noPad className={'flex justify-between items-center py-4 px-8 my-1'}>
      <LPAssetHeader stakingPoolAddresses={stakingPoolAddresses} />
      {mainContent}
    </Card>
  )
}

const LPAssetHeader = (props) => {
  const { t } = useTranslation()
  const { stakingPoolAddresses } = props
  const { underlyingToken, dripToken } = stakingPoolAddresses
  const { token1, token2, pair: tokenPair, dex } = underlyingToken

  const baseSwapUrl = dex === DEXES.UniSwap ? UNISWAP_V2_PAIR_URL : SUSHISWAP_V2_PAIR_URL

  return (
    <div className='w-64 pr-1 flex flex-col xs:flex-row items-center'>
      <LPTokenLogo className='' token1={token1} token2={token2} />

      <div
        className='flex flex-col justify-center my-auto font-bold text-sm'
        style={{ minWidth: 'max-content' }}
      >
        {t('dexLpToken', { dex })}
        <br />
        {t('tokenPair', { tokens: tokenPair, interpolation: { escapeValue: false } })}
        <br />

        <a
          href={`${baseSwapUrl}${dripToken.address}`}
          target='_blank'
          rel='noreferrer noopener'
          className='underline flex items-center text-xxs font-normal text-accent-1 hover:text-accent-2 trans trans-fast opacity-60 hover:opacity-100'
        >
          {t('getLpToken')} <LinkIcon className='h-4 w-4' />
        </a>
      </div>
      <div className='lg:bg-body'></div>
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

const StakingPoolCardMainContentsLoading = () => {
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
  <div className={classnames('w-16 h-8 relative', props.className)}>
    <TokenIcon
      token={props.token1}
      className={classnames('absolute z-10', {
        'w-8 h-8': !props.small,
        'w-4 h-4': props.small
      })}
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

LPTokenLogo.defaultProps = {
  small: false
}

const TableCell = (props) => {
  const { topContentJsx, centerContentJsx, bottomContentJsx } = props

  return (
    <div className='w-20 h-20 flex flex-col justify-between items-start'>
      <span className='text-lg font-bold'>{topContentJsx}</span>

      <div className='flex items-center justify-center h-6'>{centerContentJsx}</div>

      {bottomContentJsx}
    </div>
  )
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
      <TableCell
        topContentJsx={<PoolNumber>{numberWithCommas(ticketBalance)}</PoolNumber>}
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

      <div className='flex flex-col items-center w-20'>
        <div className='border-default h-20 opacity-20' style={{ borderRightWidth: 1 }}>
          &nbsp;
        </div>
      </div>

      <TableCell
        topContentJsx={<PoolNumber>{numberWithCommas(lpBalance)}</PoolNumber>}
        centerContentJsx={<span className='text-xxs uppercase'>{underlyingToken.symbol}</span>}
        bottomContentJsx={
          <WithdrawTriggers openWithdrawModal={() => setWithdrawModalIsOpen(true)} />
        }
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
    <button className='capitalize underline' onClick={openDepositModal}>
      {t('stake')}
    </button>
  )
}

const WithdrawTriggers = (props) => {
  const { t } = useTranslation()
  const { openWithdrawModal } = props

  return (
    <button className='capitalize underline' onClick={openWithdrawModal}>
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
  const { dripRatePerDayUnformatted } = tokenFaucetData
  const { balanceUnformatted: ticketBalanceUnformatted } = tickets

  const { underlyingToken, tokenFaucet, dripToken } = stakingPoolAddresses
  const token1 = underlyingToken.token1
  const token2 = underlyingToken.token2

  const showClaimable = !ticketBalanceUnformatted.isZero() || !claimableBalanceUnformatted.isZero()

  const stakingAprJsx = (
    <StakingAPR
      chainId={chainId}
      underlyingToken={underlyingToken}
      underlyingTokenData={underlyingTokenData}
      dripToken={dripToken}
      dripRatePerDayUnformatted={dripRatePerDayUnformatted}
      tickets={tickets}
    />
  )

  return (
    <>
      {stakingAprJsx}

      <TableCell
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
            className='capitalize'
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
        className={classnames('underline', className)}
        disabled={disabled}
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
    <div className='w-20 text-lg'>
      <span className='font-bold'>{apr.split('.')?.[0]}</span>.{apr.split('.')?.[1]}%
    </div>
  )
}
