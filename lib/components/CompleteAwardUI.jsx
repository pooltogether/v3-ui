import React, { useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PeriodicPrizeStrategy'
import { Button, poolToast } from '@pooltogether/react-components'
import { useSendTransaction, useTransaction } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'

import { ButtonTx } from 'lib/components/ButtonTx'

export function CompleteAwardUI(props) {
  const { pool, isRngRequested, canStartAward, canCompleteAward, refetch } = props

  const { t } = useTranslation()
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction(t, poolToast)
  const tx = useTransaction(txId)

  const handleCompleteAwardClick = async (e) => {
    e.preventDefault()

    const params = []

    const id = await sendTx({
      name: t(`completeAwardPoolName`, { poolName: pool.name }),
      contractAbi: PrizeStrategyAbi,
      contractAddress: pool.prizeStrategy.address,
      method: 'completeAward',
      params,
      callbacks: { refetch }
    })
    setTxId(id)
  }

  return (
    <>
      {canCompleteAward && (
        <>
          <ButtonTx
            disabled={tx?.inWallet || tx?.sent}
            chainId={pool.chainId}
            text='green'
            border='green'
            hoverBorder='green'
            textSize='lg'
            onClick={handleCompleteAwardClick}
          >
            Complete Award
          </ButtonTx>
        </>
      )}
    </>
  )
}
