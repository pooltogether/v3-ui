import React, { useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts/abis/PeriodicPrizeStrategy'
import { useUsersAddress } from '@pooltogether/hooks'

import { useTranslation } from 'lib/../i18n'
import { useCurrentPool } from 'lib/hooks/usePools'
import { ButtonTx } from 'lib/components/ButtonTx'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { useTransaction } from 'lib/hooks/useTransaction'

export function StartAwardUI(props) {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()
  const { data: pool, refetch: refetchPoolData } = useCurrentPool()

  const canStartAward = pool.prize.canStartAward
  const prizeStrategyAddress = pool.prizeStrategy.address

  const txName = t(`startAwardPoolName`, {
    poolName: pool.name
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
      PrizeStrategyAbi,
      prizeStrategyAddress,
      method,
      params,
      refetchPoolData
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
