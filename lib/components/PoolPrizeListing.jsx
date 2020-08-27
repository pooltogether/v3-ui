import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { PrizesTable } from 'lib/components/PrizesTable'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const PoolPrizeListing = (
  props,
) => {
  const { pool } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizeStrategyAddress: pool?.prizeStrategyAddress
    },
    skip: !pool?.prizeStrategyAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = data?.prizeStrategy?.prizes

  if (loading) {
    return <div
      className='mt-10'
    >
      <TableRowUILoader
        rows={5}
      />
    </div>
  }

  return <>
    <div
      className='flex flex-col items-center text-center mt-4'
    >
      {!prizes || loading && <>
        <IndexUILoader />
      </>}

      {error && <>
        There was an issue loading data:
        {error}
      </>}

      {prizes?.length === 0 && <>
        <BlankStateMessage>
          <div
            className='mb-4'
          >
            There are no prizes for this pool yet.
          </div>
          <ButtonLink
            secondary
            href='/pools/[symbol]/manage'
            as={`/pools/${pool?.symbol}/manage`}
          >
            Manage pool
          </ButtonLink>
        </BlankStateMessage>
      </>}

      <PrizesTable
        pool={pool}
        prizes={prizes} 
      />
    </div>

  </>
}
