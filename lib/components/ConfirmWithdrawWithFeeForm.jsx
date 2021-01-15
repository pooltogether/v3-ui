import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PTHint } from 'lib/components/PTHint'
import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useExitFees } from 'lib/hooks/useExitFees'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { handleCloseWizard } from 'lib/utils/handleCloseWizard'

import IconLightning from 'assets/images/icon-lightning.svg'

export function ConfirmWithdrawWithFeeForm(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const shouldReduceMotion = useReducedMotion()

  const [transactions, setTransactions] = useAtom(transactionsAtom)
  
  const { nextStep, previousStep, pool, quantity } = props

  const { usersAddress, provider } = useContext(AuthControllerContext)

  const ticker = pool?.underlyingCollateralSymbol
  const decimals = pool?.underlyingCollateralDecimals
  const poolAddress = pool?.poolAddress
  const controlledTicketTokenAddress = pool?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()

  const { exitFees } = useExitFees(pool, quantity)
  const { exitFee } = exitFees

  useEffect(() => {
    if (exitFees === 'error') {
      poolToast.error('There was an error fetching exit fees')
      previousStep()
    }
  }, [exitFees])

  const [iUnderstandChecked, setIUnderstandChecked] = useState(false)

  const handleIUnderstandChange = (e) => {
    setIUnderstandChecked(!iUnderstandChecked)
  }



  let tipJsx = null
  let gross = ethers.utils.bigNumberify(0)
  let net = ethers.utils.bigNumberify(0)
  let grossFormatted,
    netFormatted,
    feeFormatted

  if (exitFee && quantity && decimals) {
    gross = ethers.utils.parseUnits(
      quantity,
      parseInt(decimals, 10)
    )

    grossFormatted = displayAmountInEther(
      gross,
      { decimals, precision: 8 }
    )


    net = ethers.utils.parseUnits(
      quantity,
      parseInt(decimals, 10)
    ).sub(exitFee)

    netFormatted = displayAmountInEther(
      net,
      { decimals, precision: 8 }
    )
    


    feeFormatted = displayAmountInEther(
      exitFee,
      { decimals, precision: 2 }
    )
  
    tipJsx = <>
      {t('toMaintainFairnessDescription')}

      <br /><br />
      {t('withdrawScheduledDescription', {
        amount: quantity,
        ticker
      })}

      <br /><br />
      {t('withdrawInstantDescription', {
        amount: displayAmountInEther(
          exitFee,
          { decimals, precision: 8}
        ),
        ticker
      })}
    </>
  }




  const [txId, setTxId] = useState()

  const method = 'withdrawInstantlyFrom'

  // `Withdraw ${quantity} ${tickerUpcased} (fee: $${feeFormatted})`
  const txName = t('withdrawWithFeeTxName',
    {
      quantity,
      tickerUpcased,
      feeFormatted
    }
  )

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const tx = transactions?.find((tx) => tx.id === txId)

  const runTx = async () => {
    const params = [
      usersAddress,
      ethers.utils.bigNumberify(gross),
      controlledTicketTokenAddress,
      ethers.utils.bigNumberify(exitFee)
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      PrizePoolAbi,
      poolAddress,
      method,
      params,
    )

    setTxId(id)
  }

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  return <>
    {grossFormatted && !tx?.sent && <>
      <div
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
            
        <RadioInputGroup
          label=''
          name='withdrawType'
          onChange={() => {}}
          value={'instant'}
          radios={[
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
              </>,
              description: <>
                <div
                  className='mb-2 xs:mb-0'
                >
                  {t('finalAmount')} <span
                    className='block xs:inline font-bold'
                  ><PoolNumber>{netFormatted}</PoolNumber></span>
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
          animate='enter'
          initial='exit'
          variants={{
            enter: {
              scale: 1,
              height: 'auto',
              transition: {
                duration: shouldReduceMotion ? 0 : 0.25
              }
            },
            exit: {
              scale: 0,
              height: 0,
            }
          }}
          className={classnames(
            'flex flex-col items-center justify-between w-full mx-auto rounded-xl sm:mx-auto text-inverse text-xs xs:text-sm sm:text-lg',
            'overflow-hidden py-2 xs:py-4 px-6 h-40',
          )}
          style={{
            maxWidth: 420
          }}
        >
          <CheckboxInputGroup
            large
            id='_withdrawIUnderstand'
            name='withdraw-i-understand'
            label={t('iUnderstand')}
            title={''}
            hint={null}
            checked={iUnderstandChecked}
            handleClick={handleIUnderstandChange}
          />
{/*           
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
          </label> */}

          <div>
            <Trans
              i18nKey='youChooseToPayFairnessFeeOfAmountTicker'
              defaults='You choose to pay a Fairness Fee of <bold>{{amount}} {{ticker}}</bold> in order to withdraw early.'
              components={{
                bold: <span className='font-bold' />,
              }}
              values={{
                amount: feeFormatted,
                ticker
              }}
            />
          </div>
        </motion.div>

        <div className='mt-3 xs:mt-8'>
          <Button
            textSize='lg'
            disabled={!iUnderstandChecked}
            onClick={runTx}
          >
            {t('continue')}
          </Button>
        </div> 

        <button
          onClick={(e) => {
            handleCloseWizard(router)
          }}
          className='mt-6 underline text-xxs xs:text-xs sm:text-sm'
        >
          {t('cancelWithdrawal')}
        </button>
      </div> 
      
    </>}


    {tx?.sent && !tx?.completed && <>
      <TransactionsTakeTimeMessage
        tx={tx}
        title={t('withdrawing')}
        subtitle={<Trans
          i18nKey='amountTickets'
          defaults='<number>{{amount}}</number> tickets'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
          }}
        />}
      />
    </>}

  </>

}
