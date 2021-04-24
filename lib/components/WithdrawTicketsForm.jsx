import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketIcon from 'assets/images/icon-ticket-green@2x.png'

export function WithdrawTicketsForm(props) {
  const { nextStep, pool, playerPoolTicketData } = props

  const { t } = useTranslation()
  const { usersAddress } = useContext(AuthControllerContext)
  const router = useRouter()

  const playerTicket = playerPoolTicketData?.ticket
  const amount = playerTicket?.amount
  const amountUnformatted = playerTicket?.amountUnformatted

  const underlyingToken = pool.tokens.underlyingToken
  const ticker = underlyingToken.symbol
  const decimals = underlyingToken.decimals

  const { handleSubmit, register, errors, formState, watch, setValue } = useForm({
    mode: 'all',
    reValidateMode: 'onChange'
  })

  const watchQuantity = watch('quantity')

  const validate = {
    greaterThanBalance: (value) => {
      return (
        ethers.utils.parseUnits(value, decimals).lte(amountUnformatted) ||
        t('pleaseEnterAmountLowerThanTicketBalance')
      )
    }
  }

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, {
        quantity: values.quantity,
        prevBalance: amount.toString()
      })

      nextStep()
    }
  }

  const continueButton = (
    <Button
      textSize='lg'
      disabled={!formState.isValid}
      onClick={handleSubmit(onSubmit)}
      className={'mx-auto w-48-percent'}
    >
      {t('reviewWithdrawal')}
    </Button>
  )

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInputGroup
          unsignedNumber
          id='quantity'
          name='quantity'
          register={register}
          validate={validate}
          label={t('enterAmountToWithdraw')}
          required={t('ticketQuantityRequired')}
          autoComplete='off'
          rightLabel={
            usersAddress &&
            amount && (
              <>
                <button
                  id='_setMaxWithdrawAmount'
                  type='button'
                  className='font-bold inline-flex items-center'
                  onClick={(e) => {
                    e.preventDefault()
                    setValue('quantity', amount, { shouldValidate: true })
                  }}
                >
                  <img src={TicketIcon} className='mr-2' style={{ maxHeight: 12 }} />{' '}
                  {numberWithCommas(amount)} {ticker}
                </button>
              </>
            )
          }
        />

        <div
          className='mt-2 text-sm text-highlight-1 mb-2'
          style={{
            minHeight: 24
          }}
        >
          {Object.values(errors).length > 0 ? (
            <>
              <ErrorsBox errors={errors} />
            </>
          ) : (
            <>
              <div
                className='odds-box mx-auto font-normal text-xxs xs:text-xs text-orange mb-8'
                style={{
                  maxWidth: 550
                }}
              >
                <WithdrawOdds
                  pool={pool}
                  usersTicketBalanceUnformatted={amountUnformatted}
                  withdrawAmount={watchQuantity}
                />
              </div>
            </>
          )}
        </div>

        <ButtonDrawer>{continueButton}</ButtonDrawer>
      </form>
    </>
  )
}
