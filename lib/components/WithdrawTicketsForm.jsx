import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { Button } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketIcon from 'assets/images/icon-ticket-green@2x.png'
import { V4WithdrawFlowBanner } from 'lib/components/WithdrawWizard/V4WithdrawFlowBanner'

export function WithdrawTicketsForm(props) {
  const { nextStep, pool, playerPoolDepositData } = props

  const { t } = useTranslation()
  const { address: usersAddress } = useOnboard()
  const router = useRouter()

  const playerTicket = playerPoolDepositData?.ticket
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
      let valueUnformatted
      try {
        valueUnformatted = ethers.utils.parseUnits(value, decimals)
      } catch (e) {
        console.warn(e)
      }

      return (
        valueUnformatted?.lte(amountUnformatted) || t('pleaseEnterAmountLowerThanTicketBalance')
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
      className={'mx-auto'}
    >
      {t('reviewWithdrawal')}
    </Button>
  )

  return (
    <>
      <h6 className='-mb-4'>{t('withdraw')}</h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInputGroup
          large
          unsignedNumber
          id='quantity'
          name='quantity'
          register={register}
          validate={validate}
          label={t('amount')}
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

        <V4WithdrawFlowBanner className='mt-4 mb-8' pool={pool} />

        <ButtonDrawer>{continueButton}</ButtonDrawer>
      </form>
    </>
  )
}
