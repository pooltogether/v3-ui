import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
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

  const { usersAddress } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress

  let isSelf = true
  if (usersAddress === playerAddress) {
    isSelf = false
  }

  const pageTitle = isSelf ? t('myAccount') : t('playerAddress', { address: playerAddress })

  return (
    <>
      <Meta title={pageTitle} />

      {isSelf && <RetroactivePoolClaimBanner />}

      <PageTitleAndBreadcrumbs
        title={pageTitle}
        breadcrumbs={[
          {
            name: t('accountOverview')
          }
        ]}
      />

      <AccountSummary />

      <AccountTickets />

      <AccountGovernanceClaims />

      <AccountRewards />

      <AccountLootBoxes />

      <AccountWinnings />

      {/* <AccountEmailSignup /> */}

      <Tagline />
    </>
  )
}
