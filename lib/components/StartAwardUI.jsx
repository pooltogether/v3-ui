import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const StartAwardUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  // const {
  //   isRngCompleted,
  //   isRngRequested,
  //   canCompleteAward,
  // } = pool
  // console.log({ canStartAward, canCompleteAward, isRngCompleted, isRngRequested,})

  const canStartAward = pool?.canStartAward
  const prizeStrategyAddress = pool?.prizeStrategyAddress
  const ticker = pool?.underlyingCollateralSymbol

  const [txId, setTxId] = useState()

  const txName = `Start ${pool?.name} award process`
  const method = 'startAward'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((todo) => todo.id === txId)

  const ongoingStartAwardTransactions = transactions?.
    filter(t => t.method === method && !t.cancelled && !t.completed)
  const disabled = ongoingStartAwardTransactions.length > 0

  const handleStartAwardClick = async (e) => {
    e.preventDefault()

    const params = [
      {
        gasLimit: 200000
      }
    ]

    const id = sendTx(
      provider,
      PrizeStrategyAbi,
      prizeStrategyAddress,
      method,
      params,
    )

    setTxId(id)
  }

  return <>
    {canStartAward && <>
      <Button
        wide
        size='lg'
        outline
        onClick={handleStartAwardClick}
        disabled={disabled}
      >
        Start Award
      </Button>
    </>}
  </>
}

