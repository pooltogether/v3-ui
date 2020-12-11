import React, { useContext } from 'react'

import { useTranslation } from 'lib/../i18n'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { PrizesTable } from 'lib/components/PrizesTable'
import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'

export const PoolPrizeListing = (
  props,
) => {
  const { t } = useTranslation()
  const { pool } = props

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { status, data, error, isFetching, isFetched } = usePoolPrizesQuery(pauseQueries, chainId, pool)

  let prizes = data?.prizePool?.prizes

  if (!prizes || (isFetching && !isFetched)) {
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
