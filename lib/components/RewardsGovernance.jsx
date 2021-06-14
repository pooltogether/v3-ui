import React, { useState } from 'react'
import classnames from 'classnames'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { ethers } from 'ethers'
import { Trans, useTranslation } from 'react-i18next'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'

import { PoolNumber } from 'lib/components/PoolNumber'
import {
  RewardsTable,
  RewardsTableRow,
  RewardsTableCell,
  RewardsTableAprDisplay
} from 'lib/components/RewardsTable'
import { RewardsActionModal } from 'lib/components/RewardsActionModal'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { Tooltip } from 'lib/components/Tooltip'
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
import { getUsersTokenDataForPool } from 'lib/utils/getUsersTokenDataForPool'

const bn = ethers.BigNumber.from

export const RewardsGovernance = () => {
  const { t } = useTranslation()

  const { data: pools, isFetched: poolIsFetched } = useGovernancePools()
  const pool = pools?.find((pool) => pool.symbol === 'PT-stPOOL')
  const usersAddress = useUsersAddress()
  const { data: playerTickets, isFetched: playerTicketsIsFetched } =
    useUserTicketsFormattedByPool(usersAddress)

  const { refetch: refetchTotalClaimablePool } = useClaimableTokenFromTokenFaucets(
    NETWORK.mainnet,
    usersAddress
  )
  const { refetch: refetchPoolTokenData } = usePoolTokenData(usersAddress)

  const refetchAllPoolTokenData = () => {
    console.log('running refresh!')
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

      <RewardsTable columnOneWidthClass='sm:w-32 lg:w-64'>
        <GovRewardsCard
          playerTickets={playerTickets}
          usersAddress={usersAddress}
          refetchAllPoolTokenData={refetchAllPoolTokenData}
          key={`gov-rewards-card-${pool?.prizePool.address}`}
          pool={pool}
        />

        {/* eventually ... */}
        {/* {faucets.map((faucet) => (
          <GovRewardsCard
            playerTickets={playerTickets}
            usersAddress={usersAddress}
            refetchAllPoolTokenData={refetchAllPoolTokenData}
            key={`gov-rewards-card-${faucet.pool?.prizePool.address}`}
            pool={faucet.pool}
          />
        ))} */}
      </RewardsTable>
    </>
  )
}

