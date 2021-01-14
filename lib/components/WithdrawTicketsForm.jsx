import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePlayerPoolBalances } from 'lib/hooks/usePlayerPoolBalances'
import { usePool } from 'lib/hooks/usePool'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketIcon from 'assets/images/icon-ticket-green@2x.png'

export function WithdrawTicketsForm(props) {
  const { t } = useTranslation()

  const {
    nextStep,
  } = props
  
  const router = useRouter()

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool } = usePool()
  
  const {
    usersTicketBalance,
    usersTicketBalanceBN
  } = usePlayerPoolBalances(usersAddress, pool)

  const ticker = pool?.underlyingCollateralSymbol
  const decimals = pool?.underlyingCollateralDecimals
  const tickerUpcased = ticker?.toUpperCase()

  const {
    handleSubmit,
    register,
    errors,
    formState,
    watch,
    setValue
  } = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const watchQuantity = watch('quantity')

  const validate = {
    greaterThanBalance: value => {
      return ethers.utils.parseUnits(value, decimals)
        .lte(usersTicketBalanceBN) || t('pleaseEnterAmountLowerThanTicketBalance')
    }
  }

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, {
        quantity: values.quantity,
        prevBalance: usersTicketBalanceBN.toString()
      })

      nextStep()
    }
  }

  const continueButton = <Button
    textSize='lg'
    disabled={!formState.isValid}
    onClick={handleSubmit(onSubmit)}
    className={'mx-auto'}
  >
    {t('continue')}
  </Button>

  return <>
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInputGroup
        unsignedNumber
        id='quantity'
        name='quantity'
        register={register}
        validate={validate}
        label={t('enterAmountToWithdraw')}
        required={t('ticketQuantityRequired')}
        autoComplete='off'

        rightLabel={usersAddress && usersTicketBalance && <>
          <button
            type='button'
            className='font-bold inline-flex items-center'
            onClick={(e) => {
              e.preventDefault()
              setValue('quantity', usersTicketBalance, { shouldValidate: true })
            }}
          >
            <img
              src={TicketIcon}
              className='mr-2'
              style={{ maxHeight: 12 }}
            /> {numberWithCommas(usersTicketBalance, { precision: 2 })} {tickerUpcased}
          </button>
        </>}
      />

      <div
        className='mt-2 text-sm text-highlight-1 mb-2'
        style={{
          minHeight: 24
        }}
      >
        {Object.values(errors).length > 0 ? <>
          <ErrorsBox
            errors={errors}
          />
        </> : <>
            <div
              className='odds-box mx-auto font-normal text-xxs xs:text-xs text-orange'
              style={{
                maxWidth: 500
              }}
            >
              <WithdrawOdds
                pool={pool}
                usersTicketBalanceBN={usersTicketBalanceBN}
                withdrawAmount={watchQuantity}
              />
            </div>
          </>}
      </div>

      <ButtonDrawer>
        {continueButton}
      </ButtonDrawer>
    </form>

  </>
}
