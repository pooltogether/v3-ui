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

  // const { pools } = usePools()
  const { pool } = usePool()

  const prizeId = `${pool?.id}-${prizeNumber}`

  const { data, error } = usePrizeQuery(pool, prizeId)



  if (error) {
    console.error(error)
  }
  
  let prize = data?.prize

  if (!prize?.awardedBlock) {
    router.push(`/pools/${pool.symbol}`)

    prize = {
      awardedBlock: null,
      net: pool?.grandPrizeAmountUSD
    }

    return <PrizeShow
      pool={pool}
      prize={prize}
    />
  }
  
  if (!pool) {
    return <BlankStateMessage>
      {t('couldNotFindPoolWithSymbol', {
        symbol: querySymbol
      })}
    </BlankStateMessage>
  }

  if (!prize) {
    return <div
      className='mt-10'
    >
      {prize === null ? <>
        {t('couldntFindPrize')}
      </> : <>
        <TableRowUILoader
          rows={5}
        />
      </>}
    </div>
  }
  
  return <TimeTravelPool
    blockNumber={parseInt(prize?.awardedBlock, 10)}
    poolAddress={pool.id}
    querySymbol={querySymbol}
    prize={prize}
  >
    {(timeTravelPool) => {
      return <PrizeShow
        pool={timeTravelPool}
        prize={prize}
      />
    }}
  </TimeTravelPool>

}
