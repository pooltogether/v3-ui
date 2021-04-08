import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { useCurrentPool } from 'lib/hooks/usePools'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()
  const { pool, refetchAllPoolData } = usePool()
  const sendTx = useSendTransaction()

  const handleCompleteAwardClick = async (e) => {
    e.preventDefault()

    const params = []

    sendTx(
      t(`completeAwardPoolName`, { poolName: pool?.name }),
      getPrizeStrategyAbiFromPool(pool),
      pool?.prizeStrategy?.id,
      'completeAward',
      params,
      refetchAllPoolData
    )
  }

  return (
    <>
      {pool?.canCompleteAward && (
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
