import React, { useState } from 'react'
import { useUsersAddress } from '@pooltogether/hooks'

import { STRINGS } from 'lib/constants'
import { useTranslation } from 'react-i18next'
import { AccountTicket } from 'lib/components/AccountTicket'
import { WithdrawTicketsForm } from 'lib/components/WithdrawTicketsForm'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'

export function ManageTicketsForm(props) {
  const { nextStep } = props

  const { t } = useTranslation()
  const usersAddress = useUsersAddress()
  const [action, setAction] = useState(STRINGS.withdraw)
  const { data: pool } = useCurrentPool()
  const { data: playerTickets } = useUserTicketsFormattedByPool(usersAddress)

  if (!pool) return null

  const playerPoolTicketData = playerTickets?.find(
    (playerPoolTicketData) => playerPoolTicketData.poolAddress === pool.prizePool.address
  )

  return (
    <>
      <div className='pane-title'>
        <div
          className={`leading-tight font-bold text-lg xs:text-3xl lg:text-4xl text-inverse mb-4 xs:mb-8`}
        >
          {t('manageYourTickets')}
        </div>
      </div>

      <div className='mx-auto mt-4 mb-8 xs:mb-12 w-full'>
        {playerPoolTicketData && (
          <AccountTicket
            noMargin
            cornerBgClassName='bg-darkened'
            key={`account-pool-row-${pool.prizePool.address}`}
            playerPoolTicketData={playerPoolTicketData}
          />
        )}
      </div>

      {/* <DropdownInputGroup
        id='manage-tickets-action-dropdown'
        label={t('whatWouldYouLikeToDoQuestion')}
        current={action}
        setCurrent={setAction}
        options={{
          [STRINGS.withdraw]: t('withdraw'),
          // [STRINGS.transfer]: t('transfer')
        }}
      /> */}

      {/* {action === STRINGS.transfer && <>
      <h6 className='mt-2 text-inverse'>Transfer feature coming soon ...</h6>
    </>} */}

      {action === STRINGS.withdraw && (
        <>
          {/* <h6 className='text-accent-1 mb-2'>{t('withdraw')}</h6> */}
          <WithdrawTicketsForm
            nextStep={nextStep}
            pool={pool}
            playerPoolTicketData={playerPoolTicketData}
          />
        </>
      )}
    </>
  )
}
