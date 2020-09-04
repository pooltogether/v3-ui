import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { DepositInfoList } from 'lib/components/DepositInfoList'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { Modal } from 'lib/components/Modal'
import { PaneTitle } from 'lib/components/PaneTitle'
import { Odds } from 'lib/components/Odds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WyreTopUpBalanceDropdown } from 'lib/components/WyreTopUpBalanceDropdown'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

export const TicketQuantityForm = (props) => {
  const {
    balanceJsx,
    formName,
    formSubName,
    nextStep,
    showInfoList,
  } = props
  
  const router = useRouter()
  const quantity = router.query.quantity

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

  useEffect(() => {
    if (quantity) {
      setValue('quantity', quantity, { shouldValidate: true })
    }
  }, [])

  const watchQuantity = watch('quantity')

  const {
    usersTokenBalance,
  } = usersDataForPool(pool, usersChainData)

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, { quantity: values.quantity })

      nextStep()
    }
  }

  const isWithdraw = formName === 'Withdraw'

  let contextualBalance = usersTokenBalance

  let validate = null
  if (isWithdraw) {
    contextualBalance = usersTicketBalance
    validate = {
      greaterThanBalance: value => parseFloat(value) <= usersTicketBalance ||
        'please enter an amount lower than your ticket balance',
    }
  }

  const continueButton = <Button
    textSize='lg'
    disabled={!formState.isValid}
    onClick={handleSubmit(onSubmit)}
    className={'mx-auto w-full'}
  >
    Continue
  </Button>

  return <>
    <div
      className='pane-title'
    >
      <PaneTitle
        short
      >
        {formName}
      </PaneTitle>
      <PaneTitle
        small
      >
        {formSubName}
      </PaneTitle>
      {showInfoList && <>
        <h6
          className='deposit-info-list py-6'
        >
          <DepositInfoList />
        </h6>
      </>}
    </div>

    {balanceJsx && <>
      <div className='mb-12'>
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
      <div
        className='w-full mx-auto'
      >
        <TextInputGroup
          large
          unsignedNumber
          id='quantity'
          name='quantity'
          register={register}
          validate={validate}
          label={<>
            Ticket amount:
          </>}
          required='ticket quantity required'
          autoComplete='off'
          centerLabel={<>
            <WyreTopUpBalanceDropdown
              label={<>
                Top up <span
                  className='hidden xs:inline-block'
                >&nbsp;balance</span>:
              </>}
              textColor='text-default-soft'
              hoverTextColor='text-highlight-1'
              tickerUpcased={tickerUpcased}
              usersAddress={usersAddress}
            />
          </>}
          rightLabel={usersAddress && tickerUpcased && <>
            <button
              type='button'
              className='font-bold'
              onClick={(e) => {
                e.preventDefault()
                setValue('quantity', contextualBalance, { shouldValidate: true })
              }}
            >
              {/* Balance:  */}
              {numberWithCommas(contextualBalance, { precision: 4 })} {tickerUpcased}
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
        {Object.values(errors).length > 0 ? <>
          <ErrorsBox
            errors={errors}
          />
        </> : <>
          <div
            className='odds-box'
          >
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
        </>}
      </div>

      <div
        className='flex flex-col mx-auto w-full mx-auto items-center justify-center'
      >
        <ButtonDrawer>
          {continueButton}
        </ButtonDrawer>
      </div>


    </form>
  </>
}
