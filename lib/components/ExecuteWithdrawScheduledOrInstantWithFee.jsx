import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { FormattedFutureDateCountdown } from 'lib/components/FormattedFutureDateCountdown'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const ExecuteWithdrawScheduledOrInstantWithFee = (props) => {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const withdrawType = router.query.withdrawType

  const [txExecuted, setTxExecuted] = useState(false)

  // const quantity = router.query.quantity
  const timelockDurationSeconds = router.query.timelockDurationSeconds
  const fee = router.query.fee
  const quantity = router.query.net
  // const net = router.query.net
  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'
  const instantWithdrawal = withdrawType && withdrawType === 'instant'

  let formattedFutureDate
  if (timelockDurationSeconds) {
    formattedFutureDate = <FormattedFutureDateCountdown
      futureDate={Number(timelockDurationSeconds)}
    />
  }

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool, refetchPlayerQuery } = useContext(PoolDataContext)

  const ticker = pool?.underlyingCollateralSymbol
  const decimals = pool?.underlyingCollateralDecimals
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()




  const [txId, setTxId] = useState()

  let method
  if (scheduledWithdrawal) {
    method = 'withdrawWithTimelockFrom'
  } else if (instantWithdrawal) {
    method = 'withdrawInstantlyFrom'
  }

  let txName
  if (scheduledWithdrawal) {
    txName = `Schedule withdrawal ${quantity} ${tickerUpcased}`
  } else if (instantWithdrawal) {
    txName = `Withdraw ${quantity} ${tickerUpcased} instantly (fee: $${fee} ${tickerUpcased})`
  }

  const [sendTx] = useSendTransaction(txName, refetchPlayerQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const txInWallet = tx?.inWallet && !tx?.sent
  const txSent = tx?.sent && !tx?.completed
  const txCompleted = tx?.completed
  const txError = tx?.error

  useEffect(() => {
    const runTx = () => {
      setTxExecuted(true)

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,  
          Number(decimals)
        ),
        controlledTokenAddress,
      ]

      if (instantWithdrawal) {
        params.push(
          ethers.utils.parseEther(fee)
        )
      }
      
      params.push({
        gasLimit: 500000
      })

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

    if (!txExecuted && quantity) {
      runTx()
    }
  }, [quantity])

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  let withdrawTypeKey
  if (scheduledWithdrawal) {
    withdrawTypeKey = 'scheduled'
  } else if (instantWithdrawal) {
    withdrawTypeKey = 'instant'
  }

  return <>
    <PaneTitle small>
      {scheduledWithdrawal && <>
        <span
          className={`text-xl`}
          role='img'
          aria-label='alarm clock'
        >⏰</span>
        <br />
      </>}
      {t('withdrawAmountTickets', { 
        amount: quantity
      })}
    </PaneTitle>

    <PaneTitle>
      {txInWallet && t('confirmWithdrawTypePastTense', {
        withdrawType: withdrawTypeKey
      })}
    </PaneTitle>

    <div className='text-white bg-yellow py-4 sm:py-6 px-5 sm:px-8 rounded-xl w-full sm:w-2/3 mx-auto'>
      <span
        className='font-bold mt-0 mb-0 text-xs xs:text-base'
      >
        <span
          className='uppercase'
          style={{
            color: 'rgba(255, 255, 255, 0.75)'
          }}
        >{t('note')}</span> {scheduledWithdrawal && <>
          <Trans
            i18nKey='youAreSchedulingAndYourFundsWillBeReadyInFutureDate'
            defaults='You are scheduling <bold>{{amount}} {{ticker}}</bold>. Your funds will be ready for withdrawal in: '
            components={{
              bold: <span className='font-bold' />,
            }}
            values={{
              amount: quantity,
              ticker: tickerUpcased,
            }}
          /> <span className='font-bold'>{formattedFutureDate}</span>
        </>} {instantWithdrawal && <>
          <Trans
            i18nKey='youAreWithdrawingYourFundsLessFeeRightNow'
            defaults='You are withdrawing <bold>{{amount}} {{ticker}}</bold> of your funds right now, less the <bold>{{fee}} {{ticker}}</bold></span> fairness fee'
            components={{
              bold: <span className='font-bold' />,
            }}
            values={{
              amount: quantity,
              fee: fee,
              ticker: tickerUpcased,
            }}
          />
        </>}

      </span>
    </div>

    {tx?.sent && <TransactionsTakeTimeMessage
      tx={tx}
      paneMessage={<>
        {t(withdrawTypeKey)} - {t('withdrawalConfirming')}
      </>}
    />}
    
  </>
}
