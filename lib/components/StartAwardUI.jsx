import React, { useContext, useState } from 'react'
import { useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { ButtonTx } from 'lib/components/ButtonTx'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'

export function StartAwardUI(props) {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)
  
  const { provider, usersAddress } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const canStartAward = pool?.canStartAward
  const prizeStrategyAddress = pool?.prizeStrategy?.id

  const [txId, setTxId] = useState()

  // const txName = `Start Award - ${pool?.name}`
  const txName = t(`startAwardPoolName`, {
    poolName: pool?.name
  })
  const method = 'startAward'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  const tx = transactions?.find((tx) => tx.id === txId)

  // const ongoingStartAwardTransactions = transactions?.
  //   filter(t => t.method === method && !t.cancelled && !t.completed)
  // const disabled = ongoingStartAwardTransactions.length > 0
  const disabled = !usersAddress

  const handleStartAwardClick = async (e) => {
    e.preventDefault()

    const params = [
      // {
      //   gasLimit: 325000
      // }
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      getPrizeStrategyAbiFromPool(pool),
      prizeStrategyAddress,
      method,
      params,
    )

    setTxId(id)
  }

  return <>
    {canStartAward && <>
      <ButtonTx
        text='green'
        border='green'
        hoverBorder='green'
        textSize='lg'
        onClick={handleStartAwardClick}
        usersAddress={usersAddress}
      >
        {t('startAward')}
      </ButtonTx>
    </>}
  </>
}
