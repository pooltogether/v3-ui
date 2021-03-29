import React from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { usePool } from 'lib/hooks/usePool'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PrizeShow } from 'lib/components/PrizeShow'
import { PrizeShowUILoader } from 'lib/components/PrizeShowUILoader'
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

  const { isFetched, data, error } = usePrizeQuery(pool, prizeId)
  if (error) {
    console.error(error)
  }

  let prize = data?.prize

  if (!pool.version) {
    return (
      <BlankStateMessage>
        {t('couldNotFindPoolWithSymbol', {
          symbol: querySymbol
        })}
      </BlankStateMessage>
    )
  }

  if (!isFetched) {
    return <PrizeShowUILoader />
  }

  if (prize === null) {
    return (
      <div className='mt-10'>
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
      </div>
    )
  }

  return (
    <TimeTravelPool
      poolSplitExternalErc20Awards={pool?.splitExternalErc20Awards}
      blockNumber={parseInt(prize?.awardedBlock, 10)}
      pool={pool}
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
