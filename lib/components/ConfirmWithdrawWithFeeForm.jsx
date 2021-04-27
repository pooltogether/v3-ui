import React, { useContext, useEffect, useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PTHint } from 'lib/components/PTHint'
import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'
import { RadioInputGroup } from 'lib/components/RadioInputGroup'
import { TxStatus } from 'lib/components/TxStatus'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { useExitFees } from 'lib/hooks/useExitFees'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { handleCloseWizard } from 'lib/utils/handleCloseWizard'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import IconLightning from 'assets/images/icon-lightning.svg'
import { useTransaction } from 'lib/hooks/useTransaction'

export function ConfirmWithdrawWithFeeForm(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const shouldReduceMotion = useReducedMotion()

  const { nextStep, previousStep, pool, quantity } = props

  const { usersAddress } = useContext(AuthControllerContext)

  const underlyingToken = pool.tokens.underlyingToken
  const ticker = underlyingToken.symbol
  const decimals = underlyingToken.decimals

  const poolAddress = pool.prizePool.address
  const controlledTicketTokenAddress = pool.tokens.ticket.address

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
  let gross = ethers.BigNumber.from(0)
  let net = ethers.BigNumber.from(0)
  let grossFormatted, netFormatted, feeFormatted

  if (exitFee && quantity && decimals) {
    gross = ethers.utils.parseUnits(quantity, parseInt(decimals, 10))

    grossFormatted = displayAmountInEther(gross, { decimals, precision: 8 })

    net = ethers.utils.parseUnits(quantity, parseInt(decimals, 10)).sub(exitFee)

    netFormatted = displayAmountInEther(net, { decimals, precision: 8 })

    feeFormatted = displayAmountInEther(exitFee, { decimals, precision: 2 })

    tipJsx = (
      <>
        {t('toMaintainFairnessDescription')}

        <br />
        <br />
        {t('withdrawScheduledDescription', {
          amount: quantity,
          ticker
        })}

        <br />
        <br />
        {t('withdrawInstantDescription', {
          amount: displayAmountInEther(exitFee, { decimals, precision: 8 }),
          ticker
        })}
      </>
    )
  }

  const quantityFormatted = numberWithCommas(quantity)
  const [txId, setTxId] = useState(0)
  const method = 'withdrawInstantlyFrom'
  const txName = t('withdrawWithFeeTxName', {
    quantity: quantityFormatted,
    tickerUpcased,
    feeFormatted
  })
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  const runTx = async () => {
    const params = [
      usersAddress,
      ethers.BigNumber.from(gross),
      controlledTicketTokenAddress,
      ethers.BigNumber.from(exitFee)
    ]

    const id = await sendTx(txName, PrizePoolAbi, poolAddress, method, params)

    setTxId(id)
  }

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  return (
    <>
      {grossFormatted && !tx?.sent && (
        <>
          <div className='text-inverse'>
            <PaneTitle>
              <Trans
                i18nKey='withdrawAmountTickets'
                defaults='Withdraw <number>{{amount}}</number> tickets'
                components={{
                  number: <PoolNumber />
                }}
                values={{
                  amount: quantityFormatted
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
                  label: (
                    <>
                      {t('instantly')}{' '}
                      <PTHint className='inline-block relative -t-6 r-2' tip={tipJsx}>
                        <>
                          <div className='inline-bold relative'>
                            <QuestionMarkCircle />
                          </div>
                        </>
                      </PTHint>
                    </>
                  ),
                  description: (
                    <>
                      <div className='mb-2 xs:mb-0'>
                        {t('finalAmount')}{' '}
                        <span className='block xs:inline font-bold'>
                          <PoolNumber>{netFormatted}</PoolNumber>
                        </span>
                      </div>
                      <div className='mb-2 xs:mb-0'>
                        {t('when')} <span className='block xs:inline font-bold'>{t('now')}</span>
                      </div>
                    </>
                  )
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
                  height: 0
                }
              }}
              className={classnames(
                'flex flex-col items-center justify-between w-full mx-auto rounded-xl sm:mx-auto text-inverse text-xs xs:text-sm sm:text-lg',
                'overflow-hidden py-2 xs:py-4 px-6 h-40'
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

              <div>
                <Trans
                  i18nKey='youChooseToPayFairnessFeeOfAmountTicker'
                  defaults='You choose to pay a Fairness Fee of <bold>{{amount}} {{ticker}}</bold> in order to withdraw early.'
                  components={{
                    bold: <span className='font-bold' />
                  }}
                  values={{
                    amount: feeFormatted,
                    ticker
                  }}
                />
              </div>
            </motion.div>

            <div className='mt-3 xs:mt-8'>
              <Button textSize='lg' disabled={!iUnderstandChecked} onClick={runTx}>
                {t('confirmWithdrawal')}
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
        </>
      )}

      {tx && tx?.sent && (
        <>
          <WithdrawAndDepositPaneTitle
            label={t('withdrawTicker', {
              ticker: tickerUpcased
            })}
            pool={pool}
          />
          <WithdrawAndDepositBanner
            label={t('youreWithdrawing')}
            quantity={quantityFormatted}
            tickerUpcased={tickerUpcased}
          />
        </>
      )}
      <TxStatus hideOnInWallet tx={tx} />
    </>
  )
}
