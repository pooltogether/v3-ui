import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePools } from 'lib/hooks/usePools'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool } = usePools()

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

    const params = []

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      getPrizeStrategyAbiFromPool(pool),
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
