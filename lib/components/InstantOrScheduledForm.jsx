import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { FormattedFutureDateCountdown } from 'lib/components/FormattedFutureDateCountdown'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PTHint } from 'lib/components/PTHint'
import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

import IconLightning from 'assets/images/icon-lightning.svg'
import IconWinky from 'assets/images/icon-winky.svg'

export const InstantOrScheduledForm = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { nextStep, pool, exitFees, quantity } = props
  const [withdrawType, setWithdrawType] = useState(null)

  const handleWithdrawTypeChange = (e) => {
    setWithdrawType(e.target.value)
  }

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol

  const {
    exitFee
  } = exitFees

  let instantFull = ethers.utils.bigNumberify(0)
  let instantPartial = ethers.utils.bigNumberify(0)
  if (quantity && underlyingCollateralDecimals) {
    instantPartial = ethers.utils.parseUnits(
      quantity,
      parseInt(underlyingCollateralDecimals, 10)
    ).sub(exitFee)

    instantFull = ethers.utils.parseUnits(
      quantity,
      parseInt(underlyingCollateralDecimals, 10)
    )
  }
 
  const scheduledFullFormatted = displayAmountInEther(
    instantFull,
    { decimals: underlyingCollateralDecimals, precision: 8 }
  )
  const instantPartialFormatted = displayAmountInEther(
    instantPartial,
    { decimals: underlyingCollateralDecimals, precision: 8 }
  )
  const exitFeeFormatted = displayAmountInEther(
    exitFee,
    { decimals: underlyingCollateralDecimals, precision: 8 }
  )

  const tipJsx = <>
    {t('toMaintainFairnessDescription')}

    <br /><br />
    {t('withdrawScheduledDescription', {
      amount: quantity,
      ticker: underlyingCollateralSymbol
    })}

    <br /><br />
    {t('withdrawInstantDescription', {
      amount: displayAmountInEther(
        exitFee,
        { decimals: underlyingCollateralDecimals, precision: 8}
      ),
      ticker: underlyingCollateralSymbol
    })}
  </>

  const updateParamsAndNextStep = async (e) => {
    e.preventDefault()

    if (withdrawType === 'instant') {
      queryParamUpdater.add(router, {
        withdrawType,
        net: instantPartialFormatted,
        fee: exitFeeFormatted,
      })
    } else if (withdrawType === 'scheduled') {
      queryParamUpdater.add(router, {
        withdrawType,
        net: quantity,
        timelockDurationSeconds: exitFees.timelockDurationSeconds,
      })
    }

    nextStep()
  }

  const formattedFutureDate = <FormattedFutureDateCountdown
    futureDate={Number(exitFees.timelockDurationSeconds)}
  />

  return <div
    className='text-inverse'
  >
    <PaneTitle>
      <Trans
        i18nKey='withdrawAmountTickets'
        defaults='Withdraw <number>{{amount}}</number> tickets'
        components={{
          number: <PoolNumber />,
        }}
        values={{
          amount: quantity
        }}
      />
    </PaneTitle>

    <PaneTitle small>
      {t('chooseHowToReceiveYourFunds')}
    </PaneTitle>

    <RadioInputGroup
      label=''
      name='withdrawType'
      onChange={handleWithdrawTypeChange}
      value={withdrawType}
      radios={[
        {
          value: 'scheduled',
          icon: <img src={IconWinky} />,
          label: <>
            {t('zeroFees')}
            {/* <Trans
              i18nKey='iWantAmountTickerBackInFutureDate'
              defaults='I want <bold><number>{{amount}}</number> {{ticker}}</bold> back in:'
              components={{
                bold: <span className='font-bold' />,
                number: <PoolNumber />,
              }}
              values={{
                amount: scheduledFullFormatted,
                ticker: underlyingCollateralSymbol,
              }}
            />  */}
          </>,
          description: <>
            <div
            >
              {t('finalAmount')} <span className='font-bold'>{scheduledFullFormatted}</span>
            </div>
            <div
            >
              {t('when')} <span className='font-bold'>{formattedFutureDate}</span>
            </div>
          </>
        },
        {
          value: 'instant',
          icon: <img src={IconLightning} />,
          label: <>
            {t('instantly')}
            {/* <Trans
              i18nKey='iWantAmountTickerBackNow'
              defaults='I want <bold><number>{{amount}}</number> {{ticker}}</bold> now, and will forfeit the interest'
              components={{
                bold: <span className='font-bold' />,
                number: <PoolNumber />,
              }}
              values={{
                amount: instantPartialFormatted,
                ticker: underlyingCollateralSymbol,
              }}
            /> */}
          </>,
          description: <>
            <div
              className='mb-1'
            >
              {t('finalAmount')} <span className='font-bold'>{instantPartialFormatted}</span>
            </div>
            <div
              className='mb-1'
            >
              {t('when')} <span className='font-bold'>{t('now')}</span>
            </div>
          </>
        }
      ]}
    />

    <div
      className='flex items-center justify-center py-4 px-10 sm:w-7/12 mx-auto rounded-xl -mx-6 sm:mx-auto bg-yellow text-inverse'
      style={{
        minHeight: 70
      }}
    >

      {withdrawType === 'scheduled' ? <>
      
        <PTHint
          tip={tipJsx}
        >
          <>
            <div className='w-10 mx-auto mb-2'>
              <QuestionMarkCircle />
            </div>
            <Trans
              i18nKey='yourAmountWorthOfTickerWillBeScheduled'
              defaults='Your <bold><number>{{amount}}</number></bold> worth of <bold>{{ticker}}</bold> will be scheduled and ready to withdraw in:'
              components={{
                bold: <span className='font-bold' />,
                number: <PoolNumber />,
              }}
              values={{
                amount: instantPartialFormatted,
                ticker: underlyingCollateralSymbol,
              }}
            /> {formattedFutureDate}
          </>
        </PTHint>
      {/* <button
        className='active:outline-none focus:outline-none trans text-blue hover:text-secondary underline rounded-xl outline-none mt-4 mx-8'
        onClick={(e) => {
          e.preventDefault()
          setWithdrawType('instant')
        }}
      >
        {t('needYourFundsRightNowQuestion')}
      </button> */}
    </> : <>
    
      <PTHint
        tip={tipJsx}
      >
          <>
            <div className='w-10 mx-auto mb-2'>
              <QuestionMarkCircle />
            </div>
            
            <Trans
              i18nKey='youWillReceiveAmountTickerNowAndForfeitAmountTwo'
              defaults='You will receive <bold><number>{{amount}}</number> {{ticker}}</bold> now and forfeit <bold><number>{{amountTwo}}</number> {{ticker}}</bold> as interest to the pool.'
              components={{
                bold: <span className='font-bold' />,
                number: <PoolNumber />,
              }}
              values={{
                amount: instantPartialFormatted,
                amountTwo: exitFeeFormatted,
                ticker: underlyingCollateralSymbol,
              }}
            />
          </>
        </PTHint>
        {/* <button
          className='active:outline-none focus:outline-none trans text-blue hover:text-secondary underline rounded-xl outline-none mt-4 mx-8'
          onClick={(e) => {
            e.preventDefault()
            setWithdrawType('scheduled')
          }}
        >
          {t('dontWantToForfeitAnAmountTickerFairnessFee', {
            amount: exitFeeFormatted,
            ticker: underlyingCollateralSymbol
          })}
        </button> */}
      </>}
    </div>

    <div className='mt-8'>
      <Button
        disabled={!withdrawType}
        textSize='lg'
        onClick={updateParamsAndNextStep}
      >
        {t('continue')}
      </Button>
    </div> 
      
  </div> 
}
