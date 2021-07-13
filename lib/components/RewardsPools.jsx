import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
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
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'

import { findSponsorshipFaucet } from 'lib/hooks/useTokenFaucetApr'
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
      pools={[pool]}
    />
  )
}

export const RewardsSponsorship = () => {
  const { t } = useTranslation()

  const { data: pools } = useGovernancePools()

  let sponsorshipIncentivizedPools = []
  pools?.forEach((pool) => {
    if (Boolean(findSponsorshipFaucet(pool))) {
      sponsorshipIncentivizedPools.push(pool)
    }
  })

  const tableDescriptionCard = (
    <div className='bg-card rounded-lg border border-secondary px-4 sm:px-8 py-4 mt-4'>
      <div className='flex items-baseline sm:items-center flex-col sm:flex-row'>
        <div className='pool-gradient-1 px-2 mr-2 mb-2 sm:mb-0 rounded-lg inline-block capitalize text-xxxs font-semibold text-white'>
          {t('tips')}
        </div>
        <h6 className='inline-block'>{t('whatArePoolSponsors')}</h6>
      </div>

      <p className='list-decimal block mt-2 text-xs text-accent-1'>{t('poolSponsorshipIs')}</p>
    </div>
  )

  return (
    <RewardsPools
      isSponsorship
      tableId='sponsorship'
      tableHeader={t('sponsorshipRewards')}
      tableDescriptionCard={tableDescriptionCard}
      tableSummary={t('sponsorshipRewardsSummary')}
      pools={sponsorshipIncentivizedPools}
    />
  )
}

const RewardsPools = (props) => {
  const { t } = useTranslation()

  const { isSponsorship, pools, tableId, tableHeader, tableSummary, tableDescriptionCard } = props

  const usersAddress = useUsersAddress()
  const { data: playersDepositData, isFetched: playersDepositDataIsFetched } =
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
      <HashHighlightable
        id={tableId}
        className='text-accent-2 mt-16 mb-1 opacity-90 font-headline uppercase xs:text-sm'
      >
        {tableHeader}
      </HashHighlightable>

      <p className='text-accent-1 text-xs mb-6'>{tableSummary}</p>

      {tableDescriptionCard}

      <RewardsTable
        depositColumnHeader={t(isSponsorship ? 'yourSponsorship' : 'yourStake')}
        columnOneWidthClass='w-32 lg:w-64'
      >
        {pools.map((pool) => (
          <RewardsPoolRow
            {...props}
            key={`gov-rewards-card-${pool?.prizePool.address}`}
            playersDepositDataIsFetched={playersDepositDataIsFetched}
            playersDepositData={playersDepositData}
            usersAddress={usersAddress}
            refetch={refetchAllPoolTokenData}
            pool={pool}
          />
        ))}
      </RewardsTable>
    </>
  )
}

const HashHighlightable = (props) => {
  const { children, className, id } = props
  const [highlight, setHighlight] = useState()

  useEffect(() => {
    const hashId = window.location.hash

    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (hashId === `#${id}`) {
          setHighlight(true)
        }
      }, 1000)

      setTimeout(() => {
        setHighlight(false)
      }, 5000)
    }
  }, [])

  return (
    <div className={classnames(className, 'relative')}>
      <motion.div
        id={id}
        className={'absolute h-full w-full t-0 l-0 r-0 b-0 rounded-lg'}
        animate={highlight ? 'enter' : 'exit'}
        transition={{ repeat: 3, duration: 0.3, repeatType: 'reverse', ease: 'backInOut' }}
        variants={{
          enter: {
            backgroundColor: 'rgba(255, 130, 255, 0.3)',
            scaleX: 1.02,
            scaleY: 1.05
          },
          exit: {
            backgroundColor: 'rgba(255, 130, 255, 0)',
            scaleX: 1,
            scaleY: 1
          }
        }}
      />
      {children}
    </div>
  )
}

