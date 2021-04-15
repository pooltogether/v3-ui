import React, { useContext, useEffect } from 'react'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useUsersChainData } from 'lib/hooks/useUsersChainData'
import { Banner } from 'lib/components/Banner'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { Button } from 'lib/components/Button'
import { ErrorsBox } from 'lib/components/ErrorsBox'
import { DepositPaneTitle } from 'lib/components/DepositPaneTitle'
import { NoMoreTicketsPane } from 'lib/components/NoMoreTicketsPane'
import { Odds } from 'lib/components/Odds'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { WyreTopUpBalanceDropdown } from 'lib/components/WyreTopUpBalanceDropdown'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { usersDataForPool } from 'lib/utils/usersDataForPool'

import IconTarget from 'assets/images/icon-target@2x.png'
import { usePlayerTicketsByPool } from 'lib/hooks/useAllPlayerTickets'

const bn = ethers.BigNumber.from

export function DepositTicketQuantityForm(props) {
  const { t } = useTranslation()

  const { balanceJsx, formName, formSubName, iconSrc, nextStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { usersAddress } = useContext(AuthControllerContext)

  const { data: pool } = useCurrentPool()
  const { data: usersChainData } = useUsersChainData()

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { ticket } = usePlayerTicketsByPool(pool.prizePool.address, address)
  const amount = ticket?.amount
  const amountUnformatted = ticket?.amountUnformatted

  const liquidityCap = pool?.liquidityCap ? bn(pool?.liquidityCap) : bn(0)
  let remainingTickets
  if (liquidityCap.gt(0)) {
    remainingTickets = liquidityCap.sub(pool.ticketSupply).div(ethers.constants.WeiPerEther)
  }

  const ticker = pool?.underlyingCollateralSymbol
  const tickerUpcased = ticker?.toUpperCase()

  const { handleSubmit, register, errors, formState, watch, setValue } = useForm({
    mode: 'all',
    reValidateMode: 'onChange'
  })

  useEffect(() => {
    if (quantity) {
      setValue('quantity', quantity, { shouldValidate: true })
    }
  }, [])

  const watchQuantity = watch('quantity')

  const { usersTokenBalance } = usersDataForPool(pool, usersChainData)

  const onSubmit = (values) => {
    if (formState.isValid) {
      queryParamUpdater.add(router, {
        quantity: values.quantity,
        prevBalance: amount
      })

      nextStep()
    }
  }

  const continueButton = (
    <Button
      textSize='lg'
      disabled={!formState.isValid}
      onClick={handleSubmit(onSubmit)}
      className={'mx-auto w-48-percent'}
    >
      {t('continue')}
    </Button>
  )

  if (remainingTickets && remainingTickets.lt('1')) {
    return <NoMoreTicketsPane />
  }

  return (
    <>
      <DepositPaneTitle ticker={tickerUpcased} pool={pool} />

      {balanceJsx && <div className='sm:my-4 mb-12'>{balanceJsx}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-full mx-auto'>
          <TextInputGroup
            unsignedNumber
            autoFocus
            large
            id='quantity'
            name='quantity'
            register={register}
            label={t('ticketAmount')}
            required={t('ticketQuantityRequired')}
            autoComplete='off'
            // bottomRightLabel={
            //   usersAddress &&
            //   tickerUpcased && (
            //     <>
            //       <WyreTopUpBalanceDropdown
            //         label={
            //           <>
            //             <Trans
            //               i18nKey='topUpBalance'
            //               defaults='<visibleMobile>Buy crypto</visibleMobile><hiddenMobile>Buy more crypto</hiddenMobile>'
            //               components={{
            //                 visibleMobile: <span className='xs:hidden ml-1' />,
            //                 hiddenMobile: <span className='hidden xs:inline-block ml-1' />,
            //               }}
            //             />
            //           </>
            //         }
            //         textColor='text-default-soft'
            //         hoverTextColor='text-highlight-1'
            //         tickerUpcased={tickerUpcased}
            //         usersAddress={usersAddress}
            //       />
            //     </>
            //   )
            // }
            rightLabel={
              usersAddress &&
              tickerUpcased && (
                <>
                  <button
                    id='_setMaxDepositAmount'
                    type='button'
                    className='font-bold inline-flex items-center'
                    onClick={(e) => {
                      e.preventDefault()
                      setValue('quantity', usersTokenBalance, { shouldValidate: true })
                    }}
                  >
                    <img src={iconSrc} className='mr-2' style={{ maxHeight: 12 }} />{' '}
                    {numberWithCommas(usersTokenBalance, { precision: 2 })} {tickerUpcased}
                  </button>
                </>
              )
            }
          />
        </div>
        <div
          className='text-sm text-highlight-1 font-bold mb-2'
          style={{
            minHeight: 26
          }}
        >
          {Object.values(errors).length > 0 && <ErrorsBox errors={errors} />}
        </div>

        <div className='flex flex-col mx-auto w-full items-center justify-center'>
          <ButtonDrawer>{continueButton}</ButtonDrawer>
        </div>
      </form>

      {remainingTickets && remainingTickets.lt('1000000') && (
        <>
          <div className='mt-4 xs:mt-10 sm:mt-20 p-2 liquidity-cap text-xxs xs:text-xs sm:text-base text-white bg-raspberry border-highlight-7 border-2 rounded-sm'>
            <span
              className={`text-red font-bold block sm:inline-block text-lg sm:text-base sm:relative`}
              role='img'
              aria-label='double exclaimation'
              style={{
                top: 1
              }}
            >
              &#x203c;
            </span>{' '}
            {t('onlyAmountTicketsRemaining', {
              amount: numberWithCommas(remainingTickets.toString(), { precision: 0 })
            })}{' '}
            <span
              className={`text-red font-bold hidden sm:inline-block sm:relative`}
              role='img'
              aria-label='double exclaimation'
              style={{
                top: 1
              }}
            >
              &#x203c;
            </span>
          </div>
        </>
      )}

      {parseFloat(watchQuantity) > 0 && (
        <div className='odds-box'>
          <Banner
            gradient={null}
            className='bg-primary mt-4 sm:mt-12 mx-auto w-full'
            style={{ maxWidth: 380 }}
          >
            <img className='mx-auto mb-3 h-16' src={IconTarget} />

            <div className='mt-6'>
              <Odds
                sayEveryWeek
                showLabel
                splitLines
                ticketSupplyUnformatted={pool.tokens.ticket.totalSupplyUnformatted}
                decimals={pool.tokens.ticket.decimals}
                numberOfWinners={pool.config.numberOfWinners}
                usersBalance={amountUnformatted}
                additionalAmount={watchQuantity}
              />
            </div>
          </Banner>
        </div>
      )}
    </>
  )
}