const GovRewardsCard = (props) => {
  const { t } = useTranslation()

  const { pool, usersAddress, playerTickets } = props

  const underlyingToken = pool?.tokens?.underlyingToken

  const { data: usersChainData } = useUsersTokenBalanceAndAllowance(
    pool?.chainId,
    usersAddress,
    underlyingToken?.address,
    pool?.prizePool.address
  )
  const usersTokenDataForPool = getUsersTokenDataForPool(pool, usersChainData)

  const poolTicketData = playerTickets?.find((t) => t.poolAddress === pool?.prizePool.address)
  const playersTicketData = poolTicketData?.ticket

  const error = false

  let mainContent, stakingAprJsx
  // don't do this ... ?
  if (!pool) {
    mainContent = <ThemedClipSpinner size={16} />
  } else if (error) {
    mainContent = <p className='text-xxs'>{t('errorFetchingDataPleaseTryAgain')}</p>
  } else {
    stakingAprJsx = <GovRewardsAPR pool={pool} />

    mainContent = (
      <GovPoolRewardsMainContent
        {...props}
        playersTicketData={playersTicketData}
        usersTokenDataForPool={usersTokenDataForPool}
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
      remainingColumnsContents={mainContent}
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

  return (
    <div className='flex flex-col justify-center leading-none'>
      <div className='text-sm font-bold mt-3 sm:mt-0'>{pool?.name}</div>
      <div className='text-xs mt-1'>{pool?.symbol}</div>
    </div>
  )
}

const GovPoolRewardsMainContent = (props) => {
  const usersAddress = useUsersAddress()

  return (
    <>
      <ClaimTokens {...props} usersAddress={usersAddress} />
      <ManageStakedAmount {...props} />
    </>
  )
}

const ClaimTokens = (props) => {
  const { t } = useTranslation()

  const { usersAddress, pool, refetchAllPoolTokenData, underlyingToken } = props

  const tokenFaucetAddress = pool.tokenListener.address
  const { data: claimablePoolData, isFetched } = useClaimableTokenFromTokenFaucet(
    pool.chainId,
    tokenFaucetAddress,
    usersAddress
  )

  const claimable = claimablePoolData?.claimableAmount
  const claimableUnformatted = claimablePoolData?.claimableAmountUnformatted
  const hasClaimable = !claimableUnformatted?.isZero()

  const name = t('prizePoolTicker', { ticker: underlyingToken.symbol })

  return (
    <>
      <RewardsTableCell
        label={t('rewards')}
        topContentJsx={
          isFetched ? (
            <PoolNumber>{numberWithCommas(claimable)}</PoolNumber>
          ) : (
            <ThemedClipSpinner size={12} />
          )
        }
        centerContentJsx={<UnderlyingTokenDisplay {...props} pool={pool} />}
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
  const { usersAddress, dripToken, name, refetch, claimable, tokenFaucetAddress, chainId } = props

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

  const walletOnWrongNetwork = walletChainId !== chainId

  const button = (
    <button
      disabled={!claimable || walletOnWrongNetwork}
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

const UnderlyingTokenDisplay = (props) => {
  const { pool, underlyingToken } = props

  return (
    <>
      <Erc20Image address={pool.tokens.tokenFaucetDripToken.address} sizeClasses='w-4 h-4' />
      <span className='text-xxs uppercase'>{underlyingToken?.symbol}</span>
    </>
  )
}

const ManageStakedAmount = (props) => {
  const { t } = useTranslation()
  const { pool, playersTicketData, usersTokenDataForPool } = props

  const playersTicketBalance = playersTicketData?.amount || 0

  const playersTokenBalance = usersTokenDataForPool.usersTokenBalance || 0

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

  return (
    <>
      <RewardsTableCell
        label={t('wallet')}
        topContentJsx={<PoolNumber>{numberWithCommas(playersTokenBalance)}</PoolNumber>}
        centerContentJsx={<UnderlyingTokenDisplay {...props} pool={pool} />}
        bottomContentJsx={
          <WithdrawTriggers openWithdrawModal={() => setWithdrawModalIsOpen(true)} />
        }
      />

      <div className='hidden sm:flex flex-col items-center sm:w-10 lg:w-20'>
        <div className='border-default h-20 opacity-20' style={{ borderRightWidth: 1 }}>
          &nbsp;
        </div>
      </div>

      <RewardsTableCell
        label={t('yourStake')}
        topContentJsx={<PoolNumber>{numberWithCommas(playersTicketBalance)}</PoolNumber>}
        centerContentJsx={<UnderlyingTokenDisplay pool={pool} />}
        bottomContentJsx={
          <DepositTriggers
            {...props}
            openDepositModal={() => setDepositModalIsOpen(true)}
            openWithdrawModal={() => setWithdrawModalIsOpen(true)}
          />
        }
      />

      <DepositModal
        {...props}
        chainId={pool.chainId}
        isOpen={depositModalIsOpen}
        closeModal={() => setDepositModalIsOpen(false)}
        playersTokenBalance={playersTokenBalance}
      />

      <WithdrawModal
        {...props}
        chainId={pool.chainId}
        isOpen={withdrawModalIsOpen}
        closeModal={() => setWithdrawModalIsOpen(false)}
        playersTicketBalance={playersTicketBalance}
      />
    </>
  )
}

// const EnableDepositsButton = (props) => {
//   const { t } = useTranslation()
//   const { stakingPoolChainData, stakingPoolAddresses, refetch, chainId } = props

//   const { prizePool, underlyingToken } = stakingPoolAddresses

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
  const { openDepositModal } = props

  return (
    <button className='capitalize underline hover:text-green' onClick={openDepositModal}>
      {t('deposit')}
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

const WithdrawModal = (props) => {
  const { t } = useTranslation()
  const { underlyingToken, playersTicketBalance, playersTicketData, usersAddress } = props

  const maxAmount = playersTicketBalance
  const maxAmountUnformatted = playersTicketData?.amountUnformatted || bn(0)

  const decimals = underlyingToken?.decimals

  // // there should be no exit fee when we do an instant no-fee withdrawal
  // const maxExitFee = '0'

  // const params = [
  //   usersAddress,
  //   ethers.utils.parseUnits(quantity.toString(), Number(decimals)),
  //   controlledTicketTokenAddress,
  //   ethers.utils.parseEther(maxExitFee)
  // ]

  return (
    <RewardsActionModal
      {...props}
      action={t('withdraw')}
      maxAmount={maxAmount}
      maxAmountUnformatted={maxAmountUnformatted}
      method='withdrawInstantlyFrom'
      getParams={(quantity) => [
        usersAddress,
        ethers.utils.parseUnits(quantity, decimals),
        playersTicketData.address,
        ethers.constants.Zero
      ]}
    />
  )
}

const DepositModal = (props) => {
  const { t } = useTranslation()
  const { pool, playersTokenBalance, usersTokenDataForPool, usersAddress, underlyingToken } = props

  const maxAmount = playersTokenBalance
  const maxAmountUnformatted = usersTokenDataForPool.usersTokenBalanceUnformatted

  const decimals = underlyingToken.decimals

  const ticket = pool?.tokens?.ticket

  return (
    <RewardsActionModal
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

  return <RewardsTableAprDisplay apr={apr} />
}
