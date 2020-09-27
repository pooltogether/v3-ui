import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { useTranslation } from 'lib/../i18n'
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

  let method = 'withdrawInstantlyFrom'
  if (scheduledWithdrawal) {
    method = 'withdrawWithTimelockFrom'
  }

  let txName = `Withdraw ${quantity} ${tickerUpcased} instantly (fee: $${fee} ${tickerUpcased})`
  if (scheduledWithdrawal) {
    txName = `Schedule withdrawal ${quantity} ${tickerUpcased}`
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

      if (!scheduledWithdrawal) {
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

  const formattedWithdrawType = scheduledWithdrawal ? 'Schedule' : 'Instant'
  // yes this string is different:
  const formattedWithdrawTypePastTense = scheduledWithdrawal ? 'Scheduled' : 'Instant'

  return <>
    <PaneTitle small>
      {txInWallet && `Withdraw ${quantity} tickets`}
    </PaneTitle>

    <PaneTitle>
      {txInWallet && `Confirm ${formattedWithdrawTypePastTense} withdrawal`}
      {txSent && `${formattedWithdrawType} Withdrawal confirming...`}
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
        >Note: </span>{scheduledWithdrawal ? <>
          You are scheduling <span className='font-bold'>${quantity} DAI</span>. Your funds will be ready for withdrawal in: <br />
          <span className='font-bold'>{formattedFutureDate}</span>
        </> : <>
          You are withdrawing <span className='font-bold'>${quantity} {tickerUpcased}</span> of your funds right now, less the <span className='font-bold'>${fee} {tickerUpcased}</span> fairness fee
        </>}
      </span>
    </div>

    <div className='mt-10'>
      <PaneTitle small>
        {tx?.sent && <>{formattedWithdrawTypePastTense} {t('withdrawalConfirming')}</>}
      </PaneTitle>
    </div>

    <TransactionsTakeTimeMessage
      tx={tx}
    />
    
  </>
}
