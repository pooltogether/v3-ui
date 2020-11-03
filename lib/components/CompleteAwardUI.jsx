import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const [txId, setTxId] = useState()

  const txName = t(`completeAwardPoolName`, { poolName: pool?.name })
  const method = 'completeAward'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  const ongoingCompleteAwardTransactions = transactions?.
    filter(t => t.method === method && !t.cancelled && !t.completed)
  // const disabled = ongoingCompleteAwardTransactions.length > 0

  const handleCompleteAwardClick = async (e) => {
    e.preventDefault()

    const params = [
      // {
      //   gasLimit: 500000
      // }
    ]

    const id = sendTx(
      t,
      provider,
      usersAddress,
      SingleRandomWinnerAbi,
      pool?.prizeStrategyAddress,
      method,
      params,
    )

    setTxId(id)
  }

  return <>
    {pool?.canCompleteAward && <>
      <Button
        text='green'
        border='green'
        hoverBorder='green'
        textSize='lg'
        onClick={handleCompleteAwardClick}
        // disabled={disabled}
      >
        Complete Award
      </Button>
    </>}
  </>
}
