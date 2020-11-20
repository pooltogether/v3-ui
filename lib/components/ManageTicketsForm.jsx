import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { STRINGS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { Button } from 'lib/components/Button'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { WithdrawTicketsForm } from 'lib/components/WithdrawTicketsForm'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

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

    <DropdownInputGroup
      id='manage-tickets-action-dropdown'
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
      <WithdrawTicketsForm
        {...props}
      />
    </>}

  </>
}
