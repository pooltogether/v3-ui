import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ApproveSponsorshipTxButton } from 'lib/components/ApproveSponsorshipTxButton'
import { DepositSponsorshipTxButton } from 'lib/components/DepositSponsorshipTxButton'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Modal } from 'lib/components/Modal'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

export const DepositSponsorshipModal = (props) => {
  const { handleClose, isWithdraw, tickerUpcased, visible } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, usersChainData } = poolData

  const {
    usersTokenBalanceBN,
    usersTokenBalance,
    usersTokenAllowance,
  } = usersDataForPool(pool, usersChainData)
  
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


  let contextualBalance = usersTokenBalance
  let validate = null
  if (isWithdraw) {
    contextualBalance = usersTicketBalance
    validate = {
      greaterThanBalance: value => parseFloat(value) <= usersTicketBalance ||
        'please enter an amount lower than your sponsorship balance',
    }
  } else {
    validate = {
      greaterThanBalance: value => parseFloat(value) <= usersTokenBalance ||
        'please enter an amount lower than your token balance',
    }
  }

  const onSubmit = (values) => {
    if (formState.isValid) {

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



  const approveButtonClassName = !needsApproval ? 'w-full' : 'w-48-percent'

  const approveButton = <Button
    noAnim
    textSize='lg'
    onClick={handleUnlockClick}
    disabled={!needsApproval || unlockTxInFlight}
    className={approveButtonClassName}
  >
    Approve {tickerUpcased}
  </Button>


  const depositButtonClassName = poolIsLocked ? 'w-full' : 'w-48-percent'

  const depositButton = <>
    <Button
      noAnim
      textSize='lg'
      onClick={handleDepositClick}
      disabled={disabled || poolIsLocked}
      className={depositButtonClassName}
    >
      Deposit
    </Button>
  </>


  return <>
    <Modal
      handleClose={handleClose}
      visible={visible}
      header={<>
        Deposit Sponsorship
      </>}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className='w-full mx-auto'
        >
          <TextInputGroup
            large
            unsignedNumber
            autoFocus
            id='quantity'
            name='quantity'
            register={register}
            validate={validate}
            label={<>
              Sponsor amount:
            </>}
            required='Sponsorship amount required'
            autoComplete='off'
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
          {Object.values(errors).length > 0 && <>
            <ErrorsBox
              errors={errors}
            />
          </>}
        </div>

        <div
          className='flex flex-col mx-auto w-full mx-auto items-center justify-center'
        >
          <ButtonDrawer>
            {/* <ApproveSponsorshipTxButton /> <DepositSponsorshipTxButton /> */}
          </ButtonDrawer>
        </div>
      </form>
    </Modal>
  </>
}
