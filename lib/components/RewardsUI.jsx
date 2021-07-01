import React from 'react'
import { useOnboard, useUsersAddress } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'
import { PageTitleAndBreadcrumbs } from '@pooltogether/react-components'

import { DeprecatedRewards } from 'lib/components/DeprecatedRewards'
import { RewardsGovernance } from 'lib/components/RewardsGovernance'
import { RewardsLPStaking } from 'lib/components/RewardsLPStaking'
import { Meta } from 'lib/components/Meta'
import Link from 'next/link'

export const RewardsUI = () => {
  const { t } = useTranslation()

  const { connectWallet } = useOnboard()
  const usersAddress = useUsersAddress()

  return (
    <>
      <Meta title={t('rewards')} />

      <PageTitleAndBreadcrumbs Link={Link} title={t('rewards')} breadcrumbs={[]} />

      {!usersAddress && (
        <button
          className='text-green underline mb-8'
          onClick={(e) => {
            e.preventDefault()
            connectWallet(() => {})
          }}
        >
          {t('connectYourWalletToDeposit', 'Connect your wallet to deposit')}
        </button>
      )}

      <RewardsLPStaking />

      <RewardsGovernance />

      <DeprecatedRewards />
    </>
  )
}
