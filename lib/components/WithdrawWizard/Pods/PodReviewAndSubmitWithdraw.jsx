import React, { useCallback } from 'react'
import { ethers } from 'ethers'
import { useTokenBalance, usePodShareBalance } from '@pooltogether/hooks'
import { Card } from '@pooltogether/react-components'
import {
  getMinPrecision,
  getPrecision,
  numberWithCommas,
  underlyingAmountToSharesAmount
} from '@pooltogether/utilities'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { Trans, useTranslation } from 'react-i18next'
import Image from 'next/image'

import PodAbi from 'abis/PodAbi'
import { ReviewAndSubmitWithdraw } from 'lib/components/WithdrawWizard/ReviewAndSubmitWithdraw'
import { usePodExitFee } from 'lib/hooks/usePodExitFee'
import { useSendTransactionWrapper } from 'lib/hooks/useSendTransactionWrapper'
import { calculateOdds } from 'lib/utils/calculateOdds'
import { useAllUsersPodTickets } from 'lib/hooks/useAllUsersPodTickets'

import Bell from 'images/bell-red@2x.png'

export const PodReviewAndSubmitWithdraw = (props) => {
  const { pod, contractAddress, quantity, prevTicketBalance, nextStep } = props
  const chainId = pod.metadata.chainId
  const podAddress = pod.pod.address
  const {
    symbol: tokenSymbol,
    address: underlyingTokenAddress,
    decimals
  } = pod.tokens.underlyingToken

  const { t } = useTranslation()
  const sendTx = useSendTransactionWrapper()
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)

  const { address: usersAddress } = useOnboard()

  const { refetch: refetchAllPodTickets } = useAllUsersPodTickets(usersAddress)
  const { refetch: refetchPodShareBalance } = usePodShareBalance(chainId, usersAddress, podAddress)

  const { data: podExitFee, isFetched: isExitFeeFetched } = usePodExitFee(
    chainId,
    podAddress,
    underlyingTokenAddress,
    quantityUnformatted,
    decimals
  )

  const { data: usersPodShareBalance, isFetched: isPodShareBalanceFetched } = usePodShareBalance(
    chainId,
    usersAddress,
    podAddress
  )

  const submitWithdrawTransaction = useCallback(async () => {
    if (!isExitFeeFetched || !isPodShareBalanceFetched) {
      return null
    }

    const quantityInShares = underlyingAmountToSharesAmount(
      quantityUnformatted,
      usersPodShareBalance.shares.totalSupplyUnformatted,
      usersPodShareBalance.podUnderlyingTokenBalance.amountUnformatted.add(
        usersPodShareBalance.podUnderlyingTicketBalance.amountUnformatted
      )
    )

    const params = [quantityInShares, podExitFee.fee]
    const txName = `${t('withdraw')} ${numberWithCommas(quantity)} ${tokenSymbol}`

    return await sendTx({
      name: txName,
      contractAbi: PodAbi,
      contractAddress,
      method: 'withdraw',
      params,
      callbacks: {
        onSuccess: () => {
          nextStep()
        },
        refetch: () => {
          refetchAllPodTickets()
          refetchPodShareBalance()
        }
      }
    })
  }, [
    isExitFeeFetched,
    podExitFee,
    quantityUnformatted,
    contractAddress,
    isPodShareBalanceFetched,
    usersPodShareBalance?.pricePerShare
  ])

  return (
    <ReviewAndSubmitWithdraw
      {...props}
      hasExitFee={isExitFeeFetched && !podExitFee?.fee.isZero()}
      cards={[
        <PodWithdrawCard
          quantity={quantity}
          prevTicketBalance={prevTicketBalance}
          pod={pod}
          fee={podExitFee?.fee}
          float={podExitFee?.float}
          isFetched={isExitFeeFetched}
        />,
        <ExitFeeWarningCard
          quantity={quantity}
          pod={pod}
          fee={podExitFee?.fee}
          float={podExitFee?.float}
          isFetched={isExitFeeFetched}
        />
      ]}
      label={t('withdrawTokenFromPod', { token: tokenSymbol })}
      quantity={quantity}
      tokenSymbol={tokenSymbol}
      submitWithdrawTransaction={submitWithdrawTransaction}
    />
  )
}

const PodWithdrawCard = (props) => {
  return (
    <Card
      className='flex flex-col mx-auto mb-8'
      backgroundClassName='bg-functional-red'
      sizeClassName='w-full xs:w-96'
      paddingClassName='p-4 xs:py-6 xs:px-8'
    >
      <FinalBalance {...props} />
      <Odds {...props} />
      <PricePerShare {...props} />
      <ExitFee {...props} />
    </Card>
  )
}

const FinalBalance = (props) => {
  const { pod, quantity, prevTicketBalance } = props

  const decimals = pod.tokens.underlyingToken.decimals
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)
  const prevTicketBalanceUnformatted = ethers.utils.parseUnits(prevTicketBalance, decimals)

  const { t } = useTranslation()

  const finalBalanceUnformatted = prevTicketBalanceUnformatted.sub(quantityUnformatted)
  const finalBalance = finalBalanceUnformatted.isZero()
    ? 0
    : numberWithCommas(finalBalanceUnformatted, {
        decimals,
        precision: getMinPrecision(ethers.utils.formatUnits(finalBalanceUnformatted, decimals))
      })

  return <SummaryItem title={`${t('finalBalance')}:`} content={finalBalance} />
}

