import React, { useContext, useState } from 'react'

import { STRINGS } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { AccountTicket } from 'lib/components/AccountTicket'
import { DropdownInputGroup } from 'lib/components/DropdownInputGroup'
import { WithdrawTicketsForm } from 'lib/components/WithdrawTicketsForm'
import { testAddress } from 'lib/utils/testAddress'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'

export function ManageTicketsForm(props) {
  const { t } = useTranslation()

  const { chainId, pauseQueries, usersAddress } = useContext(AuthControllerContext)
  const { pool } = useContext(PoolDataContext)

  const playerAddressError = testAddress(usersAddress)

  const blockNumber = -1
  let {
    status,
    data: playerData,
    error,
    isFetching
  } = useAccountQuery(pauseQueries, chainId, usersAddress, blockNumber, playerAddressError)
  console.log('ManageTicketsForm', playerData)

  if (error) {
    console.error(error)
  }


  playerData = playerData?.find(playerData => playerData?.prizePool?.id === pool?.id)

  const [action, setAction] = useState(STRINGS.withdraw)

  return <>
    <div
      className='pane-title'
    >
      <div
        className={`leading-tight font-bold text-lg xs:text-3xl lg:text-4xl text-inverse mb-4 xs:mb-8`}
      >
        {t('manageYourTickets')}
      </div>
    </div>

    <div className='mx-auto mt-4 xs:mb-8'>
      <AccountTicket
        noMargin
        key={`account-pool-row-${pool?.poolAddress}`}
        pool={pool}
        player={playerData}
      />
    </div>

    <DropdownInputGroup
      id='manage-tickets-action-dropdown'
      label={t('whatWouldYouLikeToDoQuestion')}
      current={action}
      setCurrent={setAction}
      options={{
        [STRINGS.withdraw]: t('withdraw'),
        // [STRINGS.transfer]: t('transfer')
      }}
    />

    {/* {action === STRINGS.transfer && <>
      <h6 className='mt-2 text-inverse'>Transfer feature coming soon ...</h6>
    </>} */}

    {action === STRINGS.withdraw && <>
      <WithdrawTicketsForm
        {...props}
      />
    </>}

  </>
}
