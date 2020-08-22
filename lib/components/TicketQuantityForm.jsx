import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { Modal } from 'lib/components/Modal'
import { PaneTitle } from 'lib/components/PaneTitle'
import { Odds } from 'lib/components/Odds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

export const TicketQuantityForm = (props) => {
  const {
    balanceJsx,
    formName,
    nextStep,
  } = props
  
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersTicketBalance, usersChainData } = poolData

  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  const poolIsLocked = pool && pool.isRngRequested

  const {
    handleSubmit,
    register,
    errors,
    formState,
    watch,
    setValue
  } = useForm({
    mode: 'all', reValidateMode: 'onChange',
 })

  const watchQuantity = watch('quantity')

  const {
    usersBalance,
  } = usersDataForPool(pool, usersChainData)

  const router = useRouter()

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, { quantity: values.quantity })

      nextStep()
    }
  }

  const isWithdraw = formName === 'Withdraw'

  let validate = null
  if (isWithdraw) {
    validate = {
      greaterThanBalance: value => parseFloat(value) <= usersTicketBalance ||
        'please enter an amount lower than your ticket balance',
    }
  }

  const continueButton = <Button
    textSize='xl'
    disabled={!formState.isValid}
    color='green'
    onClick={handleSubmit(onSubmit)}
  >
    Continue
  </Button>

  return <>
    <PaneTitle>
      {formName}
    </PaneTitle>

    {balanceJsx && <>
      <div className='mt-3 mb-6'>
        {balanceJsx}
      </div>
    </>}

    {poolIsLocked && <>
      <Modal
        header={`${tickerUpcased} Pool locked`}
      >
        <div>
          This Pool's prize is currently being awarded - until awarding is complete it can not accept deposits or withdrawals.

          {/* <br/>
          Time til unlocked: !!! */}
        </div>
      </Modal>
    </>}

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-full xs:w-10/12 sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          unsignedNumber
          id='quantity'
          name='quantity'
          register={register}
          validate={validate}
          label={<>
            Amount <span
              className='hidden xs:inline-block'
            >of tickets</span>
          </>}
          required='ticket quantity required'
          autoComplete='off'
          // placeholder={'# of tickets'}
          rightLabel={usersAddress && <>
            <button
              type='button'
              className='font-bold'
              onClick={(e) => {
                e.preventDefault()
                // setQuantity(usersBalance)
                setValue('quantity', usersBalance, { shouldValidate: true })
              }}
            >
              Balance: {numberWithCommas(usersBalance)} {tickerUpcased}
            </button>
          </>}
        />
      </div>
      <div
        className='mt-2 text-sm text-highlight-1 font-bold mb-2'
        style={{
          minHeight: 24
        }}
      >
        <ErrorsBox
          errors={errors}
        />

        <Odds
          showLabel
          splitLines
          pool={pool}
          usersBalance={usersTicketBalance}
          additionalQuantity={watchQuantity}
          isWithdraw={isWithdraw}
        // hide={parseFloat(watchQuantity) > usersTicketBalance}
        />
      </div>

      <ButtonDrawer>
        {continueButton}
      </ButtonDrawer>
    </form>
  </>
}
