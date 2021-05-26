import React from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'react-i18next'
import { useCurrentPool } from 'lib/hooks/usePools'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PrizeShow } from 'lib/components/PrizeShow'
import { PrizeShowUILoader } from 'lib/components/loaders/PrizeShowUILoader'
import { usePastPrize } from 'lib/hooks/usePastPrizes'
import { useHistoricPool } from 'lib/hooks/useHistoricPool'
import { usePoolContractBySymbol } from 'lib/hooks/usePoolContracts'

function PrizeShowPage(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const querySymbol = router.query?.symbol
  const prizeNumber = router.query?.prizeNumber

  const poolContract = usePoolContractBySymbol(querySymbol)
  const { data: pool, isFetched: poolIsFetched } = useCurrentPool()
  const { data: prize, isFetched: prizeIsFetched } = usePastPrize(pool, prizeNumber)
  const { data: historicPools, isFetched: historicPoolsIsFetched } = useHistoricPool(
    pool?.chainId,
    poolContract,
    prize?.awardedBlock
  )

  if (!poolIsFetched || !prizeIsFetched || !historicPoolsIsFetched) {
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

            router.push(`/pools/${pool.networkName}/${querySymbol}`)
          }}
        >
          {t('viewPool')}
        </button>
      </div>
    )
  }

  return (
    <PrizeShow
      pool={pool}
      preAwardPool={historicPools.preAward}
      postAwardPool={historicPools.postAward}
      prize={prize}
    />
  )
}

export default PrizeShowPage
