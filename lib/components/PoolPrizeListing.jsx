import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { PrizesTable } from 'lib/components/PrizesTable'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const PoolPrizeListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizePoolAddress: pool?.poolAddress
    },
    skip: !pool?.poolAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = data?.prizePools?.[0]?.prizes

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
        {t('thereWasAnErrorLoadingData')}
        <br />{error}
      </>}

      {prizes?.length === 0 && <>
        <BlankStateMessage>
          <div
            className='mb-4'
          >
            {t('thereAreNoPrizesYet')}
            {/* There are no prizes for this pool yet. */}
          </div>
          <ButtonLink
            secondary
            href='/pools/[symbol]/manage'
            as={`/pools/${pool?.symbol}/manage`}
          >
            {t('managePool')}
          </ButtonLink>
        </BlankStateMessage>
      </>}

      {prizes?.length > 0 && <>
        <PrizesTable
          {...props}
          pool={pool}
          prizes={prizes}
        />
      </>}
    </div>

  </>
}
