import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { STRINGS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import TicketIcon from 'assets/images/icon-ticket-green@2x.png'

export function ManageTicketsForm(props) {
  const { t } = useTranslation()

  const {
    nextStep,
  } = props
  
  const router = useRouter()

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool, dynamicPlayerData, usersTicketBalance, usersTicketBalanceBN } = useContext(PoolDataContext)

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

  // const {
  //   usersTokenBalance,
  // } = usersDataForPool(pool, usersChainData)
  
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

  const playerData = dynamicPlayerData?.find(playerData => playerData?.prizePool?.id === pool?.id)




  const [action, setAction] = useState(STRINGS.withdraw)

  return <>
    <div
      className='pane-title'
    >
      <div
        className={`leading-tight font-bold text-lg xs:text-3xl lg:text-4xl text-inverse mb-4 xs:mb-10`}
      >
        {t('manageYourTickets')}
      </div>
    </div>

    <div className='mx-auto mt-4'>
      <AccountTicket
        noMargin
        key={`account-pool-row-${pool?.poolAddress}`}
        pool={pool}
        player={playerData}
      />
    </div>

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <DropdownInputGroup
        id='action-dropdown'
        label={t('whatWouldYouLikeToDoQuestion')}
        current={action}
        setCurrent={setAction}
        options={{
          [STRINGS.withdraw]: t('withdraw'),
          [STRINGS.transfer]: t('transfer')
        }}
      />

      {action === STRINGS.transfer && <>
        <h6 className='mt-2 text-inverse'>Transfer feature coming soon ...</h6>
      </>}

      {action === STRINGS.withdraw && <>
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
      </>}


      <ButtonDrawer>
        {continueButton}
      </ButtonDrawer>
    </form>

  </>
}
