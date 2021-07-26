import React, { useEffect } from 'react'
import { Button, TokenIcon } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import { getMaxPrecision, numberWithCommas, queryParamUpdater } from '@pooltogether/utilities'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import WalletIcon from 'assets/images/icon-wallet.svg'
import { parseUnits } from 'ethers/lib/utils'

export const DepositAmount = (props) => {
  const {
    quantity: queryQuantity,
    usersAddress,
    usersUnderlyingBalance,
    usersTicketBalance,
    decimals,
    label,
    tokenSymbol,
    tokenAddress,
    nextStep,
    form
  } = props

  const { t } = useTranslation()
  const router = useRouter()

  const { handleSubmit, register, errors, formState, setValue } = form

  // Set quantity from the query parameter
  useEffect(() => {
    if (queryQuantity) {
      setValue('quantity', queryQuantity, { shouldValidate: true })
    }
  }, [])

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, {
        quantity: values.quantity,
        prevUnderlyingBalance: usersUnderlyingBalance,
        prevTicketBalance: usersTicketBalance
      })
      nextStep()
    }
  }

  const depositValidationRules = {
    isValid: (v) => {
      const isNotANumber = isNaN(v)
      if (isNotANumber) return false
      if (!usersUnderlyingBalance) return false
      if (!usersTicketBalance) return false
      if (getMaxPrecision(v) > decimals) return false
      if (parseUnits(usersUnderlyingBalance, decimals).lt(parseUnits(v, decimals))) return false
      if (parseUnits(v, decimals).isZero()) return false
      return true
    }
  }

  return (
    <>
      <WithdrawAndDepositPaneTitle label={label} symbol={tokenSymbol} address={tokenAddress} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full mx-auto'>
          <TextInputGroup
            validate={depositValidationRules}
            unsignedNumber
            autoFocus
            large
            id='quantity'
            name='quantity'
            register={register}
            label={t('amount')}
            required={t('ticketQuantityRequired')}
            autoComplete='off'
            rightLabel={
              usersAddress &&
              usersUnderlyingBalance && (
                <>
                  <button
                    id='_setMaxDepositAmount'
                    type='button'
                    className='font-bold inline-flex items-center'
                    onClick={(e) => {
                      e.preventDefault()
                      setValue('quantity', usersUnderlyingBalance, { shouldValidate: true })
                    }}
                  >
                    <img src={WalletIcon} className='mr-2' style={{ maxHeight: 12 }} />
                    {numberWithCommas(usersUnderlyingBalance)} {tokenSymbol}
                  </button>
                </>
              )
            }
          />
        </div>
        <div
          className='text-sm text-highlight-1 font-bold mb-2'
          style={{
            minHeight: 26
          }}
        >
          {Object.values(errors).length > 0 && <ErrorsBox errors={errors} />}
        </div>

        <div className='flex flex-col mx-auto w-full items-center justify-center'>
          <ButtonDrawer>
            <Button
              textSize='lg'
              disabled={!formState.isValid}
              onClick={handleSubmit(onSubmit)}
              className={'mx-auto'}
            >
              {t('continue')}
            </Button>
          </ButtonDrawer>
        </div>
      </form>
    </>
  )
}
