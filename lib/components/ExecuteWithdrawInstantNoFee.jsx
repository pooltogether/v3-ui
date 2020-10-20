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
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const ExecuteWithdrawInstantNoFee = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep } = props
  
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool, refetchPlayerQuery } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const tickerUpcased = pool?.underlyingCollateralSymbol?.toUpperCase()
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket?.id

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const txMainName = `${t('withdraw')}: ${quantity} ${t('tickets')}`
  const txSubName = `${quantity} ${tickerUpcased}`
  const txName = `${txMainName} (${txSubName})`
  const method = 'withdrawInstantlyFrom'

  const [sendTx] = useSendTransaction(txName, refetchPlayerQuery)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const updateParamsAndNextStep = () => {
    queryParamUpdater.add(router, { withdrawType: 'instantNoFee' })

    nextStep()
  }

  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      // there should be no exit fee when we do an instant no-fee withdrawal
      const maxExitFee = '0'

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        ethers.utils.parseEther(maxExitFee),
        {
          gasLimit: 700000
        }
      ]

      const id = sendTx(
        t,
        provider,
        usersAddress,
        PrizePoolAbi,
        poolAddress,
        method,
        params
      )
      
      setTxId(id)
    }

    if (!txExecuted && quantity && decimals) {
      runTx()
    }
  }, [quantity, decimals])

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      updateParamsAndNextStep()
    }
  }, [tx])

  return <>
    <PaneTitle small>
      {tx?.inWallet && <>
        <Trans
          i18nKey='withdrawAmountTickets'
          defaults='Withdraw <number>{{amount}}</number> tickets'
          components={{
            number: <PoolNumber />,
          }}
          values={{
            amount: quantity,
          }}
        />

        <span
          className='text-accent-3 opacity-50'
        >
          <br />{txSubName}
        </span>
      </> }
    </PaneTitle>

    {tx?.sent && !tx?.completed && <>
      <TransactionsTakeTimeMessage
        tx={tx}
        paneMessage={<>
          {tx?.sent && t('withdrawalConfirming')}
          {tx?.inWallet && t('confirmWithdrawal')}
        </>}
      />
    </>}
  </>
}
