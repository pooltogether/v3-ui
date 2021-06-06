import React from 'react'
import { useUsersAddress } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'

import { DeprecatedRewards } from 'lib/components/DeprecatedRewards'
import { RewardsGovernanceRewards } from 'lib/components/RewardsGovernanceRewards'
import { RewardsStakingPools } from 'lib/components/RewardsStakingPools'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'

export const RewardsUI = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  return (
    <>
      <Meta title={t('rewards')} />

      <PageTitleAndBreadcrumbs title={t('rewards')} breadcrumbs={[]} />

      {!usersAddress && <p>Connect a wallet!</p>}

      <RewardsStakingPools />

      <RewardsGovernanceRewards />

      <DeprecatedRewards />
    </>
  )
}