const Odds = (props) => {
  const { pod, quantity } = props

  const { address: usersAddress } = useOnboard()

  const chainId = pod.metadata.chainId
  const podAddress = pod.pod.address
  const decimals = pod.tokens.underlyingToken.decimals
  const numberOfWinners = pod.prizePool.config.numberOfWinners
  const { t } = useTranslation()

  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)

  const ticketTotalSupplyUnformatted = pod.prizePool.tokens.ticket.totalSupplyUnformatted
  const sponsorshipTotalSupplyUnformatted = pod.prizePool.tokens.sponsorship.totalSupplyUnformatted
  const totalSupplyUnformatted = ticketTotalSupplyUnformatted
    .add(sponsorshipTotalSupplyUnformatted)
    .sub(quantityUnformatted)

  const { data: podsBalance, isFetched: isPodBalanceFetched } = useTokenBalance(
    chainId,
    podAddress,
    pod.prizePool.tokens.ticket.address
  )

  const { data: usersBalance, isFetched: isUsersBalanceFetched } = useTokenBalance(
    chainId,
    usersAddress,
    podAddress
  )

  if (!isPodBalanceFetched || !isUsersBalanceFetched) {
    return <SummaryItem title={`${t('updatedOdds')}:`} content={'--'} />
  }

  const isBalanceZero = usersBalance.amountUnformatted.sub(quantityUnformatted).isZero()

  if (isBalanceZero) {
    return <SummaryItem title={`${t('updatedOdds')}:`} content={0} />
  }

  const odds = calculateOdds(
    podsBalance.amountUnformatted.sub(quantityUnformatted),
    totalSupplyUnformatted,
    decimals,
    numberOfWinners
  )
  const formattedOdds = numberWithCommas(odds, {
    decimals: getMinPrecision(odds, { additionalDigits: getPrecision(odds) })
  })

  return (
    <SummaryItem title={`${t('updatedOdds')}:`} content={t('oneInOdds', { odds: formattedOdds })} />
  )
}

const PricePerShare = (props) => {
  const { pod } = props

  const { address: usersAddress } = useOnboard()

  const chainId = pod.metadata.chainId
  const podAddress = pod.pod.address
  const decimals = pod.tokens.underlyingToken.decimals

  const { t } = useTranslation()

  const { data: usersPodShareBalance, isFetched: isPodShareBalanceFetched } = usePodShareBalance(
    chainId,
    usersAddress,
    podAddress
  )

  if (!isPodShareBalanceFetched) {
    return <SummaryItem title={`${t('pricePerShare', 'Price per share')}:`} content={'--'} />
  }

  const pricePerShare = usersPodShareBalance.pricePerShare
  const pricePerSharePretty = numberWithCommas(pricePerShare, {
    decimals,
    precision: getMinPrecision(ethers.utils.formatUnits(pricePerShare, decimals))
  })

  return (
    <SummaryItem
      title={`${t('pricePerShare', 'Price per share')}:`}
      content={pricePerSharePretty}
    />
  )
}

const ExitFee = (props) => {
  const { pod, fee } = props
  const { t } = useTranslation()

  if (!fee) {
    return <SummaryItem title={`${t('exitFee')}:`} content={`--`} />
  }

  const tokenSymbol = pod.tokens.underlyingToken.symbol
  const decimals = pod.tokens.underlyingToken.decimals
  const exitFee = ethers.utils.formatUnits(fee, decimals)

  return <SummaryItem title={`${t('exitFee')}:`} content={`${exitFee} ${tokenSymbol}`} />
}

const SummaryItem = (props) => (
  <div className='flex flex-row justify-between'>
    <span className='opacity-70 text-left'>{props.title}</span>
    <span className='font-bold'>{props.content}</span>
  </div>
)

const ExitFeeWarningCard = (props) => {
  const { isFetched, fee, float, pod } = props

  const { t } = useTranslation()

  if (!isFetched || fee?.isZero()) return null

  const decimals = pod.tokens.underlyingToken.decimals
  const tokenSymbol = pod.tokens.underlyingToken.symbol
  const formattedFee = numberWithCommas(fee, { decimals })
  const formattedFloat = numberWithCommas(float.amountUnformatted, { decimals })

  if (float.amountUnformatted.isZero()) {
    return (
      <Card
        className='flex flex-col mx-auto mb-8'
        backgroundClassName='bg-orange-darkened'
        sizeClassName='w-full xs:w-96'
        paddingClassName='p-4 xs:py-6 xs:px-8'
      >
        <Image className='mx-auto h-8 mb-4 text-xs sm:text-base' src={Bell} />
        <p>{t('noFundsInFloat')}</p>
      </Card>
    )
  }

  return (
    <Card
      className='flex flex-col mx-auto mb-8'
      backgroundClassName='bg-orange-darkened'
      sizeClassName='w-full xs:w-96'
      paddingClassName='p-4 xs:py-6 xs:px-8'
    >
      <Image className='mx-auto h-8 mb-4 text-xs sm:text-base' src={Bell} />
      <p>
        <Trans
          i18nKey='avoidPayingPodExitFee'
          values={{
            fee: `${formattedFee} ${tokenSymbol}`,
            float: `${formattedFloat} ${tokenSymbol}`
          }}
          components={{ b: <b /> }}
        />
      </p>
    </Card>
  )
}
