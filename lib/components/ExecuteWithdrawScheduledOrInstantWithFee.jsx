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
import { PoolNumber } from 'lib/components/PoolNumber'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

const quantityForParseUnits = (quantity, decimals) => {
  const quantityParts = quantity.split('.')
  let quantityForParseUnits = quantityParts?.[0]

  if (quantityParts[1]) {
    quantityForParseUnits += `.${quantityParts[1].substr(0, parseInt(decimals, 10))}`
  }

  return quantityForParseUnits
}

export const ExecuteWithdrawScheduledOrInstantWithFee = (props) => {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const withdrawType = router.query.withdrawType

  const [txExecuted, setTxExecuted] = useState(false)

  const timelockDurationSeconds = router.query.timelockDurationSeconds
  const fee = router.query.fee
  const net = router.query.net

  const scheduledWithdrawal = withdrawType && withdrawType === 'scheduled'
  const instantWithdrawal = withdrawType && withdrawType === 'instant'

  let formattedFutureDate
  if (scheduledWithdrawal && timelockDurationSeconds) {
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
    txName = `Schedule withdrawal ${net} ${tickerUpcased}`
  } else if (instantWithdrawal) {
    txName = `Withdraw ${net} ${tickerUpcased} instantly (fee: ${fee} ${tickerUpcased})`
  }

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
        ethers.utils.parseUnits(
          quantityForParseUnits(net, decimals),
          parseInt(decimals, 10)
        ),
        controlledTokenAddress,
      ]

      if (instantWithdrawal) {
        params.push(
          ethers.utils.parseUnits(
            quantityForParseUnits(fee, decimals),
            parseInt(decimals, 10)
          )
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
      
      <Trans
        i18nKey='withdrawAmountTickets'
        defaults='Withdraw <number>{{amount}}</number> tickets'
        components={{
          number: <PoolNumber />,
        }}
        values={{
          amount: net
        }}
      />
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
            defaults='You are scheduling <bold><number>{{amount}}</number> {{ticker}}</bold>. Your funds will be ready for withdrawal in: '
            components={{
              bold: <span className='font-bold' />,
              number: <PoolNumber />,
            }}
            values={{
              amount: net,
              ticker: tickerUpcased,
            }}
          /> <span className='font-bold'>{formattedFutureDate}</span>
        </>} {instantWithdrawal && <>
          <Trans
            i18nKey='youAreWithdrawingYourFundsLessFeeRightNow'
            defaults='You are withdrawing <bold><number>{{amount}}</number> {{ticker}}</bold> of your funds right now, less the <bold><number>{{fee}}</number> {{ticker}}</bold></span> fairness fee'
            components={{
              bold: <span className='font-bold' />,
              number: <PoolNumber />,
            }}
            values={{
              amount: net,
              fee: fee,
              ticker: tickerUpcased,
            }}
          />
        </>}

      </span>
    </div>

    {tx?.sent && <>
      <div className='mt-10'>
        <TransactionsTakeTimeMessage
          tx={tx}
          paneMessage={<>
            {t(withdrawTypeKey)} - {t('withdrawalConfirming')}
          </>}
        />
      </div>
    </>}
    
  </>
}
