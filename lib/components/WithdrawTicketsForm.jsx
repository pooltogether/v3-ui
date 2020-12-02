import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PlayerDataContext } from 'lib/components/contextProviders/PlayerDataContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { WithdrawOdds } from 'lib/components/WithdrawOdds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { usePlayerQuery } from 'lib/hooks/usePlayerQuery'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { testAddress } from 'lib/utils/testAddress'

import TicketIcon from 'assets/images/icon-ticket-green@2x.png'

export function WithdrawTicketsForm(props) {
  const { t } = useTranslation()

  const {
    nextStep,
  } = props
  
  const router = useRouter()

  const { chainId, usersAddress } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)
  const { usersTicketBalance, usersTicketBalanceBN } = useContext(PlayerDataContext)


  const playerAddressError = testAddress(usersAddress)

  const blockNumber = -1
  const {
    status,
    data: playerData,
    error,
    isFetching
  } = usePlayerQuery(pauseQueries, chainId, usersAddress, blockNumber, playerAddressError)

  if (error) {
    console.error(error)
  }


  const ticker = pool?.underlyingCollateralSymbol
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
    greaterThanBalance: value => parseFloat(value) <= usersTicketBalance ||
      t('pleaseEnterAmountLowerThanTicketBalance'),
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
                usersBalance={usersTicketBalance}
                quantity={watchQuantity}
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
