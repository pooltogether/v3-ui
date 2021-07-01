import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { Trans, useTranslation } from 'react-i18next'
import { APP_ENVIRONMENT, useAppEnv, useOnboard, useUsersAddress } from '@pooltogether/hooks'
import { ExternalLink, LinkTheme, Tooltip } from '@pooltogether/react-components'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { PoolNumber } from 'lib/components/PoolNumber'
import {
  RewardsTable,
  RewardsTableRow,
  RewardsTableCell,
  RewardsTableAprDisplay
} from 'lib/components/RewardsTable'
import { RewardsActionModal } from 'lib/components/RewardsActionModal'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { ContentOrSpinner } from 'lib/components/ContentOrSpinner'
import { Erc20Image } from 'lib/components/Erc20Image'
import { useClaimableTokenFromTokenFaucet } from 'lib/hooks/useClaimableTokenFromTokenFaucet'
import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'
import { useGovernancePools } from 'lib/hooks/usePools'
import { usePoolTokenData } from 'lib/hooks/usePoolTokenData'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { useUsersTokenBalanceAndAllowance } from 'lib/hooks/useUsersTokenBalanceAndAllowance'
import { displayPercentage } from 'lib/utils/displayPercentage'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { getNetworkNiceNameByChainId, NETWORK } from 'lib/utils/networks'
import { formatUsersTokenDataForPool } from 'lib/utils/formatUsersTokenDataForPool'

const bn = ethers.BigNumber.from

export const RewardsGovernance = () => {
  const { t } = useTranslation()

  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  const { data: pools } = useGovernancePools()
  const symbol = chainId === 1 ? 'PT-stPOOL' : 'PT-cBAT'
  const pool = pools?.find((pool) => pool.symbol === symbol)

  const tableDescriptionCard = (
    <div className='bg-card rounded-lg border border-secondary px-4 sm:px-8 py-4 mt-4'>
      <div className='flex items-baseline sm:items-center flex-col sm:flex-row'>
        <div className='pool-gradient-1 px-2 mr-2 mb-2 sm:mb-0 rounded-lg inline-block capitalize text-xxxs font-semibold text-white'>
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
                <ExternalLink
                  underline
                  className='text-xs'
                  theme={LinkTheme.light}
                  href='https://snapshot.org/#/poolpool.pooltogether.eth'
                />
              )
            }}
          />
        </li>
      </ol>
    </div>
  )

  return (
    <RewardsPools
      tableId='gov'
      tableHeader={t('governanceRewards')}
      tableDescriptionCard={tableDescriptionCard}
      tableSummary={t(
        'governanceRewardsSummary',
        'Deposit your POOL tokens to earn POOL rewards and vote on proposals without paying transaction fees.'
      )}
      pool={pool}
    />
  )
}

export const RewardsSponsorship = () => {
  const { t } = useTranslation()

  const { appEnv } = useAppEnv()
  const chainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  const { data: pools } = useGovernancePools()
  const symbol = chainId === 1 ? 'USDT-0x887E17' : 'PT-cDAI'
  const pool = pools?.find((pool) => pool.symbol === symbol)

  const tableDescriptionCard = (
    <div className='bg-card rounded-lg border border-secondary px-4 sm:px-8 py-4 mt-4'>
      <div className='flex items-baseline sm:items-center flex-col sm:flex-row'>
        <div className='pool-gradient-1 px-2 mr-2 mb-2 sm:mb-0 rounded-lg inline-block capitalize text-xxxs font-semibold text-white'>
          {t('tips')}
        </div>
        <h6 className='inline-block'>{t('whatArePoolSponsors', 'What is pool sponsorship?')}</h6>
      </div>

      <p className='list-decimal block mt-2 text-xs text-accent-1'>
        {t(
          'poolSponsorshipIs',
          'Pool sponsorship is deposits into a pool earning higher yield in rewards instead of chances to win prizes.'
        )}
      </p>
    </div>
  )

  return (
    <RewardsPools
      tableId='sponsorship'
      tableHeader={t('sponsorshipRewards')}
      tableDescriptionCard={tableDescriptionCard}
      tableSummary={t(
        'sponsorshipRewardsSummary',
        'Deposit into these pools to earn high-yield sponsorship rewards and help grow the prizes. Sponsors do not win prizes.'
      )}
      pool={pool}
    />
  )
}

