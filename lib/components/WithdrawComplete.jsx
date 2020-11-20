import React, { useContext } from 'react'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'

export function WithdrawComplete(props) {
  const { t } = useTranslation()

  const poolData = useContext(PoolDataContext)
  const { pool } = poolData

  // TODO: show what happened here!
  // 3. your new odds are:

  // 'Successfully scheduled your withdrawal'
  // 'Successfully withdrew'
  return <>
    <PaneTitle small>
      {t('successfullyWithdrew')}
    </PaneTitle>

    <div>
      <ButtonLink
        href='/account/pools/[symbol]'
        as={`/account/pools/${pool?.symbol}`}
        textSize='lg'
      >
        {t('continue')}
      </ButtonLink>
    </div>
  </>
}
