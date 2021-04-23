import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { TicketsUILoader } from 'lib/components/loaders/TicketsUILoader'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'

export const AccountTickets = () => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: playerTickets, isFetched: playerTicketsIsFetched } = useUserTicketsFormattedByPool(
    address
  )

  return (
    <div className='mt-8'>
      {!playerTicketsIsFetched ? (
        <TicketsUILoader />
      ) : playerTickets.length === 0 ? (
        <BlankStateMessage>
          <div className='mb-10 font-bold'>
            <img src={TicketIcon} className='mx-auto w-16 mb-8' />

            <span id='_ticketsBlankState'>{t('youCurrentlyHaveNoTickets')}</span>
            <br />
            {t('depositInAPoolNow')}
          </div>
          <ButtonLink href='/' as='/'>
            {t('viewPools')}
          </ButtonLink>
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
