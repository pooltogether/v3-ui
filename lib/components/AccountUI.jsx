import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountTickets } from 'lib/components/AccountTickets'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Tagline } from 'lib/components/Tagline'

export const AccountUI = () => {
  const TICKETS = 'TICKETS'
  const REWARDS = 'REWARDS'

  const { t } = useTranslation()
  const router = useRouter()

  const [visible, setVisible] = useState(REWARDS)

  const handleShowRewards = (e) => {
    e.preventDefault()

    router.push(
      `#rewards`,
      `#rewards`,
      {
        shallow: true
      }
    )
    setVisible(REWARDS)
  }

  const handleShowTickets = (e) => {
    e.preventDefault()

    router.push(
      `#tickets`,
      `#tickets`,
      {
        shallow: true
      }
    )
    setVisible(TICKETS)
  }

  useEffect(() => {
    if (window && window.location.hash === '#rewards') {
      setVisible(REWARDS)
    } else if (window && window.location.hash === '#tickets' || window.location.hash === '#pools') {
      setVisible(TICKETS)
    }
  }, [])

  return <>
    <Meta
      title={t('myAccount')}
    />

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

    <Tagline />
  </>
}
