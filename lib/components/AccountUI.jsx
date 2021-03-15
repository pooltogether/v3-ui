import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { atom, useAtom } from 'jotai'

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
import { shorten } from 'lib/utils/shorten'
import { testAddress } from 'lib/utils/testAddress'

export const isSelfAtom = atom(false)

export const AccountUI = () => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress

  const [isSelf, setIsSelf] = useAtom(isSelfAtom)

  useEffect(() => {
    const addressMatches = usersAddress?.toLowerCase() === playerAddress?.toLowerCase()
    let isSelf = playerAddress ? addressMatches : router?.pathname === '/account'
    setIsSelf(isSelf)
  }, [playerAddress, usersAddress])

  const pageTitle = isSelf
    ? t('myAccount')
    : t('playerAddress', { address: shorten(playerAddress) })

  const addressError = testAddress(playerAddress)

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

      {addressError ? (
        <h6 className='text-orange my-4 font-normal'>
          There was an issue with the address provided: {playerAddress}
        </h6>
      ) : (
        <>
          <AccountSummary />

          <AccountTickets />

          <AccountGovernanceClaims />

          <AccountRewards />

          <AccountLootBoxes />

          <AccountWinnings />

          {/* <AccountEmailSignup /> */}
        </>
      )}

      <Tagline />
    </>
  )
}
