import { ReviewAndSubmitWithdraw } from 'lib/components/WithdrawWizard/ReviewAndSubmitWithdraw'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { useTokenBalance, useUsersAddress } from '@pooltogether/hooks'
import { Card } from '@pooltogether/react-components'
import { ethers } from 'ethers'
import { getMinPrecision, getPrecision, numberWithCommas } from '@pooltogether/utilities'
import { Trans, useTranslation } from 'react-i18next'
import PodAbi from 'abis/PodAbi'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePodExitFee } from 'lib/hooks/usePodExitFee'
import { calculateOdds } from 'lib/utils/calculateOdds'
import Bell from 'assets/images/bell-red@2x.png'

export const PodReviewAndSubmitWithdraw = (props) => {
  const { pod, contractAddress, quantity } = props
  const chainId = pod.metadata.chainId
  const podAddress = pod.pod.address
  const {
    symbol: tokenSymbol,
    address: underlyingTokenAddress,
    decimals
  } = pod.tokens.underlyingToken

  const router = useRouter()
  const { t } = useTranslation()
  const sendTx = useSendTransaction()
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)

  const { data: podExitFee, isFetched: isExitFeeFetched } = usePodExitFee(
    chainId,
    podAddress,
    underlyingTokenAddress,
    quantityUnformatted,
    decimals
  )

  const submitWithdrawTransaction = useCallback(async () => {
    if (!isExitFeeFetched) {
      return null
    }

    const params = [quantityUnformatted, podExitFee.fee]
    const txName = `${t('withdraw')} ${numberWithCommas(quantity)} ${tokenSymbol}`

    return await sendTx(txName, PodAbi, contractAddress, 'withdraw', params)
  }, [isExitFeeFetched, podExitFee, quantityUnformatted, contractAddress])

  return (
    <ReviewAndSubmitWithdraw
      {...props}
      hasExitFee={isExitFeeFetched && !podExitFee?.fee.isZero()}
      cards={[
        <PodWithdrawCard
          quantity={quantity}
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
      <ExitFee {...props} />
    </Card>
  )
}

const FinalBalance = (props) => {
  const { pod, quantity } = props

  const usersAddress = useUsersAddress()
  const chainId = pod.metadata.chainId
  const podAddress = pod.pod.address
  const decimals = pod.tokens.underlyingToken.decimals
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)

  const { t } = useTranslation()

  const { data: usersBalance, isFetched: isPodBalanceFetched } = useTokenBalance(
    chainId,
    usersAddress,
    podAddress
  )

  if (!isPodBalanceFetched) {
    return <SummaryItem title={`${t('finalBalance')}:`} content={'--'} />
  }

  const finalBalanceUnformatted = usersBalance.amountUnformatted.sub(quantityUnformatted)
  const finalBalance = finalBalanceUnformatted.isZero()
    ? 0
    : numberWithCommas(finalBalanceUnformatted, { decimals })

  return <SummaryItem title={`${t('finalBalance')}:`} content={finalBalance} />
}

const Odds = (props) => {
  const { pod, quantity } = props

  const usersAddress = useUsersAddress()
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

  return <SummaryItem title={`${t('updatedOdds')}:`} content={`1 in ${formattedOdds}`} />
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
    <span className='opacity-70'>{props.title}</span>
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
        <img className='mx-auto h-8 mb-4 text-xs sm:text-base' src={Bell} />
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
      <img className='mx-auto h-8 mb-4 text-xs sm:text-base' src={Bell} />
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
