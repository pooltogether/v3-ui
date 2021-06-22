import React from 'react'
import { useUsersAddress } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'
import { PageTitleAndBreadcrumbs } from '@pooltogether/react-components'

import { DeprecatedRewards } from 'lib/components/DeprecatedRewards'
import { RewardsGovernance } from 'lib/components/RewardsGovernance'
import { RewardsLPStaking } from 'lib/components/RewardsLPStaking'
import { Meta } from 'lib/components/Meta'
import Link from 'next/link'

export const RewardsUI = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  return (
    <>
      <Meta title={t('rewards')} />

      <PageTitleAndBreadcrumbs Link={Link} title={t('rewards')} breadcrumbs={[]} />

      {!usersAddress && <p>{t('connectYourWalletToDeposit', 'Connect your wallet to deposit')}</p>}

      <RewardsLPStaking />

      <RewardsGovernance />

      <DeprecatedRewards />
    </>
  )
}