const RewardsPools = (props) => {
  const { pool, tableId, tableHeader, tableSummary, tableDescriptionCard } = props

  const usersAddress = useUsersAddress()
  const { data: playerTickets, isFetched: playersTicketDataIsFetched } =
    useUserTicketsFormattedByPool(usersAddress)

  const { refetch: refetchTotalClaimablePool } = useClaimableTokenFromTokenFaucets(
    NETWORK.mainnet,
    usersAddress
  )
  const { refetch: refetchPoolTokenData } = usePoolTokenData()

  const refetchAllPoolTokenData = () => {
    refetchTotalClaimablePool()
    refetchPoolTokenData()
  }

  return (
    <>
      <div
        id={tableId}
        className='text-accent-2 mt-16 mb-1 opacity-90 font-headline uppercase xs:text-sm'
      >
        {tableHeader}
      </div>
      <p className='text-accent-1 text-xs mb-6'>{tableSummary}</p>

      {tableDescriptionCard}

      <RewardsTable columnOneWidthClass='sm:w-32 lg:w-64'>
        <RewardsPoolRow
          playersTicketDataIsFetched={playersTicketDataIsFetched}
          playerTickets={playerTickets}
          usersAddress={usersAddress}
          refetch={refetchAllPoolTokenData}
          key={`gov-rewards-card-${pool?.prizePool.address}`}
          pool={pool}
        />
      </RewardsTable>
    </>
  )
}

const RewardsPoolRow = (props) => {
  const { t } = useTranslation()

  const { pool, usersAddress, playerTickets, refetch } = props

  const underlyingToken = pool?.tokens?.underlyingToken

  const { network: walletChainId } = useOnboard()
  const walletOnWrongNetwork = walletChainId !== pool?.chainId

  const {
    data: usersChainData,
    isFetched: usersChainDataIsFetched,
    refetch: usersChainDataRefetch
  } = useUsersTokenBalanceAndAllowance(
    pool?.chainId,
    usersAddress,
    underlyingToken?.address,
    pool?.prizePool.address
  )
  const usersTokenDataForPool = formatUsersTokenDataForPool(pool, usersChainData)

  const refetchWithAllowance = () => {
    refetch()
    usersChainDataRefetch()
  }

  const poolTicketData = playerTickets?.find((t) => t.poolAddress === pool?.prizePool.address)
  const playersTicketData = poolTicketData?.ticket

  const error = false

  let remainingColumnsContents, stakingAprJsx

  if (error) {
    console.error(error)
    remainingColumnsContents = <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
  } else {
    stakingAprJsx = <GovRewardsAPR pool={pool} />

    remainingColumnsContents = (
      <GovPoolRewardsMainContent
        {...props}
        walletOnWrongNetwork={walletOnWrongNetwork}
        refetch={refetchWithAllowance}
        playersTicketData={playersTicketData}
        usersTokenDataForPool={usersTokenDataForPool}
        usersChainDataIsFetched={usersChainDataIsFetched}
        underlyingToken={underlyingToken}
      />
    )
  }

  return (
    <RewardsTableRow
      columnOneWidthClass='sm:w-3 lg:w-64'
      columnOneImage={<ColumnOneImage />}
      columnOneContents={<ColumnOneContents {...props} />}
      columnTwoContents={stakingAprJsx}
      remainingColumnsContents={remainingColumnsContents}
    />
  )
}

