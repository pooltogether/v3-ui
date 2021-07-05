import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useUsersAddress } from '@pooltogether/hooks'
import { ExternalLink } from '@pooltogether/react-components'

import { AccountTicket } from 'lib/components/AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { TicketsUILoader } from 'lib/components/loaders/TicketsUILoader'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { V2Tickets } from 'lib/components/V2Tickets'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'

const AccountDepositsBlankState = () => {
  const { t } = useTranslation()

  return (
    <BlankStateMessage>
      <div className='mb-2 font-bold'>
        <img src={TicketIcon} className='mx-auto w-16 mb-8' />

        <span id='_ticketsBlankState'>{t('youCurrentlyHaveNoTickets')}</span>
        <br />
        {t('depositInAPoolNow')}
      </div>
      <Link href='/' as='/'>
        <a>{t('viewPools')}</a>
      </Link>
    </BlankStateMessage>
  )
}

export const AccountDeposits = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: playerDepositData, isFetched: playerTicketsIsFetched } =
    useUserTicketsFormattedByPool(address)

  return (
    <>
      <div className='mt-8'>
        <div
          id='account-deposits'
          className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-sm'
        >
          {t('deposits')}
        </div>

        {!playerTicketsIsFetched ? (
          <TicketsUILoader />
        ) : playerDepositData?.length === 0 ? (
          <AccountDepositsBlankState />
        ) : (
          <div className='flex flex-col'>
            {playerDepositData?.map((playerPoolDepositData) => {
              return (
                <AccountTicket
                  isLink
                  cornerBgClassName='bg-body'
                  key={`account-pool-row-${playerPoolDepositData?.poolAddress}`}
                  depositData={playerPoolDepositData.ticket}
                  pool={playerPoolDepositData.pool}
                />
              )
            })}
          </div>
        )}

        <V2Tickets usersAddress={address} />

        <div className='text-center flex flex-col text-default-soft mt-4 text-xxs'>
          <span>
            {t('areSomeOfYourDepositsMissing')} {t('checkOnTheCompletePoolListingForYourBalances')}
          </span>
          <div>
            <ExternalLink
              underline
              colorClassName='text-default-soft hover:text-inverse'
              className='text-xxs'
              href='https://community.pooltogether.com'
            >
              https://community.pooltogether.com
            </ExternalLink>
          </div>
        </div>
      </div>

      {/* <SponsorshipDeposits /> */}
    </>
  )
}

// const SponsorshipDeposits = (props) => {
//   return (
//     <div className='mt-8'>
//       <div
//         id='account-sponsorships'
//         className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-sm'
//       >
//         {t('sponsorships')}
//       </div>

//       {!playerTicketsIsFetched ? (
//         <TicketsUILoader />
//       ) : playerDepositData?.length === 0 ? (
//         <AccountDepositsBlankState />
//       ) : (
//         <div className='flex flex-col'>
//           {playerDepositData?.map((playerPoolDepositData) => {
//             return (
//               <AccountTicket
//                 isSponsorship
//                 isLink
//                 cornerBgClassName='bg-body'
//                 key={`account-pool-row-${playerPoolDepositData?.poolAddress}`}
//                 depositData={playerPoolDepositData.sponsorship}
//                 pool={playerPoolDepositData.pool}
//               />
//             )
//           })}
//         </div>
//       )}
//     </div>
//   )
// }
