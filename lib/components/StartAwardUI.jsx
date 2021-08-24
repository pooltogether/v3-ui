import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { poolToast } from '@pooltogether/react-components'
import { useSendTransaction, useTransaction } from '@pooltogether/hooks'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PeriodicPrizeStrategy'

import { ButtonTx } from 'lib/components/ButtonTx'

export function StartAwardUI(props) {
  const { pool, canStartAward, refetch } = props
  const { t } = useTranslation()

  const prizeStrategyAddress = pool.prizeStrategy.address

  const txName = t(`startAwardPoolName`, {
    poolName: pool.name
  })
  const method = 'startAward'
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction(t, poolToast)
  const tx = useTransaction(txId)

  const handleStartAwardClick = async (e) => {
    e.preventDefault()

    const params = []

    const id = await sendTx({
      name: txName,
      contractAbi: PrizeStrategyAbi,
      contractAddress: prizeStrategyAddress,
      method,
      params,
      callbacks: { refetch }
    })

    setTxId(id)
  }

  return (
    <>
      {canStartAward && (
        <>
          <ButtonTx
            disabled={tx?.inWallet || tx?.sent}
            chainId={pool.chainId}
            text='green'
            border='green'
            hoverBorder='green'
            textSize='lg'
            onClick={handleStartAwardClick}
          >
            {t('startAward')}
          </ButtonTx>
        </>
      )}
    </>
  )
}
