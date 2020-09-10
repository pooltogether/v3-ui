import React, { useContext } from 'react'

import { Trans, useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { PoolList } from 'lib/components/PoolList'
import { Tagline } from 'lib/components/Tagline'

export const IndexUI = (
  props,
) => {
  const { t } = useTranslation()
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    pools,
    // pool,
  } = poolDataContext

  return <>
    <h1
      className='banner-text mx-auto font-bold text-center'
    >
      <Trans
        i18nKey='youCouldWin'
        defaults='You could <flashy>win ${{totalPrizes}} every week</flashy> just by saving your money.'
        values={{ totalPrizes: '1,039' }}
        components={{
          flashy: <span className='text-flashy' />
        }}
      />
    </h1>

    <h6
      className='text-accent-2 mb-6 capitalize'
    >
      {t('pools')}
    </h6>

    {loading ?
      <IndexUILoader /> :
      <PoolList
        pools={pools}
      />
    }

    <Tagline />
  </>
}
