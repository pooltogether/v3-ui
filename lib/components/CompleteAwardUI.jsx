import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'

import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const [txId, setTxId] = useState()

  const txName = t(`completeAwardPoolName`, { poolName: pool?.name })
  const method = 'completeAward'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
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
      pool?.prizeStrategy?.id,
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
