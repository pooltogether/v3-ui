import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { AccountEmailSignup } from 'lib/components/AccountEmailSignup'
import { AccountLootBoxes } from 'lib/components/AccountLootBoxes'
import { AccountRewards } from 'lib/components/AccountRewards'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountTickets } from 'lib/components/AccountTickets'
import { AccountWinnings } from 'lib/components/AccountWinnings'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Tagline } from 'lib/components/Tagline'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { AccountGovernanceClaims } from 'lib/components/AccountGovernanceClaims'
import { DepositDetailsBanner } from 'lib/components/DepositDetailsBanner'

export const AccountUI = () => {
  const { t } = useTranslation()

  return (
    <>
      <Meta title={t('myAccount')} />

      {Boolean(process.env.NEXT_JS_FEATURE_FLAG_CLAIM) && <RetroactivePoolClaimBanner />}

      <DepositDetailsBanner />

      <PageTitleAndBreadcrumbs
        title={t('myAccount')}
        breadcrumbs={[
          {
            name: t('accountOverview')
          }
        ]}
      />

      <AccountSummary />

      <AccountTickets />

      {Boolean(process.env.NEXT_JS_FEATURE_FLAG_CLAIM) && <AccountGovernanceClaims />}

      <AccountRewards />

      <AccountLootBoxes />

      <AccountWinnings />

      {/* <AccountEmailSignup /> */}

      <Tagline />
    </>
  )
}
