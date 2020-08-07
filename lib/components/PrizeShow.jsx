import React, { useContext } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { Meta } from 'lib/components/Meta'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { prizeQuery } from 'lib/queries/prizeQuery'

export const PrizeShow = (
  props,
) => {
  const router = useRouter()
  const prizeNumber = router.query?.prizeNumber

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  if (pool === null) {
    const querySymbol = router.query?.symbol
    return <BlankStateMessage>
      Could not find pool with symbol: ${querySymbol}
    </BlankStateMessage>
  }
  
  const prizeStrategyAddress = pool?.prizeStrategyAddress

  const prizeId = `${prizeStrategyAddress}-${prizeNumber}`
  const { loading, error, data } = useQuery(prizeQuery, {
    variables: {
      prizeId
    },
    skip: !prizeStrategyAddress || !prizeNumber,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prize = data?.prize
  console.log({prize})

  if (prize === null) {
    return <div
      className='mt-10'
    >
      Couldn't find prize
    </div>
  }

  if (!prize) {
    return <div
      className='mt-10'
    >
      <IndexUILoader />
    </div>
  }

  return <>
    <Meta title={`${pool?.name} Prize #${prizeNumber}`} />

    <div
      className='flex flex-col items-center text-center'
    >
      <div
        className='inline-block text-2xl font-bold pb-4'
      >
        Prizes
      </div>

      <div>
        <div className='text-lg'>
          Total awarded:
        </div>
        <br />
        <div className='text-3xl -mt-6 text-flashy font-bold font-number'>
          $23,994
        </div>
      </div>
    </div>

    <div
      className='bg-default mt-6 mb-6 text-sm py-4 flex items-center justify-center'
    >
      <div className='flex flex-col items-center justify-center text-lg'>
        <PoolCurrencyIcon
          pool={pool}
        /> <div className='mt-1'>
          <Link
            href='/prizes/[symbol]'
            as={`/prizes/${pool?.symbol}`}
          >
            <a>
              {pool?.name}
            </a>
          </Link>
        </div>
      </div>
    </div>

    <br />Prize:
    <br />{prize?.awardedTimestamp}
    <br />{prize?.balance}
    <br />{prize?.id}
    <br />{prize?.prize}
    <br />{prize?.awardedBlock}
    <br />{prize?.prizePeriodStartedAt}
    <br />{prize?.winners}

    <PrizePlayerListing
      pool={pool}
      prize={prize}
    />

  </>
}