const RewardsPoolRow = (props) => {
  const { t } = useTranslation()

  const { isSponsorship, pool, usersAddress, playersDepositData, refetch } = props

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

  const poolTicketData = playersDepositData?.find((t) => t.poolAddress === pool?.prizePool.address)
  const playersTicketData = poolTicketData?.ticket
  const playersSponsorshipData = poolTicketData?.sponsorship

  const error = false

  let remainingColumnsContents, stakingAprJsx

  if (error) {
    console.error(error)
    remainingColumnsContents = <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
  } else {
    stakingAprJsx = <RewardsPoolAPR {...props} pool={pool} />

    remainingColumnsContents = (
      <RewardsPoolMainContent
        {...props}
        walletOnWrongNetwork={walletOnWrongNetwork}
        refetch={refetchWithAllowance}
        playersPoolDepositData={isSponsorship ? playersSponsorshipData : playersTicketData}
        usersTokenDataForPool={usersTokenDataForPool}
        usersChainDataIsFetched={usersChainDataIsFetched}
        underlyingToken={underlyingToken}
      />
    )
  }

  return (
    <RewardsTableRow
      chainId={pool?.chainId}
      columnOneWidthClass='w-32 lg:w-64'
      columnOneImage={<UnderlyingTokenImage {...props} className='mr-0 sm:mr-3' />}
      columnOneContents={<ColumnOneContents {...props} />}
      columnTwoContents={stakingAprJsx}
      remainingColumnsContents={remainingColumnsContents}
    />
  )
}

const ColumnOneContents = (props) => {
  const { pool } = props

  let symbol = pool?.symbol

  if (symbol === 'PT-stPOOL') {
    // override for POOL pool as our symbol shows staking pool, but the token ticker was requested instead
    symbol = 'pPOOL'
  } else if (symbol === 'USDT-0x887E17') {
    // override for USDT Polygon pool
    symbol = 'Polygon Tether'
  }

  return (
    <div className='flex flex-col justify-center leading-none'>
      <div className='text-sm font-bold mt-3 sm:mt-0'>{pool?.name}</div>
      <div className='text-xs mt-1 opacity-80 text-accent-1'>{symbol}</div>
    </div>
  )
}

