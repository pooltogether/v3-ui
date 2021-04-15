import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { atom, useAtom } from 'jotai'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AccountSummary } from 'lib/components/AccountSummary'
import { AccountTickets } from 'lib/components/AccountTickets'
import { AccountWinnings } from 'lib/components/AccountWinnings'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Tagline } from 'lib/components/Tagline'
import { RetroactivePoolClaimBanner } from 'lib/components/RetroactivePoolClaimBanner'
import { AccountGovernanceClaims } from 'lib/components/AccountGovernanceClaims'
import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { shorten } from 'lib/utils/shorten'
import { testAddress } from 'lib/utils/testAddress'
import { AccountRewards } from 'lib/components/AccountRewards'
import { AccountLootBoxes } from 'lib/components/AccountLootBoxes'

export const isSelfAtom = atom(false)

export const AccountUI = () => {
  const { t } = useTranslation()

  const { chainId, usersAddress } = useContext(AuthControllerContext)

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
        address={address}
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

          {/* <AccountLootBoxes /> */}

          <AccountWinnings />

          <div className='flex flex-col items-center justify-center mt-20'>
            <div className='m-2'>
              <ButtonLink textSize='xxs' href={formatEtherscanAddressUrl(address, chainId)}>
                {t('viewPlayerInEtherscan')}
              </ButtonLink>
            </div>
          </div>
        </>
      )}

      <Tagline />
    </>
  )
}
