import React from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PeriodicPrizeStrategy'
import { useRouter } from 'next/router'
import { Button } from '@pooltogether/react-components'
import { useCurrentPool } from '@pooltogether/hooks'

import { useTranslation } from 'react-i18next'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()

  const router = useRouter()
  const { data: pool, refetch: refetchPoolChainData } = useCurrentPool(router)

  const sendTx = useSendTransaction()

  const handleCompleteAwardClick = async (e) => {
    e.preventDefault()

    const params = []

    sendTx(
      t(`completeAwardPoolName`, { poolName: pool.name }),
      PrizeStrategyAbi,
      pool.prizeStrategy.address,
      'completeAward',
      params,
      refetchPoolChainData
    )
  }

  return (
    <>
      {pool.prize.canCompleteAward && (
        <>
          <Button
            text='green'
            border='green'
            hoverBorder='green'
            textSize='lg'
            onClick={handleCompleteAwardClick}
          >
            Complete Award
          </Button>
        </>
      )}
    </>
  )
}