const RewardsPoolMainContent = (props) => {
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

  // TODO: Multi-faucet
  const tokenFaucet = pool?.tokenFaucets?.[0]
  const tokenFaucetAddress = tokenFaucet?.address

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
        centerContentJsx={<DripTokenDisplay {...props} pool={pool} />}
        bottomContentJsx={
          <ClaimButton
            {...props}
            refetch={refetch}
            chainId={pool?.chainId}
            name={name}
            dripTokenSymbol={tokenFaucet?.dripToken.symbol}
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
    dripTokenSymbol,
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
      t('claimTickerFromPool', { ticker: dripTokenSymbol, poolName: name }),
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
        className={classnames('trans trans-fast', {
          'text-flashy': txPending && !txCompleted,
          'underline text-accent-1 hover:text-green': !txPending || txCompleted
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
  const { pool } = props

  if (!pool) {
    return null
  }

  return (
    <>
      <UnderlyingTokenImage {...props} />
      <span className='text-xxs uppercase'>{pool.tokens.underlyingToken.symbol}</span>
    </>
  )
}

const UnderlyingTokenImage = (props) => {
  const { className, pool } = props
  const sizeClasses = props.sizeClasses ?? 'w-8 h-8'

  if (!pool) {
    return null
  }

  const token = pool.tokens.underlyingToken

  return (
    <PoolCurrencyIcon
      symbol={token.symbol}
      address={token.address}
      className={classnames(className, sizeClasses, 'relative inline-block')}
    />
  )
}

const DripTokenDisplay = (props) => {
  const { pool } = props
  const sizeClasses = props.sizeClasses ?? 'w-4 h-4'

  if (!pool) {
    return null
  }

  // TODO: Multi-faucet
  const faucetToken = pool.tokenFaucets?.[0]

  if (!faucetToken?.dripToken) {
    return null
  }

  const dripToken = faucetToken.dripToken

  return (
    <>
      <PoolCurrencyIcon
        symbol={dripToken.symbol}
        address={dripToken.address}
        className={sizeClasses}
      />
      <span className='text-xxs uppercase'>{dripToken.symbol}</span>
    </>
  )
}

const ManageStakedAmount = (props) => {
  const { t } = useTranslation()
  const {
    pool,
    isSponsorship,
    playersPoolDepositData,
    playersDepositDataIsFetched,
    usersTokenDataForPool,
    usersChainDataIsFetched,
    usersAddress
  } = props

  const playersDepositBalance = playersPoolDepositData?.amount || '0.00'
  const playersTokenBalance = usersTokenDataForPool.usersTokenBalance || '0.00'
  const allowance = usersTokenDataForPool?.usersTokenAllowance

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

  useEffect(() => {
    setDepositModalIsOpen(false)
    setWithdrawModalIsOpen(false)
  }, [usersAddress])

  return (
    <>
      <RewardsTableCell
        label={t(isSponsorship ? 'yourSponsorship' : 'yourStake')}
        topContentJsx={
          <ContentOrSpinner isLoading={usersAddress && !playersDepositDataIsFetched}>
            <PoolNumber>{numberWithCommas(playersDepositBalance)}</PoolNumber>
          </ContentOrSpinner>
        }
        centerContentJsx={<UnderlyingTokenDisplay {...props} sizeClasses='w-4 h-4' />}
        bottomContentJsx={
          <WithdrawTriggers {...props} openWithdrawModal={() => setWithdrawModalIsOpen(true)} />
        }
      />

      <div className='hidden sm:flex flex-col items-center sm:w-2 w-4'>
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
        centerContentJsx={<UnderlyingTokenDisplay {...props} sizeClasses='w-4 h-4' />}
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
      <WithdrawModal
        {...props}
        isOpen={withdrawModalIsOpen}
        closeModal={() => setWithdrawModalIsOpen(false)}
        // refetch={refetch}
        // playersTokenBalance={playersTokenBalance}
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

  const { isSponsorship, openWithdrawModal, pool, walletOnWrongNetwork, playersPoolDepositData } =
    props
  const router = useRouter()

  const pushRouteToTicketManage = () => {
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

  const handleManageClick = (e) => {
    e.preventDefault()
    isSponsorship ? openWithdrawModal() : pushRouteToTicketManage()
  }

  const noBalance = !playersPoolDepositData || playersPoolDepositData?.amountUnformatted.isZero()

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

// Withdraw in modal currently only supported for Sponsorship deposits
// Ticket deposits flow through the same 'Withdraw' as Account -> Manage ticket, as they have
// exit fees to consider
const WithdrawModal = (props) => {
  const { t } = useTranslation()

  const { isSponsorship, pool, usersAddress, playersPoolDepositData } = props

  if (!pool) {
    return null
  }

  const { tokens } = pool
  const { sponsorship, ticket, underlyingToken } = tokens

  const maxAmount = playersPoolDepositData?.amount || 0
  const maxAmountUnformatted = playersPoolDepositData?.amountUnformatted || bn(0)

  const decimals = ticket.decimals
  const tickerUpcased = ticket.symbol?.toUpperCase()

  const tokenAddress = isSponsorship ? sponsorship.address : ticket.address
  return (
    <RewardsActionModal
      {...props}
      tickerUpcased={tickerUpcased}
      underlyingToken={underlyingToken}
      action={t('withdraw')}
      maxAmount={maxAmount}
      maxAmountUnformatted={maxAmountUnformatted}
      pool={pool}
      method='withdrawInstantlyFrom'
      overMaxErrorMsg={t('pleaseEnterAmountLowerThanTicketBalance')}
      tokenImage={
        <PoolCurrencyIcon
          symbol={underlyingToken.symbol}
          address={underlyingToken.address}
          className='relative inline-block w-8 h-8 mb-2'
        />
      }
      getParams={(quantity) => [
        usersAddress,
        ethers.utils.parseUnits(quantity, decimals),
        tokenAddress,
        ethers.constants.Zero
      ]}
    />
  )
}

const DepositModal = (props) => {
  const { t } = useTranslation()
  const {
    isSponsorship,
    pool,
    playersTokenBalance,
    usersTokenDataForPool,
    usersAddress,
    underlyingToken
  } = props

  if (!pool || !underlyingToken) {
    return null
  }

  const maxAmount = playersTokenBalance
  const maxAmountUnformatted = usersTokenDataForPool.usersTokenBalanceUnformatted

  const decimals = underlyingToken?.decimals

  const ticket = pool?.tokens?.ticket
  const sponsorship = pool?.tokens?.sponsorship
  const tokenAddress = isSponsorship ? sponsorship.address : ticket.address

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
        <PoolCurrencyIcon
          symbol={underlyingToken.symbol}
          address={underlyingToken.address}
          className='relative inline-block w-8 h-8 mb-2'
        />
      }
      getParams={(quantity) => [
        usersAddress,
        ethers.utils.parseUnits(quantity, decimals),
        tokenAddress,
        ethers.constants.AddressZero
      ]}
    />
  )
}

const RewardsPoolAPR = (props) => {
  const { pool } = props

  // TODO: Multi-faucet
  const tokenFaucet = pool?.tokenFaucets?.[0]
  let apr = tokenFaucet?.apr

  if (!pool || !apr) {
    return (
      <span className={classnames('flex')}>
        <ThemedClipSpinner size={12} />
      </span>
    )
  }

  apr = displayPercentage(apr)

  return <RewardsTableAprDisplay {...props} isPrize apr={apr} />
}
