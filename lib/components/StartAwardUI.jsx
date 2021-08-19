import React, { useState } from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PeriodicPrizeStrategy'
import { useSendTransaction, useTransaction, useUsersAddress } from '@pooltogether/hooks'

import { useTranslation } from 'react-i18next'
import { useCurrentPool } from 'lib/hooks/usePools'
import { ButtonTx } from 'lib/components/ButtonTx'
import { poolToast } from '@pooltogether/react-components'

export function StartAwardUI(props) {
  const { pool, isRngRequested, canStartAward, canCompleteAward, refetch } = props
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

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
