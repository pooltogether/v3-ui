import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PrizeStrategy'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'


export const CompleteAwardUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { provider } = authControllerContext
 
  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const { canCompleteAward, prizeStrategyAddress } = pool

  const [txId, setTxId] = useState()

  const txName = `Start ${pool?.name} award process`
  const method = 'completeAward'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((todo) => todo.id === txId)

  const ongoingCompleteAwardTransactions = transactions?.
    filter(t => t.method === method && !t.cancelled && !t.completed)
  const disabled = ongoingCompleteAwardTransactions.length > 0

  const handleCompleteAwardClick = (e) => {
    e.preventDefault()

    const params = [
      {
        gasLimit: 350000
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
    {canCompleteAward && <>
      <Button
        wide
        size='lg'
        onClick={handleCompleteAwardClick}
        outline
        disabled={disabled}
      >
        Complete Award
      </Button>
    </>}
  </>
}

