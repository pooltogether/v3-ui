import React from 'react'
import { ethers } from 'ethers'
import classnames from 'classnames'
import { useTokenBalances, useUsersAddress } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'

import { DepositAmount } from 'lib/components/DepositWizard/DepositAmount'
import { Odds } from 'lib/components/Odds'
import IconTarget from 'assets/images/icon-target@2x.png'

export const PoolDepositAmount = (props) => {
  const { quantity: queryQuantity, pool, chainId, tokenAddress, nextStep, form } = props
  const tokenSymbol = pool.tokens.underlyingToken.symbol
  const poolTicketAddress = pool.tokens.ticket.address
  const decimals = pool.tokens.underlyingToken.decimals

  const { t } = useTranslation()

  const usersAddress = useUsersAddress()
  const { data: usersBalance, isFetched: isUsersBalanceFetched } = useTokenBalances(
    chainId,
    usersAddress,
    [tokenAddress, poolTicketAddress]
  )

  const { watch, formState } = form
  const quantity = watch('quantity', false)

  return (
    <>
      <DepositAmount
        chainId={chainId}
        usersAddress={usersAddress}
        form={form}
        usersTicketBalance={usersBalance?.[poolTicketAddress].amount}
        usersUnderlyingBalance={usersBalance?.[tokenAddress].amount}
        label={t('depositIntoPool', { token: tokenSymbol })}
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        decimals={decimals}
        nextStep={nextStep}
        quantity={queryQuantity}
      />
      <UsersWinningOdds
        usersAddress={usersAddress}
        isQuantityValid={formState.isValid}
        isFetched={isUsersBalanceFetched}
        usersTicketBalanceUnformatted={usersBalance?.[poolTicketAddress].amountUnformatted}
        quantity={quantity}
        underlyingToken={pool.tokens.underlyingToken}
        numberOfWinners={pool.config.numberOfWinners}
        ticketTotalSupplyUnformatted={pool.tokens.ticket.totalSupplyUnformatted}
      />
    </>
  )
}

const UsersWinningOdds = (props) => {
  const {
    usersAddress,
    isQuantityValid,
    isFetched,
    usersTicketBalanceUnformatted,
    quantity,
    underlyingToken,
    numberOfWinners,
    ticketTotalSupplyUnformatted
  } = props

  const { t } = useTranslation()

  console.log(usersAddress, isFetched, isQuantityValid)
  if ((usersAddress && !isFetched) || !isQuantityValid) {
    return (
      <SmallCard className='mx-auto mt-10 flex flex-row'>
        <img src={IconTarget} className='w-16 h-16 sm:w-24 sm:h-24 mr-4  my-4' />
        <div className='flex flex-col w-full justify-center'>
          <Title>{t('yourWinningOdds')}:</Title>
          <Details>--</Details>
        </div>
      </SmallCard>
    )
  }

  const decimals = underlyingToken.decimals
  // New balance of user
  const quantityUnformatted = ethers.utils.parseUnits(quantity || '0', decimals)
  const usersNewBalanceUnformatted = quantityUnformatted.add(
    usersTicketBalanceUnformatted || ethers.constants.Zero
  )

  return (
    <SmallCard className='mx-auto mt-10 flex flex-row'>
      <img src={IconTarget} className='w-24 h-24 mr-4 my-4' />
      <div className='flex flex-col w-full  justify-center'>
        <Title>{t('yourWinningOdds')}:</Title>
        {usersNewBalanceUnformatted.isZero() ? (
          <Details>--</Details>
        ) : (
          <Odds
            ticketSupplyUnformatted={ticketTotalSupplyUnformatted}
            decimals={decimals}
            numberOfWinners={numberOfWinners}
            usersBalance={usersNewBalanceUnformatted}
          />
        )}
      </div>
    </SmallCard>
  )
}

const SmallCard = (props) => (
  <div className={classnames('w-full sm:w-1/2 bg-card py-2 px-4 rounded', props.className)}>
    {props.children}
  </div>
)

SmallCard.defaultProps = {
  className: 'flex flex-col'
}

const Title = (props) => <span className='text-center text-xs opacity-80'>{props.children}</span>
const Details = (props) => (
  <span className={classnames('text-center mt-2', props.className)}>{props.children}</span>
)
