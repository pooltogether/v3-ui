import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { TicketsUILoader } from 'lib/components/loaders/TicketsUILoader'
import { useAllPlayerTickets } from 'lib/hooks/useAllPlayerTickets'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'

export const AccountTickets = () => {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: playerTickets, isFetched: playerTicketsIsFetched } = useAllPlayerTickets(address)

  return (
    <div className='mt-8 xs:mt-16'>
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
        <div>
          <div className='flex flex-wrap'>
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
        </div>
      )}
    </div>
  )
}
