import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const ExecuteWithdrawInstantNoFee = (props) => {
  const router = useRouter()
  const quantity = router.query.quantity

  const { nextStep, previousStep } = props
  
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.ticket

  const [txExecuted, setTxExecuted] = useState(false)
  const [txId, setTxId] = useState()

  const txName = `Withdraw ${quantity} tickets ($${quantity} ${ticker})`
  const method = 'withdrawInstantlyFrom'

  const [sendTx] = useSendTransaction(txName)

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

      const sponsoredExitFee = '0'
      const maxExitFee = '1'

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        ethers.utils.parseEther(sponsoredExitFee),
        ethers.utils.parseEther(maxExitFee),
        {
          gasLimit: 500000
        }
      ]

      const id = sendTx(
        provider,
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
      {tx?.inWallet && txName}
    </PaneTitle>

    <PaneTitle>
      {tx?.sent && 'Withdrawal confirming ...'}
      {tx?.inWallet && 'Confirm withdrawal'}
    </PaneTitle>

    {tx?.sent && !tx?.completed && <TransactionsTakeTimeMessage />}
  </>
}
