import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { APP_ENVIRONMENT, useAppEnv, useUsersAddress } from '@pooltogether/hooks'
import { Card, ExternalLink } from '@pooltogether/react-components'

import { AccountTicket } from 'lib/components/AccountTicket'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { TicketsUILoader } from 'lib/components/loaders/TicketsUILoader'
import { useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { V2Tickets } from 'lib/components/V2Tickets'

import TicketIcon from 'assets/images/PT-Depositing-2-simplified.svg'
import { PodTicket } from 'lib/components/Pods/PodTicket'
import { useUsersPodTickets } from 'lib/hooks/useUsersPodTickets'
import { useAtom } from 'jotai'
import { isSelfAtom } from 'lib/components/AccountUI'
import { useV2Balances } from 'lib/hooks/useV2Balances'

export const AccountDeposits = () => {
  const { t } = useTranslation()

  const usersAddress = useUsersAddress()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  return (
    <>
      <div className='mt-8'>
        <div
          id='account-deposits'
          className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-sm'
        >
          {t('deposits')}
        </div>

        <NoTicketsState usersAddress={address} />
        <PoolDeposits usersAddress={address} />
        <V2Tickets usersAddress={address} />
        <PodDeposits usersAddress={address} />

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
    </>
  )
}

const NoTicketsState = (props) => {
  const { usersAddress } = props

  const { t } = useTranslation()
  const [isSelf] = useAtom(isSelfAtom)
  const { appEnv } = useAppEnv()

  const { data: poolTickets, isFetched: isPlayerTicketsFetched } =
    useUserTicketsFormattedByPool(usersAddress)
  const { data: podTickets, isFetched: isPodTicketsFetched } = useUsersPodTickets(usersAddress)
  const { data: v2Tickets, isFetched: isV2BalancesFetched } = useV2Balances(usersAddress)

  const isV2Ready = appEnv === APP_ENVIRONMENT.mainnets ? isV2BalancesFetched : true

  if (!isSelf || !isPlayerTicketsFetched || !isPodTicketsFetched || !isV2Ready) {
    return null
  }

  const noV2Tickets = appEnv === APP_ENVIRONMENT.mainnets ? v2Tickets.length === 0 : true

  if (poolTickets.length === 0 && podTickets.length === 0 && noV2Tickets) {
    return (
      <Card className='text-center'>
        <div className='mb-2 font-bold'>
          <img src={TicketIcon} className='mx-auto w-16 mb-8' />

          <span id='_ticketsBlankState'>{t('youCurrentlyHaveNoTickets')}</span>
          <br />
          {t('depositInAPoolNow')}
        </div>
        <Link href='/' as='/'>
          <a>{t('viewPools')}</a>
        </Link>
      </Card>
    )
  }

  return null
}

const PoolDeposits = (props) => {
  const { usersAddress } = props
  const { t } = useTranslation()

  const { data: playerDepositData, isFetched: playerTicketsIsFetched } =
    useUserTicketsFormattedByPool(usersAddress)

  if (!playerTicketsIsFetched) {
    return <TicketsUILoader />
  }

  // console.log(playerDepositData)

  return (
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
  )
}

const PodDeposits = (props) => {
  const { usersAddress } = props

  const { data: podTickets, isFetched } = useUsersPodTickets(usersAddress)

  if (!isFetched) {
    return <TicketsUILoader />
  } else if (podTickets.length === 0) {
    return null
  }

  return (
    <>
      {podTickets.map((podTicket) => (
        <PodTicket podTicket={podTicket} />
      ))}
    </>
  )
}
