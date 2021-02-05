import React, { useContext, useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePool } from 'lib/hooks/usePool'
import { ButtonTx } from 'lib/components/ButtonTx'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'
import { useTransaction } from 'lib/hooks/useTransaction'

export function StartAwardUI(props) {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool } = usePool()

  const canStartAward = pool?.canStartAward
  const prizeStrategyAddress = pool?.prizeStrategy?.id

  const txName = t(`startAwardPoolName`, {
    poolName: pool?.name,
  })
  const method = 'startAward'
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

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
      txName,
      getPrizeStrategyAbiFromPool(pool),
      prizeStrategyAddress,
      method,
      params
    )

    setTxId(id)
  }

  return (
    <>
      {canStartAward && (
        <>
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
        </>
      )}
    </>
  )
}
