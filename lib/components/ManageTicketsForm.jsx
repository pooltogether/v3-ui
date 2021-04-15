import React, { useContext, useState } from 'react'

import { STRINGS } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { WithdrawTicketsForm } from 'lib/components/WithdrawTicketsForm'
import { useAllPlayerTickets } from 'lib/hooks/useAllPlayerTickets'
import { useCurrentPool } from 'lib/hooks/usePools'

export function ManageTicketsForm(props) {
  const { t } = useTranslation()

  const { usersAddress } = useContext(AuthControllerContext)

  const { data: pool } = useCurrentPool()

  const [action, setAction] = useState(STRINGS.withdraw)

  const { data: playerTickets } = useAllPlayerTickets(usersAddress)
  const playerTicket = playerTickets?.find((playerTicket) => playerTicket.pool.id === pool?.id)

  return (
    <>
      <div className='pane-title'>
        <div
          className={`leading-tight font-bold text-lg xs:text-3xl lg:text-4xl text-inverse mb-4 xs:mb-8`}
        >
          {t('manageYourTickets')}
        </div>
      </div>

      <div className='mx-auto mt-4 mb-8 xs:mb-12'>
        <AccountTicket
          noMargin
          key={`account-pool-row-${pool?.poolAddress}`}
          playerTicket={playerTicket}
        />
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
          <h6 className='text-accent-1'>{t('withdraw')}</h6>
          <WithdrawTicketsForm {...props} />
        </>
      )}
    </>
  )
}
