import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUsersAddress } from '@pooltogether/hooks'

import { useTranslation } from 'next-i18next'
import { AccountTicket } from 'lib/components/AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { TicketsUILoader } from 'lib/components/loaders/TicketsUILoader'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { V2Tickets } from 'lib/components/V2Tickets'

export const AccountTickets = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: playerTickets, isFetched: playerTicketsIsFetched } =
    useUserTicketsFormattedByPool(address)

  return (
    <div className='mt-8'>
      {!playerTicketsIsFetched ? (
        <TicketsUILoader />
      ) : playerTickets.length === 0 ? (
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
      ) : (
        <div className='flex flex-col'>
          {playerTickets?.map((playerPoolTicketData) => {
            return (
              <AccountTicket
                isLink
                key={`account-pool-row-${playerPoolTicketData?.poolAddress}`}
                playerPoolTicketData={playerPoolTicketData}
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
          <a
            className='text-primary-soft'
            href='https://community.pooltogether.com'
            target='_blank'
          >
            https://community.pooltogether.com
          </a>
        </div>
      </div>
    </div>
  )
}
