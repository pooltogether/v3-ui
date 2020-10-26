import React, { useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

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

  const [iUnderstandChecked, setIUnderstandChecked] = useState(false)

  const handleIUnderstandChange = (e) => {
    setIUnderstandChecked(!iUnderstandChecked)
  }

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

    const gross = ethers.utils.parseUnits(
      quantity,
      parseInt(underlyingCollateralDecimals, 10)
    )

    // if (withdrawType === 'instant') {
      queryParamUpdater.add(router, {
        withdrawType,
        gross: gross.toString(),
        net: instantPartial.toString(),
        fee: exitFee.toString(),
      })
    // }
    // else if (withdrawType === 'scheduled') {
    //   queryParamUpdater.add(router, {
    //     withdrawType,
    //     net: quantity,
    //     timelockDurationSeconds: exitFees.timelockDurationSeconds,
    //   })
    // }

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

    {/* <PaneTitle small>
      {t('chooseHowToReceiveYourFunds')}
    </PaneTitle> */}

        
    <RadioInputGroup
      label=''
      name='withdrawType'
      onChange={handleWithdrawTypeChange}
      value={withdrawType}
      radios={[
        // {
        //   value: 'scheduled',
        //   icon: <img src={IconWinky} className='w-7 h-7 xs:w-auto xs:h-auto' />,
        //   label: <>
        //     {t('zeroFees')} <PTHint
        //       className='inline-block relative -t-6 r-2'
        //       tip={tipJsx}
        //     >
        //       <>
        //         <div className='inline-bold relative'>
        //           <QuestionMarkCircle />
        //         </div>
        //       </>
        //     </PTHint>
        //     {/* <Trans
        //       i18nKey='iWantAmountTickerBackInFutureDate'
        //       defaults='I want <bold><number>{{amount}}</number> {{ticker}}</bold> back in:'
        //       components={{
        //         bold: <span className='font-bold' />,
        //         number: <PoolNumber />,
        //       }}
        //       values={{
        //         amount: scheduledFullFormatted,
        //         ticker: underlyingCollateralSymbol,
        //       }}
        //     />  */}
        //   </>,
        //   description: <>
        //     <div
        //       className='mb-2 xs:mb-0'
        //     >
        //       {t('finalAmount')} <span
        //         className='block xs:inline font-bold'
        //       ><PoolNumber>{scheduledFullFormatted}</PoolNumber></span>
        //     </div>
        //     <div
        //       className='mb-2 xs:mb-0'
        //     >
        //       {t('when')} <span
        //         className='block xs:inline font-bold'
        //       >{formattedFutureDate}</span>
        //     </div>
        //   </>
        // },
        {
          value: 'instant',
          icon: <img src={IconLightning} className='w-7 h-7 xs:w-auto xs:h-auto' />,
          label: <>
            {t('instantly')} <PTHint
              className='inline-block relative -t-6 r-2'
              tip={tipJsx}
            >
              <>
                <div className='inline-bold relative'>
                  <QuestionMarkCircle />
                </div>
              </>
            </PTHint>
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
              className='mb-2 xs:mb-0'
            >
              {t('finalAmount')} <span
                className='block xs:inline font-bold'
              ><PoolNumber>{instantPartialFormatted}</PoolNumber></span>
            </div>
            <div
              className='mb-2 xs:mb-0'
            >
              {t('when')} <span
                className='block xs:inline font-bold'
              >{t('now')}</span>
            </div>
          </>
        }
      ]}
    />

    <motion.div
      animate={withdrawType ? 'enter' : 'exit'}
      initial='exit'
      variants={{
        enter: {
          scale: 1,
          height: 'auto',
          transition: {
            duration: 0.25
          }
        },
        exit: {
          scale: 0,
          height: 0,
        }
      }}
      className={classnames(
        'flex flex-col sm:flex-row items-center justify-between sm:w-11/12 lg:w-full mx-auto rounded-xl sm:mx-auto text-inverse',
        'bg-yellow-darkened border-2 border-dashed border-yellow overflow-hidden py-4 px-6',
        {
          'h-0': !withdrawType,
          'h-40': withdrawType,
        }
      )}
    >
      <div
        className='order-last sm:order-first sm:w-3/12 mt-2 sm:mt-0'
      >
        <label
          htmlFor='i-understand-checkbox'
          className='m-0 font-bold'
        >
          <input
            onChange={handleIUnderstandChange}
            id='i-understand-checkbox'
            type='checkbox'
            className='mr-2'
          /> {t('iUnderstand')}
        </label>
      </div>

      <div
        className='order-first sm:order-last sm:w-9/12'
      >
        <Trans
          i18nKey='youAreWithdrawingAmountTickerAndPayingFee'
          defaults='You are withdrawing <bold>{{amount}} {{ticker}}</bold> and paying a <bold>{{amountTwo}} {{ticker}}</bold> fee'
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
      </div>

      {/* {withdrawType === 'scheduled' ? <>
        
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
      </>} */}
    </motion.div>

    <div className='mt-8'>
      <Button
        disabled={!withdrawType || !iUnderstandChecked}
        textSize='lg'
        onClick={updateParamsAndNextStep}
      >
        {t('continue')}
      </Button>
    </div> 
  </div> 
}
