import React, { useContext, useEffect } from 'react'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { NoMoreTicketsPane } from 'lib/components/NoMoreTicketsPane'
import { Odds } from 'lib/components/Odds'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WyreTopUpBalanceDropdown } from 'lib/components/WyreTopUpBalanceDropdown'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

const bn = ethers.utils.bigNumberify

export function TicketQuantityForm(props) {
  const { t } = useTranslation()

  const {
    balanceJsx,
    formName,
    formSubName,
    iconSrc,
    nextStep,
  } = props
  
  const router = useRouter()
  const quantity = router.query.quantity

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool, usersTicketBalance, usersTicketBalanceBN, usersChainData } = useContext(PoolDataContext)

  const liquidityCap = pool?.liquidityCap ? bn(pool?.liquidityCap) : bn(0)
  let remainingTickets
  if (liquidityCap.gt(0)) {
    remainingTickets = liquidityCap
      .sub(pool.ticketSupply).div(ethers.constants.WeiPerEther)
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

  useEffect(() => {
    if (quantity) {
      setValue('quantity', quantity, { shouldValidate: true })
    } else if (!isWithdraw) {
      setValue('quantity', 100, { shouldValidate: true })
    }
  }, [])

  const watchQuantity = watch('quantity')

  const {
    usersTokenBalance,
  } = usersDataForPool(pool, usersChainData)

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, {
        quantity: values.quantity,
        prevBalance: usersTicketBalanceBN.toString()
      })

      nextStep()
    }
  }

  const isWithdraw = formName === t('withdraw')

  let contextualBalance = usersTokenBalance

  let validate = null
  if (isWithdraw) {
    contextualBalance = usersTicketBalance
    validate = {
      greaterThanBalance: value => parseFloat(value) <= usersTicketBalance ||
        t('pleaseEnterAmountLowerThanTicketBalance'),
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

  if (remainingTickets && remainingTickets.lt('1')) {
    return <NoMoreTicketsPane />
  }

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
    </div>

    {balanceJsx && <>
      <div className='mb-12'>
        {balanceJsx}
      </div>
    </>}

    {/* {poolIsLocked && <>
      <Modal
        header={`${tickerUpcased} Pool locked`}
        visible={true}
      >
        <h3>
          This Pool's prize is currently being awarded - until awarding is complete it can not accept deposits or withdrawals.

          <br/>
          Show time til unlocked: ...
        </h3>
      </Modal>
    </>} */}

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
          label={t('ticketAmount')}
          required={t('ticketQuantityRequired')}
          autoComplete='off'
          bottomRightLabel={!isWithdraw && usersAddress && tickerUpcased && <>
            <WyreTopUpBalanceDropdown
              label={<>
                <Trans
                  i18nKey='topUpBalance'
                  defaults='<visibleMobile>Buy crypto</visibleMobile><hiddenMobile>Buy more crypto</hiddenMobile>'
                  components={{
                    visibleMobile: <span
                      className='xs:hidden ml-1'
                    />,
                    hiddenMobile: <span
                      className='hidden xs:inline-block ml-1'
                    />
                  }}
                />
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
                className='font-bold inline-flex items-center'
                onClick={(e) => {
                  e.preventDefault()
                  setValue('quantity', contextualBalance, { shouldValidate: true })
                }}
              >
                <img
                  src={iconSrc}
                  className='mr-2'
                  style={{ maxHeight: 12 }}
                /> {numberWithCommas(contextualBalance, { precision: 2 })} {tickerUpcased}
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
              sayEveryWeek
              showLabel
              splitLines
              pool={pool}
              usersBalance={usersTicketBalance}
              additionalQuantity={watchQuantity}
              isWithdraw={isWithdraw}
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

    {remainingTickets && remainingTickets.lt('1000000') && <>
      <div
        className='mt-4 xs:mt-10 sm:mt-20 p-2 liquidity-cap text-xxs xs:text-xs sm:text-base text-white bg-raspberry border-highlight-7 border-2 rounded-sm'
      >
        <span
          className={`text-red font-bold block sm:inline-block text-lg sm:text-base sm:relative`}
          role='img'
          aria-label='double exclaimation'
          style={{
            top: 1
          }}
        >&#x203c;</span> {t('onlyAmountTicketsRemaining', {
          amount: numberWithCommas(remainingTickets.toString(), { precision: 0 })
        })} <span
          className={`text-red font-bold hidden sm:inline-block sm:relative`}
          role='img'
          aria-label='double exclaimation'
          style={{
            top: 1
          }}
        >&#x203c;</span>
      </div>
    </>}
  </>
}
