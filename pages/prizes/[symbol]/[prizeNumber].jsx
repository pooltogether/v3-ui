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

  const querySymbol = router.query?.symbol
  const prizeNumber = router.query?.prizeNumber

  const { paused } = useContext(GeneralContext)
  const { pool, pools } = useContext(PoolDataContext)

  // We use the pre-existing / current pool information we've downloaded from the Graph to learn
  // if this is a historical prize or an upcoming prize
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

  if (error) {
    console.error(error)
  }
  
  let prize = data?.prize


  if (isCurrentPrize) {
    prize = {
      awardedBlock: null,
      net: pool?.prizeAmountUSD
    }

    return <PrizeShow
      pool={pool}
      prize={prize}
    />
  }
  



  if (pools?.length > 0 && !pool) {
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
    poolAddress={poolAddress}
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
