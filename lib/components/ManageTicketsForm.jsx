import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export function ManageTicketsForm(props) {
  const { t } = useTranslation()

  const {
    nextStep,
  } = props
  
  const router = useRouter()

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool, dynamicPlayerData, usersTicketBalanceBN } = useContext(PoolDataContext)

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

  return <>
    <div
      className='pane-title'
    >
      <div
        className={`leading-tight font-bold text-lg xs:text-3xl lg:text-4xl text-inverse`}
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
      

      <ButtonDrawer>
        {continueButton}
      </ButtonDrawer>
    </form>

  </>
}
