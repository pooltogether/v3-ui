import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import CountUp from 'react-countup'
import {
  APP_ENVIRONMENT,
  useAppEnv,
  useOnboard,
  useTokenBalance,
  useUsersAddress
} from '@pooltogether/hooks'
import {
  Amount,
  Button,
  Card,
  InternalLink,
  ThemedClipSpinner,
  TokenIcon,
  Tooltip
} from '@pooltogether/react-components'
import {
  getMinPrecision,
  getNetworkNiceNameByChainId,
  getPrecision,
  NETWORK,
  numberWithCommas
} from '@pooltogether/utilities'
import { usePreviousValue } from 'beautiful-react-hooks'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import TokenFaucetProxyFactoryAbi from '@pooltogether/pooltogether-contracts_3_3/abis/TokenFaucetProxyFactory'

import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { isSelfAtom } from 'lib/components/AccountUI'
import { IndexUILoader } from 'lib/components/loaders/IndexUILoader'
import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'
import { useAllTokenFaucetsByChainId } from 'lib/hooks/useAllTokenFaucetsByChainId'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useTokenDripClaimableAmounts } from 'lib/hooks/useTokenDripClaimableAmounts'

/**
 * A full card to be displayed on the account page.
 * Contains a list of all token faucets & a claim all POOL tokens button.
 * @param {*} props
 */
export const AccountTokenFaucets = (props) => {
  const { appEnv } = useAppEnv()
  const ethereumChainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  const usersAddress = useUsersAddress()
  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: tokenFaucetsByChainId, isFetched } = useAllTokenFaucetsByChainId()

  if (!isFetched) {
    return (
      <>
        <DepositRewardsTitle />
        <IndexUILoader />
      </>
    )
  }

  const chainIds = Object.keys(tokenFaucetsByChainId).map(Number)

  return (
    <>
      <DepositRewardsTitle />
      <Card>
        <ClaimAllPoolHeader address={address} chainId={ethereumChainId} />
        {chainIds.map((chainId) => (
          <TokenFaucetList
            key={chainId}
            chainId={chainId}
            tokenFaucets={tokenFaucetsByChainId[chainId]}
            usersAddress={address}
          />
        ))}
      </Card>
    </>
  )
}

/**
 * Renders the list of token faucets
 * @param {*} props
 */
const TokenFaucetList = (props) => {
  const { chainId, tokenFaucets, usersAddress } = props

  const {
    data: claimableAmounts,
    isFetched: isClaimableAmountsFetched,
    refetch
  } = useTokenDripClaimableAmounts(chainId, tokenFaucets, usersAddress)

  if (tokenFaucets.length === 0) {
    return null
  }

  return (
    <>
      <NetworkBadge
        chainId={chainId}
        textClassName='text-xs sm:text-base'
        sizeClassName='w-4 sm:w-6 h-4 sm:h-6'
        className='m-2 sm:m-0'
      />
      <ClaimablePoolTokenFaucetTableHeader />
      <ul>
        {tokenFaucets.map((tokenFaucet) => (
          <TokenFaucetItem
            key={tokenFaucet.addressToClaimFrom}
            chainId={chainId}
            tokenFaucet={tokenFaucet}
            usersAddress={usersAddress}
            isClaimableAmountFetched={isClaimableAmountsFetched}
            claimableAmount={claimableAmounts?.[tokenFaucet.addressToClaimFrom]}
            refetch={refetch}
          />
        ))}
      </ul>
    </>
  )
}

/**
 * A header for the token faucet list on large screens
 */
const ClaimablePoolTokenFaucetTableHeader = () => {
  const { t } = useTranslation()

  return (
    <div className='hidden sm:flex bg-card-selected justify-between rounded-lg px-4 sm:px-8 py-2 mt-5 text-xxs text-accent-1'>
      <Cell></Cell>
      <Cell>
        {t('asset')} &amp; {t('dailyRate')}
      </Cell>
      <Cell>APR</Cell>
      <Cell>{t('dailyEarnings')}</Cell>
      <Cell className='justify-end'>{t('rewards')}</Cell>
    </div>
  )
}

