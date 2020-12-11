import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
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

  const { chainId, pauseQueries } = useContext(AuthControllerContext)
  const { pool, pools } = useContext(PoolDataContext)

  const poolAddress = pool?.poolAddress


  const prizeId = `${poolAddress}-${prizeNumber}`

  const { status, data, error, isFetching } = usePrizeQuery(pauseQueries, chainId, pool, prizeId)



  if (error) {
    console.error(error)
  }
  
  let prize = data?.prize

  if (!prize?.awardedBlock) {
    prize = {
      awardedBlock: null,
      net: pool?.grandPrizeAmountUSD
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
