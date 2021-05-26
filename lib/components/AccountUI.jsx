import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { atom, useAtom } from 'jotai'
import { useUsersAddress } from '@pooltogether/hooks'

import { useTranslation } from 'next-i18next'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountTickets } from 'lib/components/AccountTickets'
import { AccountWinnings } from 'lib/components/AccountWinnings'
import { AccountGovernanceClaims } from 'lib/components/AccountGovernanceClaims'
import { AccountRewards } from 'lib/components/AccountRewards'
import { AccountLootBoxes } from 'lib/components/AccountLootBoxes'
import { AccountStakingPools } from 'lib/components/AccountStakingPools'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { shorten } from 'lib/utils/shorten'
import { testAddress } from 'lib/utils/testAddress'

export const isSelfAtom = atom(false)

export const AccountUI = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const [isSelf, setIsSelf] = useAtom(isSelfAtom)

  useEffect(() => {
    const addressMatches = usersAddress?.toLowerCase() === playerAddress?.toLowerCase()
    let isSelf = playerAddress ? addressMatches : router?.pathname === '/account'
    setIsSelf(isSelf)
  }, [playerAddress, usersAddress])

  const pageTitle = isSelf ? t('myAccount') : t('playerAddress', { address: shorten(address) })

  const addressError = testAddress(address)

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

      {!address ? (
        <AccountSummary />
      ) : addressError ? (
        <h6 className='text-orange my-4 font-normal'>
          There was an issue with the address provided: {playerAddress}
        </h6>
      ) : (
        <>
          <AccountSummary />

          <AccountTickets />

          <AccountStakingPools />

          <AccountGovernanceClaims />

          <AccountRewards />

          <AccountLootBoxes />

          <AccountWinnings />
        </>
      )}
    </>
  )
}
