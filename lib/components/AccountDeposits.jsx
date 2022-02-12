import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useIsTestnets, useUserTicketsFormattedByPool } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { Card, ExternalLink } from '@pooltogether/react-components'
import { useAtom } from 'jotai'

import { AccountTicket } from 'lib/components/AccountTicket'
import { TicketsUILoader } from 'lib/components/loaders/TicketsUILoader'
import { V2Tickets } from 'lib/components/V2Tickets'
import { PodTicket } from 'lib/components/Pods/PodTicket'
import { useUsersPodTickets } from 'lib/hooks/useUsersPodTickets'
import { isSelfAtom } from 'lib/components/AccountUI'
import { useV2Balances } from 'lib/hooks/useV2Balances'

import TicketIcon from 'images/pt-depositing-2-simplified.svg'

export const AccountDeposits = () => {
  const { t } = useTranslation()

  const { address: usersAddress } = useOnboard()

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
        <PodDeposits usersAddress={address} />
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
    </>
  )
}

const NoTicketsState = (props) => {
  const { usersAddress } = props

  const { t } = useTranslation()
  const [isSelf] = useAtom(isSelfAtom)

  const { isTestnets } = useIsTestnets()

  const { data: poolTickets, isFetched: isPlayerTicketsFetched } =
    useUserTicketsFormattedByPool(usersAddress)
  const { data: podTickets, isFetched: isPodTicketsFetched } = useUsersPodTickets(usersAddress)
  const { data: v2Tickets, isFetched: isV2BalancesFetched } = useV2Balances(usersAddress)

  const isV2Ready = isTestnets ? true : isV2BalancesFetched

  if (!isSelf || !isPlayerTicketsFetched || !isPodTicketsFetched || !isV2Ready) {
    return null
  }

  const noV2Tickets = isTestnets ? true : v2Tickets.length === 0

  if (poolTickets.length === 0 && podTickets.length === 0 && noV2Tickets) {
    return (
      <Card className='text-center'>
        <div className='mb-2 font-bold'>
          <Image src={TicketIcon} className='mx-auto w-16 mb-8' />

          <span id='_ticketsBlankState'>{t('youCurrentlyHaveNoTickets')}</span>
          <br />
          {t('depositInAPoolNow')}
        </div>
        <Link href='/' as='/'>
          <a className='new-btn px-3 py-1 my-3 inline-block'>{t('viewPools')}</a>
        </Link>
      </Card>
    )
  }

  return null
}

const PoolDeposits = (props) => {
  const { usersAddress } = props

  const { data: playerDepositData, isFetched: playerTicketsIsFetched } =
    useUserTicketsFormattedByPool(usersAddress)

  if (!playerTicketsIsFetched) {
    return <TicketsUILoader />
  }

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
        <PodTicket className='mb-4' key={podTicket.address} podTicket={podTicket} />
      ))}
    </>
  )
}
