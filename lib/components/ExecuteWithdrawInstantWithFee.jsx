import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function ExecuteWithdrawInstantWithFee(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()

  const [txExecuted, setTxExecuted] = useState(false)

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool, refetchPlayerQuery } = useContext(PoolDataContext)

  const ticker = pool?.underlyingCollateralSymbol
  const decimals = pool?.underlyingCollateralDecimals
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.prizeStrategy?.singleRandomWinner?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()

  const gross = router.query.gross
  const net = router.query.net
  const fee = router.query.fee

  const netFormatted = displayAmountInEther(
    net,
    { decimals, precision: 8 }
  )
  const feeFormatted = displayAmountInEther(
    fee,
    { decimals, precision: 8 }
  )

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
    <PaneTitle small>
      <Trans
        i18nKey='withdrawAmountTickets'
        defaults='Withdraw <number>{{amount}}</number> tickets'
        components={{
          number: <PoolNumber />,
        }}
        values={{
          amount: netFormatted
        }}
      />
    </PaneTitle>

    <PaneTitle>
      {txInWallet && t('confirmWithdrawTypePastTense', {
        withdrawType: 'instant'
      })}
    </PaneTitle>

    <div className='text-white bg-orange py-4 sm:py-6 px-5 sm:px-8 rounded-xl w-full sm:w-2/3 mx-auto'>
      <span
        className='font-bold mt-0 mb-0 text-xs xs:text-base'
      >
        <span
          className='uppercase'
          style={{
            color: 'rgba(255, 255, 255, 0.75)'
          }}
        >{t('note')}</span> <Trans
            i18nKey='youAreWithdrawingYourFundsLessFeeRightNow'
            defaults='You are withdrawing <bold><number>{{amount}}</number> {{ticker}}</bold> of your funds right now, less the <bold><number>{{fee}}</number> {{ticker}}</bold></span> fairness fee'
            components={{
              bold: <span className='font-bold' />,
              number: <PoolNumber />,
            }}
            values={{
              amount: netFormatted,
              fee: feeFormatted,
              ticker: tickerUpcased,
            }}
          />

      </span>
    </div>

    {tx?.sent && <>
      <div className='mt-10'>
        <TransactionsTakeTimeMessage
          tx={tx}
          paneMessage={<>
            {t('instant')} - {t('withdrawalConfirming')}
          </>}
        />
      </div>
    </>}
    
  </>
}
