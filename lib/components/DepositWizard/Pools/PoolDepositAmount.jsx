import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import classnames from 'classnames'
import { useTokenBalances, useUsersAddress } from '@pooltogether/hooks'
import { getMaxPrecision } from '@pooltogether/utilities'
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
        decimals={decimals}
        isFetched={isUsersBalanceFetched}
        usersTicketBalanceUnformatted={usersBalance?.[poolTicketAddress].amountUnformatted}
        usersUnderlyingBalanceUnformatted={usersBalance?.[tokenAddress].amountUnformatted}
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
    decimals,
    isFetched,
    usersTicketBalanceUnformatted,
    usersUnderlyingBalanceUnformatted,
    quantity,
    numberOfWinners,
    ticketTotalSupplyUnformatted
  } = props

  const { t } = useTranslation()

  const [isQuantityValid, setIsQuantityValid] = useState(false)
  const [isUsersBalanceEnough, setIsUsersBalanceEnough] = useState(true)

  const quantityDecimalPrecisionOverflow = getMaxPrecision(quantity) > decimals
  const quantityIsZero = ethers.utils.parseUnits(quantity, decimals).isZero()

  // Validate quantity input before calculating odds
  useEffect(() => {
    const isNotANumber = isNaN(quantity)
    if (!quantity || isNotANumber || quantityDecimalPrecisionOverflow || quantityIsZero) {
      console.log('set false')
      setIsQuantityValid(false)
    } else if (!isQuantityValid) {
      setIsQuantityValid(true)

      // Check if balance is enough
      if (usersUnderlyingBalanceUnformatted) {
        const quantityUnformatted = ethers.utils.parseUnits(quantity, decimals)
        if (isUsersBalanceEnough && quantityUnformatted?.gt(usersUnderlyingBalanceUnformatted)) {
          setIsUsersBalanceEnough(false)
        } else if (
          !isUsersBalanceEnough &&
          usersUnderlyingBalanceUnformatted.gte(quantityUnformatted)
        ) {
          setIsUsersBalanceEnough(true)
        }
      }
    }
  }, [quantity])

  if ((usersAddress && !isFetched) || !isQuantityValid) {
    return (
      <SmallCard className='mx-auto mt-10 flex flex-row'>
        <img src={IconTarget} className='w-16 h-16 sm:w-20 sm:h-20 ml-2 mr-4 my-4' />
        <div className='flex flex-col w-full justify-center'>
          <Title>{t('yourWinningOdds')}:</Title>
          <Details>--</Details>
        </div>
      </SmallCard>
    )
  }

  // New balance of user
  const quantityUnformatted =
    isNaN(quantity) || getMaxPrecision(quantity) > decimals
      ? ethers.utils.parseUnits('0', decimals)
      : ethers.utils.parseUnits(quantity || '0', decimals)
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
            textFlashy={isUsersBalanceEnough}
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
