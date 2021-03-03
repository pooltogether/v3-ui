import React from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { usePool } from 'lib/hooks/usePool'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PrizeShow } from 'lib/components/PrizeShow'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { usePrizeQuery } from 'lib/hooks/usePrizeQuery'

export default function PrizeShowPage(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const querySymbol = router.query?.symbol
  const prizeNumber = router.query?.prizeNumber

  // need the pool to get the historical prize ... chicken & egg
  let { pool } = usePool(querySymbol)

  const prizeId = `${pool?.id}-${prizeNumber}`

  const { data, error } = usePrizeQuery(pool, prizeId)
  if (error) {
    console.error(error)
  }

  let prize = data?.prize

  if (!pool) {
    return (
      <BlankStateMessage>
        {t('couldNotFindPoolWithSymbol', {
          symbol: querySymbol,
        })}
      </BlankStateMessage>
    )
  }

  if (!prize) {
    return (
      <div className='mt-10'>
        {prize === null ? (
          <>
            {t('couldntFindPrize')}
            <br />
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault()

                router.push(`/pools/${querySymbol}`)
              }}
            >
              {t('viewPool')}
            </button>
          </>
        ) : (
          <>
            <TableRowUILoader rows={5} />
          </>
        )}
      </div>
    )
  }

  return (
    <TimeTravelPool
      poolSplitExternalErc20Awards={pool?.splitExternalErc20Awards}
      blockNumber={parseInt(prize?.awardedBlock, 10)}
      poolAddress={pool.id}
      querySymbol={querySymbol}
      prize={prize}
    >
      {({ preAwardTimeTravelPool, timeTravelPool }) => {
        return (
          <PrizeShow
            postAwardTimeTravelPool={timeTravelPool}
            preAwardTimeTravelPool={preAwardTimeTravelPool}
            prize={prize}
          />
        )
      }}
    </TimeTravelPool>
  )
}
