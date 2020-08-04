import React, { useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TransactionsTakeTimeMessage } from 'lib/components/TransactionsTakeTimeMessage'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const ExecuteCryptoDeposit = (props) => {
  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

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

  const txName = `Deposit ${quantity} tickets ($${quantity} ${ticker})`
  const method = 'depositTo'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((todo) => todo.id === txId)



  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      const params = [
        usersAddress,
        ethers.utils.parseUnits(
          quantity,
          Number(decimals)
        ),
        controlledTokenAddress,
        {
          gasLimit: 550000
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
      nextStep()
    }
  }, [tx])

  return <>
    <PaneTitle small>
      {tx?.inWallet && txName}
    </PaneTitle>

    <PaneTitle>
      {tx?.sent && 'Deposit confirming ...'}
      {tx?.inWallet && 'Confirm deposit'}
    </PaneTitle>

    {tx?.sent && !tx?.completed && <TransactionsTakeTimeMessage />}
  </>
}