const ColumnOneImage = (props) => {
  const token = { symbol: 'POOL', address: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e' }

  return (
    <Erc20Image
      address={token.address}
      marginClasses='mr-0 sm:mr-3'
      className='relative inline-block w-8 h-8'
    />
  )
}

const ColumnOneContents = (props) => {
  const { pool } = props

  let symbol = pool?.symbol

  if (symbol === 'PT-stPOOL') {
    // override for POOL pool as our symbol shows staking pool, but the token ticker was requested instead
    symbol = 'pPOOL'
  }

  return (
    <div className='flex flex-col justify-center leading-none'>
      <div className='text-sm font-bold mt-3 sm:mt-0'>{pool?.name}</div>
      <div className='text-xs mt-1'>{symbol}</div>
    </div>
  )
}

const GovPoolRewardsMainContent = (props) => {
  return (
    <>
      <ClaimTokens {...props} />
      <ManageStakedAmount {...props} />
    </>
  )
}

const ClaimTokens = (props) => {
  const { t } = useTranslation()

  const { usersAddress, pool, refetch, underlyingToken } = props

  const tokenFaucetAddress = pool?.tokenListener.address
  const { data: claimablePoolData, isFetched } = useClaimableTokenFromTokenFaucet(
    pool?.chainId,
    tokenFaucetAddress,
    usersAddress
  )

  const claimable = claimablePoolData?.claimableAmount || '0.00'
  const claimableUnformatted = claimablePoolData?.claimableAmountUnformatted || bn(0)
  const isClaimable = !claimableUnformatted?.isZero()

  const name = t('prizePoolTicker', { ticker: underlyingToken?.symbol })

  return (
    <>
      <RewardsTableCell
        label={t('rewards')}
        topContentJsx={
          <ContentOrSpinner isLoading={usersAddress && !isFetched}>
            <PoolNumber>{numberWithCommas(claimable)}</PoolNumber>
          </ContentOrSpinner>
        }
        centerContentJsx={<UnderlyingTokenDisplay {...props} pool={pool} />}
        bottomContentJsx={
          <ClaimButton
            {...props}
            refetch={refetch}
            chainId={pool?.chainId}
            name={name}
            dripToken={pool?.tokens.tokenFaucetDripToken.symbol}
            tokenFaucetAddress={tokenFaucetAddress}
            isClaimable={isClaimable}
          />
        }
      />
    </>
  )
}

const ClaimButton = (props) => {
  const {
    usersAddress,
    dripToken,
    name,
    refetch,
    isClaimable,
    tokenFaucetAddress,
    chainId,
    walletOnWrongNetwork
  } = props

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

    const params = [usersAddress]

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
  // if (txPending && !txCompleted) {
  //   if (tx.sent) {
  //     text = t('confirming')
  //   } else {
  //     text = t('claiming')
  //   }
  // }

  return (
    <Tooltip
      isEnabled={walletOnWrongNetwork}
      id={`rewards-gov-claim-wallet-on-wrong-network-tooltip`}
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(chainId)
      })}
    >
      <button
        disabled={!isClaimable || walletOnWrongNetwork}
        className={classnames('underline trans trans-fast', {
          'text-flashy': txPending && !txCompleted,
          'text-accent-1 hover:text-green': !txPending || txCompleted
        })}
        onClick={handleClaim}
        style={{
          opacity: 1
        }}
      >
        {text}{' '}
        {txPending && (
          <span className='mr-2'>
            <ThemedClipSpinner size={12} />
          </span>
        )}
      </button>
    </Tooltip>
  )
}

const UnderlyingTokenDisplay = (props) => {
  const { pool, underlyingToken } = props

  return (
    <>
      {pool && (
        <Erc20Image address={pool.tokens.tokenFaucetDripToken.address} sizeClasses='w-4 h-4' />
      )}
      <span className='text-xxs uppercase'>{underlyingToken?.symbol}</span>
    </>
  )
}

const ManageStakedAmount = (props) => {
  const { t } = useTranslation()
  const {
    pool,
    playersTicketData,
    playersTicketDataIsFetched,
    usersTokenDataForPool,
    usersChainDataIsFetched,
    usersAddress
  } = props

  const playersTicketBalance = playersTicketData?.amount || '0.00'
  const playersTokenBalance = usersTokenDataForPool.usersTokenBalance || '0.00'
  const allowance = usersTokenDataForPool?.usersTokenAllowance

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  // const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

  useEffect(() => {
    setDepositModalIsOpen(false)
  }, [usersAddress])

  return (
    <>
      <RewardsTableCell
        label={t('yourStake')}
        topContentJsx={
          <ContentOrSpinner isLoading={usersAddress && !playersTicketDataIsFetched}>
            <PoolNumber>{numberWithCommas(playersTicketBalance)}</PoolNumber>
          </ContentOrSpinner>
        }
        centerContentJsx={<UnderlyingTokenDisplay {...props} pool={pool} />}
        bottomContentJsx={<WithdrawTriggers {...props} />}
      />

      <div className='hidden sm:flex flex-col items-center sm:w-10 lg:w-20'>
        <div className='border-default h-20 opacity-20' style={{ borderRightWidth: 1 }}>
          &nbsp;
        </div>
      </div>

      <RewardsTableCell
        label={t('wallet')}
        divTwoClassName='w-full sm:h-20 flex flex-col justify-between items-start leading-snug'
        topContentJsx={
          <ContentOrSpinner isLoading={usersAddress && !usersChainDataIsFetched}>
            <PoolNumber>{numberWithCommas(playersTokenBalance)}</PoolNumber>
          </ContentOrSpinner>
        }
        centerContentJsx={<UnderlyingTokenDisplay {...props} pool={pool} />}
        bottomContentJsx={
          <DepositTriggers {...props} openDepositModal={() => setDepositModalIsOpen(true)} />
        }
      />

      <DepositModal
        {...props}
        chainId={pool?.chainId}
        isOpen={depositModalIsOpen}
        closeModal={() => setDepositModalIsOpen(false)}
        playersTokenBalance={playersTokenBalance}
        allowance={allowance}
      />
    </>
  )
}