/**
 * Standardized cell sizing
 * @param {*} props
 */
const Cell = (props) => (
  <>
    {props.label && <span className='sm:hidden text-xxs text-accent-1'>{props.label}</span>}
    <div className={classnames('w-full flex px-1', props.className)}>{props.children}</div>
  </>
)

/**
 * List item of all stats & a claim button for token faucets
 * @param {*} props
 */
const TokenFaucetItem = (props) => (
  <li
    className='border-2 rounded-lg px-5 sm:px-7 py-6 flex flex-col sm:flex-row sm:justify-between mt-1 sm:items-center last:mb-8'
    style={{
      borderColor: '#43286e'
    }}
  >
    <LabelCell {...props} />
    <DailyTokenFaucetDripCell {...props} />
    <AprCell {...props} />
    <DailyEarningCell {...props} />
    <ClaimDripCell {...props} />
  </li>
)

/**
 * A cell to label token faucets by their pool or pod
 * @param {*} props
 */
const LabelCell = (props) => {
  const { chainId, tokenFaucet } = props
  const { label, as, href, tokens } = tokenFaucet
  const { underlyingToken } = tokens

  return (
    <Cell className='mb-4 sm:mb-0'>
      <InternalLink className='flex' Link={Link} as={as} href={href} shallow>
        <TokenIcon chainId={chainId} address={underlyingToken.address} className='mr-2 my-auto' />
        <span className='font-bold'>{label}</span>
      </InternalLink>
    </Cell>
  )
}

/**
 * Cell for displaying the APR of a token faucet
 * @param {*} props
 */
const AprCell = (props) => {
  const { tokenFaucet } = props
  const { apr } = tokenFaucet

  if (!apr || apr === 0) {
    return (
      <Cell className='opacity-20 mb-2 sm:mb-0'>
        <span>--</span>
        <span className='ml-2 sm:hidden'>APR</span>
      </Cell>
    )
  }

  return (
    <Cell className='mb-2 sm:mb-0'>
      <Amount>{numberWithCommas(apr, { precision: 2 })}</Amount>
      <span className='ml-1'>%</span>
      <span className='ml-2 sm:hidden'>APR</span>
    </Cell>
  )
}

/**
 * Daily token faucet drip cell router
 * @param {*} props
 */
const DailyTokenFaucetDripCell = (props) => {
  const { tokenFaucet } = props
  const { isPod } = tokenFaucet

  if (isPod) {
    return <PodDailyTokenFaucetDripCell {...props} />
  }

  return <PoolDailyTokenFaucetDripCell {...props} />
}

/**
 * A pods daily drip of tokens
 * @param {*} props
 */
const PodDailyTokenFaucetDripCell = (props) => {
  const { chainId, tokenFaucet } = props
  const { faucetDripPerDay, tokens } = tokenFaucet
  const { dripToken, ticket, podStablecoin } = tokens

  const { t } = useTranslation()

  const { data: podBalanceData, isFetched: isPodBalanceDataFetched } = useTokenBalance(
    chainId,
    podStablecoin.address,
    ticket.address
  )

  if (!isPodBalanceDataFetched) {
    return (
      <Cell label={`${t('asset')} & ${t('dailyRate')}`}>
        <ThemedClipSpinner />
      </Cell>
    )
  }

  const { amount, totalSupply } = podBalanceData

  const podsBalance = parseInt(amount, 10) || 0
  const ownershipPercentage = podsBalance / parseInt(totalSupply, 10)
  const podsDripPerDay = faucetDripPerDay * ownershipPercentage

  return (
    <Cell label={`${t('asset')} & ${t('dailyRate')}`} className='flex-wrap'>
      <TokenIcon chainId={chainId} address={dripToken.address} className='mr-2 my-auto' />
      <span className='mr-2'>
        <Amount>{numberWithCommas(podsDripPerDay, { precision: 2 })}</Amount>
      </span>
      <span>{dripToken.symbol}</span>
    </Cell>
  )
}

/**
 * Token faucets daily drip for a pool cell
 * @param {*} props
 */
