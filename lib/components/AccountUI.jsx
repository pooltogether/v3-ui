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

export const AccountUI = () => {
  const { t } = useTranslation()

  return <>
    <Meta
      title={t('myAccount')}
    />

    <RetroactivePoolClaimBanner />

    <PageTitleAndBreadcrumbs
      title={t('myAccount')}
      breadcrumbs={[
        {
          name: t('accountOverview'),
        },
      ]}
    />

    <AccountSummary />

    <AccountTickets />

    <AccountGovernanceClaims />

    <AccountRewards />

    <AccountLootBoxes />

    <AccountWinnings />

    <AccountEmailSignup />

    <Tagline />
  </>
}
