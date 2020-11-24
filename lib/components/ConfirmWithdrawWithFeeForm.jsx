import React, { useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Trans, useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PTHint } from 'lib/components/PTHint'
import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

import IconLightning from 'assets/images/icon-lightning.svg'

export function ConfirmWithdrawWithFeeForm(props) {
  const { t } = useTranslation()
  const router = useRouter()
  
  const { nextStep, pool, exitFees, quantity } = props

  const [iUnderstandChecked, setIUnderstandChecked] = useState(false)

  const handleIUnderstandChange = (e) => {
    setIUnderstandChecked(!iUnderstandChecked)
  }

  const underlyingCollateralDecimals = pool && pool.underlyingCollateralDecimals
  const underlyingCollateralSymbol = pool && pool.underlyingCollateralSymbol

  const {
    exitFee
  } = exitFees

  let instantPartial = ethers.utils.bigNumberify(0)

  if (quantity && underlyingCollateralDecimals) {
    instantPartial = ethers.utils.parseUnits(
      quantity,
      parseInt(underlyingCollateralDecimals, 10)
    ).sub(exitFee)
  }
 
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

    queryParamUpdater.add(router, {
      gross: gross.toString(),
      net: instantPartial.toString(),
      fee: exitFee.toString(),
    })

    nextStep()
  }

  const handleWithdrawTypeChange = (e) => {

  }


  const [txId, setTxId] = useState()

  const method = 'withdrawInstantlyFrom'

  const txName = `Withdraw ${netFormatted} ${tickerUpcased} instantly (fee: ${feeFormatted} ${tickerUpcased})`

  const [sendTx] = useSendTransaction(txName, refetchPlayerQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const txInWallet = tx?.inWallet && !tx?.sent

  useEffect(() => {
    const runTx = () => {
      setTxExecuted(true)

      const params = [
        usersAddress,
        ethers.utils.bigNumberify(gross),
        controlledTokenAddress,
        ethers.utils.bigNumberify(fee)
      ]

      const id = sendTx(
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

    if (!txExecuted && net && method) {
      runTx()
    }
  }, [net, method])

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  return <>
    {!tx?.sent && <>
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
          onChange={handleWithdrawTypeChange}
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
          animate='enter'
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
            'bg-orange-darkened border-2 border-dashed border-orange overflow-hidden py-2 xs:py-4 px-6',
            'h-40'
          )}
        >
          <div
            className='order-last sm:order-first sm:w-3/12'
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
            className='order-first sm:order-last sm:w-9/12 text-xxxs xs:text-sm sm:text-base'
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
        </motion.div>

        <div className='mt-3 xs:mt-8'>
          <Button
            textSize='lg'
            disabled={!iUnderstandChecked}
            onClick={updateParamsAndNextStep}
          >
            {t('continue')}
          </Button>
        </div> 
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