const PoolDailyTokenFaucetDripCell = (props) => {
  const { chainId, tokenFaucet } = props
  const { faucetDripPerDay, tokens } = tokenFaucet
  const { dripToken } = tokens

  const { t } = useTranslation()

  return (
    <Cell label={`${t('asset')} & ${t('dailyRate')}`} className='flex-wrap'>
      <TokenIcon chainId={chainId} address={dripToken.address} className='mr-2 my-auto' />
      <span className='mr-2'>
        <Amount>{numberWithCommas(Math.round(faucetDripPerDay), { precision: 2 })}</Amount>
      </span>
      <span>{dripToken.symbol}</span>
    </Cell>
  )
}

/**
 * Daily earnings cell router
 * @param {*} props
 */
const DailyEarningCell = (props) => {
  const { tokenFaucet } = props
  const { isPod } = tokenFaucet

  if (isPod) {
    return <PodDailyEarningCell {...props} />
  }

  return <PoolDailyEarningCell {...props} />
}

/**
 * Users daily earnings cell for Pod token drops
 * @param {*} props
 */
const PodDailyEarningCell = (props) => {
  const { usersAddress, chainId, tokenFaucet } = props
  const { faucetDripPerDay, tokens } = tokenFaucet
  const { dripToken, ticket, podStablecoin } = tokens

  const { t } = useTranslation()

  const { data: podBalanceData, isFetched: isPodBalanceDataFetched } = useTokenBalance(
    chainId,
    podStablecoin.address,
    ticket.address
  )
  const { data: usersPodBalanceData, isFetched: isUsersPodBalanceData } = useTokenBalance(
    chainId,
    usersAddress,
    podStablecoin.address
  )

  const isFetched = isPodBalanceDataFetched && isUsersPodBalanceData

  if (!isFetched) {
    return (
      <Cell className='mb-4 sm:mb-0' label={t('dailyEarnings')}>
        <ThemedClipSpinner />
      </Cell>
    )
  }

  const podsBalance = parseInt(podBalanceData.amount, 10) || 0
  const podsOwnershipPercentage = podsBalance / parseInt(podBalanceData.totalSupply, 10)
  const podsDripPerDay = faucetDripPerDay * podsOwnershipPercentage

  const usersBalance = parseInt(usersPodBalanceData.amount, 10) || 0
  const usersOwnershipPercentage = usersBalance / parseInt(podBalanceData.totalSupply, 10)
  const usersDripPerDay = podsDripPerDay * usersOwnershipPercentage

  return (
    <UsersDripPerDay chainId={chainId} usersDripPerDay={usersDripPerDay} dripToken={dripToken} />
  )
}

/**
 * Users daily earnings cell for Pool token faucets
 * @param {*} props
 */
const PoolDailyEarningCell = (props) => {
  const { usersAddress, chainId, tokenFaucet } = props
  const { faucetDripPerDay, tokens } = tokenFaucet
  const { ticket, dripToken } = tokens

  const { data, isFetched } = useTokenBalance(chainId, usersAddress, ticket.address)

  if (!isFetched) {
    return (
      <Cell>
        <ThemedClipSpinner />
      </Cell>
    )
  }

  const { amount, totalSupply } = data

  const usersBalance = parseInt(amount, 10) || 0
  const ownershipPercentage = usersBalance / parseInt(totalSupply, 10)
  const usersDripPerDay = faucetDripPerDay * ownershipPercentage

  return (
    <UsersDripPerDay chainId={chainId} usersDripPerDay={usersDripPerDay} dripToken={dripToken} />
  )
}

const UsersDripPerDay = (props) => {
  const { chainId, usersDripPerDay, dripToken } = props

  const { t } = useTranslation()

  if (!usersDripPerDay || usersDripPerDay === 0) {
    return (
      <Cell
        label={usersDripPerDay === 0 ? undefined : t('dailyEarnings')}
        className={classnames('mb-4 sm:mb-0', {
          'hidden sm:flex': usersDripPerDay === 0
        })}
      >
        <TokenIcon chainId={chainId} address={dripToken.address} className='mr-2 my-auto' />
        <span className='opacity-20'>--</span>
      </Cell>
    )
  }

  return (
    <Cell label={t('dailyEarnings')} className='mb-4 sm:mb-0 flex-wrap'>
      <TokenIcon chainId={chainId} address={dripToken.address} className='mr-2 my-auto' />
      <span className='mr-2'>
        <Amount>{numberWithCommas(usersDripPerDay, { precision: 2 })}</Amount>
      </span>
      <span>{dripToken.symbol}</span>
    </Cell>
  )
}

