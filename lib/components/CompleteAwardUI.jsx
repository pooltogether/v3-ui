import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { usePool } from 'lib/hooks/usePool'
import { Button } from 'lib/components/Button'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { getPrizeStrategyAbiFromPool } from 'lib/services/getPrizeStrategyAbiFromPool'

export function CompleteAwardUI(props) {
  const { t } = useTranslation()
  const { pool } = usePool()
  const sendTx = useSendTransaction()

  const handleCompleteAwardClick = async (e) => {
    e.preventDefault()

    const params = []

    sendTx(
      t(`completeAwardPoolName`, { poolName: pool?.name }),
      getPrizeStrategyAbiFromPool(pool),
      pool?.prizeStrategy?.id,
      'completeAward',
      params
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
            // disabled={disabled}
          >
            Complete Award
          </Button>
        </>
      )}
    </>
  )
}
