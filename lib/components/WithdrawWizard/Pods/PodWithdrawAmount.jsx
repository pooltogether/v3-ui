import React, { useEffect } from 'react'
import classnames from 'classnames'
import { useTokenBalance, useTokenBalances, useUsersAddress } from '@pooltogether/hooks'

import { WithdrawAmount } from 'lib/components/WithdrawWizard/WithdrawAmount'
import { useForm } from 'react-hook-form'
import { ethers } from 'ethers'
import {
  calculateUsersOdds,
  getMinPrecision,
  numberWithCommas,
  toNonScaledUsdString
} from '@pooltogether/utilities'
import { Odds } from 'lib/components/Odds'
import { Amount } from '@pooltogether/react-components'

export const PodWithdrawAmount = (props) => {
  const { pod, chainId, contractAddress, tokenAddress, nextStep, form } = props
  const tokenSymbol = pod.tokens.underlyingToken.symbol
  const decimals = pod.tokens.underlyingToken.decimals
  const podTicketTokenSymbol = pod.tokens.podStablecoin.symbol
  const podTicketAddress = pod.tokens.podStablecoin.address
  const poolTicketAddress = pod.tokens.ticket.address

  const usersAddress = useUsersAddress()
  const { data: usersBalance, isFetched: isUsersBalanceFetched } = useTokenBalances(
    chainId,
    usersAddress,
    [tokenAddress, podTicketAddress]
  )
  const { data: podTicketBalance, isFetched: isPodBalanceFetched } = useTokenBalance(
    chainId,
    contractAddress,
    poolTicketAddress
  )

  useEffect(() => {
    console.log('PodWithdrawAmount MOUNTED')
  }, [])

  useEffect(() => {
    console.log('usersBalance', usersBalance)
  }, [usersBalance])

  const isFetched = isUsersBalanceFetched && isPodBalanceFetched

  const { watch, formState } = form
  const quantity = watch('quantity', false)

  return (
    <>
      <WithdrawAmount
        decimals={decimals}
        chainId={chainId}
        usersAddress={usersAddress}
        form={form}
        usersBalance={usersBalance?.[podTicketAddress].amount}
        label={`Withdraw from the ${tokenSymbol} Pod`}
        tokenSymbol={podTicketTokenSymbol}
        tokenAddress={podTicketAddress}
        nextStep={nextStep}
      />
      <div className='flex mx-auto mt-8'>
        <PodWinningOdds
          isQuantityValid={formState.isValid}
          isFetched={isFetched}
          pod={pod}
          quantity={quantity}
          podBalanceUnformatted={podTicketBalance?.amountUnformatted}
        />
        <UsersPrize
          isQuantityValid={formState.isValid}
          isFetched={isFetched}
          pod={pod}
          quantity={quantity}
          usersBalanceUnformatted={usersBalance?.[podTicketAddress].amountUnformatted}
        />
      </div>
    </>
  )
}

const PodWinningOdds = (props) => {
  const { isQuantityValid, isFetched, pod, quantity, podBalanceUnformatted } = props

  if (!isFetched || !isQuantityValid) {
    return (
      <SmallCard className='mr-2'>
        <Title>Your winning odds:</Title>
        <Details>--</Details>
      </SmallCard>
    )
  }

  const decimals = pod.tokens.underlyingToken.decimals
  const numberOfWinners = pod.prizePool.config.numberOfWinners
  // Balance of pod
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)
  const podsNewBalanceUnformatted = podBalanceUnformatted.sub(quantityUnformatted)
  // Total supply of prize pool
  const ticketTotalSupplyUnformatted = pod.prizePool.tokens.ticket.totalSupplyUnformatted
  const sponsorshipTotalSupplyUnformatted = pod.prizePool.tokens.sponsorship.totalSupplyUnformatted
  const totalSupplyUnformatted = ticketTotalSupplyUnformatted
    .add(sponsorshipTotalSupplyUnformatted)
    .sub(quantityUnformatted)

  return (
    <SmallCard className='mr-2'>
      <Title>Pod winning odds:</Title>
      {podsNewBalanceUnformatted.isZero() ? (
        <Details>--</Details>
      ) : (
        <Odds
          ticketSupplyUnformatted={totalSupplyUnformatted}
          decimals={decimals}
          numberOfWinners={numberOfWinners}
          usersBalance={podsNewBalanceUnformatted}
        />
      )}
    </SmallCard>
  )
}

const UsersPrize = (props) => {
  const { isQuantityValid, isFetched, pod, quantity, usersBalanceUnformatted } = props

  const decimals = pod.tokens.underlyingToken.decimals
  const quantityUnformatted = ethers.utils.parseUnits(
    isQuantityValid ? quantity || '0' : '0',
    decimals
  )
  const usersNewBalanceUnformatted = usersBalanceUnformatted?.sub(quantityUnformatted)

  if (!isFetched || !isQuantityValid || !usersNewBalanceUnformatted) {
    return (
      <SmallCard className='ml-2'>
        <Title>Your prize if the pod wins:</Title>
        <Details>--</Details>
      </SmallCard>
    )
  }

  const singlePrizeScaled = pod.prize.totalValuePerWinnerUsdScaled.toNumber()
  const ticketTotalSupplyUnformatted = pod.tokens.ticket.totalSupplyUnformatted
  const sponsorshipTotalSupplyUnformatted = pod.tokens.sponsorship.totalSupplyUnformatted
  const totalSupplyUnformatted = ticketTotalSupplyUnformatted
    .add(sponsorshipTotalSupplyUnformatted)
    .sub(quantityUnformatted)

  const usersBalanceFloat = Number(
    ethers.utils.formatUnits(usersNewBalanceUnformatted, Number(decimals))
  )
  const totalSupplyFloat = Number(
    ethers.utils.formatUnits(totalSupplyUnformatted, Number(decimals))
  )
  const usersOwnershipPercentage = usersBalanceFloat / totalSupplyFloat
  const usersPrize = (singlePrizeScaled * usersOwnershipPercentage) / 100

  console.log(
    totalSupplyUnformatted.toString(),
    usersNewBalanceUnformatted.toString(),
    usersBalanceFloat,
    totalSupplyFloat,
    usersOwnershipPercentage,
    usersPrize
  )

  if (usersPrize <= 0) {
    return (
      <SmallCard className='ml-2'>
        <Title>Your prize if the pod wins:</Title>
        <Details>--</Details>
      </SmallCard>
    )
  }

  return (
    <SmallCard className='ml-2'>
      <Title>Your prize if the pod wins:</Title>
      <Details className='text-flashy'>
        $<Amount>{numberWithCommas(usersPrize, { decimals: 0, precision: 2 })}</Amount>
      </Details>
    </SmallCard>
  )
}

const SmallCard = (props) => (
  <div className={classnames('bg-card py-2 px-4 rounded flex flex-col', props.className)}>
    {props.children}
  </div>
)

const Title = (props) => <span className='text-center text-xs opacity-80'>{props.children}</span>
const Details = (props) => (
  <span className={classnames('text-center mt-2', props.className)}>{props.children}</span>
)