/**
 * Claim drip trigger cell
 * @param {*} props
 */
const ClaimDripCell = (props) => {
  const { refetch, usersAddress, chainId, tokenFaucet, isClaimableAmountFetched, claimableAmount } =
    props
  const { label, tokens, addressToClaimFrom, abi } = tokenFaucet
  const { dripToken } = tokens

  const { t } = useTranslation()

  const isClaimable =
    isClaimableAmountFetched &&
    Boolean(claimableAmount) &&
    !claimableAmount.amountUnformatted.isZero()

  const noBalance = isClaimableAmountFetched && claimableAmount.amountUnformatted.isZero()

  return (
    <Cell
      label={noBalance ? null : t('availableToClaim')}
      className={classnames('flex-col', {
        'hidden sm:flex': noBalance
      })}
    >
      <div className='flex sm:justify-end mb-1'>
        <ClaimableAmount
          isFetched={isClaimableAmountFetched}
          isClaimable={isClaimable}
          {...claimableAmount}
        />
        <TokenIcon chainId={chainId} address={dripToken.address} className='ml-2 my-auto' />
      </div>
      <div className='flex sm:justify-end'>
        <ClaimButton
          isClaimable={isClaimable}
          usersAddress={usersAddress}
          dripToken={dripToken}
          label={label}
          refetch={refetch}
          addressToClaimFrom={addressToClaimFrom}
          chainId={chainId}
          abi={abi}
        />
      </div>
    </Cell>
  )
}

/**
 * Display of the claimable amount
 * @param {*} props
 */
const ClaimableAmount = (props) => {
  const { isFetched, amountUnformatted, amount, isClaimable } = props
  if (!isFetched) {
    return <ThemedClipSpinner />
  } else if (amountUnformatted.isZero()) {
    return <span className='opacity-30'>--</span>
  }
  return <span className='font-bold text-base'>{numberWithCommas(amount)}</span>
}

/**
 * A claim button used for claiming the token drips for each token faucet
 * @param {*} props
 */
const ClaimButton = (props) => {
  const { usersAddress, dripToken, label, refetch, isClaimable, addressToClaimFrom, chainId, abi } =
    props

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
      t('claimTickerFromPool', { ticker: dripToken.symbol, poolName: label }),
      abi,
      addressToClaimFrom,
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
  const disabled = !isClaimable || walletOnWrongNetwork

  return (
    <Tooltip
      isEnabled={walletOnWrongNetwork}
      id={`account-gov-claims-wrong-network-tooltip-${getNetworkNiceNameByChainId(chainId)}`}
      tip={t('yourWalletIsOnTheWrongNetwork', {
        networkName: getNetworkNiceNameByChainId(chainId)
      })}
    >
      <button
        disabled={disabled}
        className={classnames('underline trans', {
          'text-flashy': txPending,
          'text-highlight-1 hover:text-inverse': !txPending && !disabled,
          'opacity-30': disabled
        })}
        onClick={handleClaim}
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
 * Styled title for the card
 */
const DepositRewardsTitle = () => {
  const { t } = useTranslation()

  return (
    <div
      id='governance-claims'
      className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-sm'
    >
      {t('depositRewards')}
    </div>
  )
}

/**
 * Header in the card for claiming all POOL tokens on ethereum
 * @param {*} props
 */
const ClaimAllPoolHeader = (props) => {
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
      <div className='flex justify-between flex-col sm:flex-row p-2 sm:p-0 mb-8 '>
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
          {isSelf && (
            <ClaimAllButton
              {...props}
              chainId={chainId}
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
    </>
  )
}

/**
 * Claimable amount counter for cleanliness
 * @param {*} props
 */
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

/**
 * Claims from all POOL token faucets
 * @param {*} props
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
