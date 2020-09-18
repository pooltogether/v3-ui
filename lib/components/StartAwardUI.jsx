import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'

import SingleRandomWinnerAbi from '@pooltogether/pooltogether-contracts/abis/SingleRandomWinner'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonTx } from 'lib/components/ButtonTx'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const StartAwardUI = (props) => {
  const { t } = useTranslation()

  const authControllerContext = useContext(AuthControllerContext)
  const { provider, usersAddress } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { pool } = poolDataContext

  const canStartAward = pool?.canStartAward
  const prizeStrategyAddress = pool?.prizeStrategyAddress

  const [txId, setTxId] = useState()

  // const txName = `Start Award - ${pool?.name}`
  const txName = t(`startAwardPoolName`, {
    poolName: pool?.name
  })
  const method = 'startAward'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
  const tx = transactions?.find((tx) => tx.id === txId)

  // const ongoingStartAwardTransactions = transactions?.
  //   filter(t => t.method === method && !t.cancelled && !t.completed)
  // const disabled = ongoingStartAwardTransactions.length > 0
  const disabled = !usersAddress

  const handleStartAwardClick = async (e) => {
    e.preventDefault()

    const params = [
      {
        gasLimit: 200000
      }
    ]

    const id = sendTx(
      t,
      provider,
      usersAddress,
      SingleRandomWinnerAbi,
      prizeStrategyAddress,
      method,
      params,
    )

    setTxId(id)
  }

  return <>
    {canStartAward && <>
      <ButtonTx
        secondary
        textSize='lg'
        onClick={handleStartAwardClick}
        usersAddress={usersAddress}
      >
        {t('startAward')}
      </ButtonTx>
    </>}
  </>
}