// const EnableDepositsButton = (props) => {
//   const { t } = useTranslation()
//   const { stakingPoolChainData, stakingPools, refetch, chainId } = props

//   const { prizePool, underlyingToken } = stakingPools

//   const decimals = stakingPoolChainData.user.underlyingToken.decimals

//   return (
//     <TransactionButton
//       chainId={chainId}
//       className='inline-block underline'
//       name={t('enableDeposits')}
//       abi={ERC20Abi}
//       contractAddress={underlyingToken.address}
//       method={'approve'}
//       params={[prizePool.address, ethers.utils.parseUnits('9999999999', Number(decimals))]}
//       refetch={refetch}
//     >
//       {props.children}
//     </TransactionButton>
//   )
// }

const DepositTriggers = (props) => {
  const { t } = useTranslation()
  const { openDepositModal, usersAddress } = props

  return (
    <span className='w-full block sm:inline'>
      <Tooltip
        isEnabled={!usersAddress}
        id='deposit-rewards-gov-wallet-tooltip'
        tip={t('connectAWalletToManageTicketsAndRewards')}
      >
        <button
          className='new-btn w-full capitalize text-xs sm:px-2 py-2 sm:py-0 mt-2'
          onClick={openDepositModal}
          disabled={!usersAddress}
        >
          {t('deposit')}
        </button>
      </Tooltip>
    </span>
  )
}

const WithdrawTriggers = (props) => {
  const { t } = useTranslation()

  const { pool, walletOnWrongNetwork, playersTicketData } = props
  const router = useRouter()

  const handleManageClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/rewards', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/rewards`, COOKIE_OPTIONS)

    router.push(
      `/account/pools/[networkName]/[symbol]/manage-tickets`,
      `/account/pools/${pool.networkName}/${pool.symbol}/manage-tickets`,
      {
        shallow: true
      }
    )
  }

  const noBalance = !playersTicketData || playersTicketData?.amountUnformatted.isZero()

  return (
    <Tooltip
      isEnabled={walletOnWrongNetwork}
      id={`lp-staking-withdraw-${pool?.prizePool.address}-wrong-network-tooltip`}
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(pool?.chainId)
      })}
    >
      <button
        className='capitalize underline text-accent-1 hover:text-green'
        onClick={handleManageClick}
        disabled={walletOnWrongNetwork || noBalance}
      >
        {t('withdraw')}
      </button>
    </Tooltip>
  )
}

const DepositModal = (props) => {
  const { t } = useTranslation()
  const { pool, playersTokenBalance, usersTokenDataForPool, usersAddress, underlyingToken } = props

  if (!pool || !underlyingToken) {
    return null
  }

  const maxAmount = playersTokenBalance
  const maxAmountUnformatted = usersTokenDataForPool.usersTokenBalanceUnformatted

  const decimals = underlyingToken?.decimals

  const ticket = pool?.tokens?.ticket

  return (
    <RewardsActionModal
      {...props}
      isPrize
      underlyingToken={underlyingToken}
      action={t('deposit')}
      decimals={decimals}
      maxAmount={maxAmount}
      maxAmountUnformatted={maxAmountUnformatted}
      pool={pool}
      method='depositTo'
      overMaxErrorMsg={t('enterAmountLowerThanTokenBalance')}
      tokenImage={
        <Erc20Image
          address={underlyingToken.address}
          marginClasses='mb-2'
          className='relative inline-block w-8 h-8'
        />
      }
      getParams={(quantity) => [
        usersAddress,
        ethers.utils.parseUnits(quantity, decimals),
        ticket.address,
        ethers.constants.AddressZero
      ]}
    />
  )
}

const GovRewardsAPR = (props) => {
  const { pool } = props

  let apr = pool?.tokenListener?.apr

  if (!pool || !apr) {
    return (
      <span className={classnames('flex')}>
        <ThemedClipSpinner size={12} />
      </span>
    )
  }

  apr = displayPercentage(apr)

  return <RewardsTableAprDisplay isPrize apr={apr} />
}
