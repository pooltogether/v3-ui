import React from 'react'
import PrizeStrategyAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PeriodicPrizeStrategy'
import { Button } from '@pooltogether/react-components'

import { useTranslation } from 'react-i18next'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()
  const { data: pool, refetch: refetchPoolChainData } = useCurrentPool()
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
