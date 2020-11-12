import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PrizeShow } from 'lib/components/PrizeShow'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { prizeQuery } from 'lib/queries/prizeQuery'

export default function PrizeShowPage(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const prizeNumber = router.query?.prizeNumber

  const { paused } = useContext(GeneralContext)
  const { pool } = useContext(PoolDataContext)

  const isCurrentPrize = Number(pool?.prizesCount) + 1 === Number(prizeNumber)
  const poolAddress = pool?.poolAddress



  const prizeId = `${poolAddress}-${prizeNumber}`
  const { loading, error, data } = useQuery(prizeQuery, {
    variables: {
      prizeId
    },
    skip: !poolAddress || !prizeNumber || isCurrentPrize,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  let prize = data?.prize





  if (pool === null) {
    const querySymbol = router.query?.symbol
    return <BlankStateMessage>
      Could not find pool with symbol: ${querySymbol}
    </BlankStateMessage>
  }


  if (error) {
    console.error(error)
  }

  if (prize === null) {
    return <div
      className='mt-10'
    >
      {t('couldntFindPrize')}
    </div>
  }

  if (!prize) {
    return <div
      className='mt-10'
    >
      <TableRowUILoader
        rows={5}
      />
    </div>
  }


  if (isCurrentPrize) {
    prize = {
      awardedBlock: null,
      net: pool?.prizeEstimate
    }

    return <PrizeShow
      pool={pool}
      prize={prize}
    />
  } else {
    return <TimeTravelPool
      blockNumber={parseInt(prize?.awardedBlock, 10)}
      poolAddress={poolAddress}
    >
      {(timeTravelPool) => {
        return <PrizeShow
          pool={timeTravelPool}
          prize={prize}
        />
      }}
    </TimeTravelPool>
    
  }

}
