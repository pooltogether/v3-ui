import React, { useEffect } from 'react'
import { Button, InternalLink, TicketRow, TokenIcon } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import { calculateUsersOdds } from '@pooltogether/utilities'
import { useTokenBalance } from '@pooltogether/hooks'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import classnames from 'classnames'

import { TicketPrize } from 'lib/components/TicketPrize'
import { TicketAmount } from 'lib/components/TicketAmount'
import { Odds } from 'lib/components/Odds'
import { WinningOdds } from 'lib/components/WinningOdds'
import { COOKIE_OPTIONS, WIZARD_REFERRER_AS_PATH, WIZARD_REFERRER_HREF } from 'lib/constants'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { useAtom } from 'jotai'
import { isSelfAtom } from 'lib/components/AccountUI'
import Link from 'next/link'
import { NetworkBadge } from 'lib/components/NetworkBadge'

export const PodTicket = (props) => (
  <TicketRow
    className={props.className}
    cornerBgClassName={props.cornerBgClassName}
    left={<PodTicketLeft {...props} />}
    right={<PodTicketRight {...props} />}
  />
)

const PodTicketLeft = (props) => {
  const { podTicket } = props
  const { pod } = podTicket

  const router = useRouter()

  return (
    <div className='flex flex-col justify-center h-full'>
      <TokenIcon
        className='mx-auto'
        sizeClassName='h-6 w-6'
        address={pod.tokens.underlyingToken.address}
        chainId={pod.metadata.chainId}
      />
      <button onClick={() => router.push('/pods/')} className='mt-2 mx-auto font-bold'>
        <span className=''>{pod.tokens.underlyingToken.symbol} Pod</span>
      </button>
    </div>
  )
}

const PodTicketRight = (props) => {
  const { podTicket, hideManage } = props
  const { pod } = podTicket
  const { chainId } = pod.metadata

  const { t } = useTranslation()

  const { data, isFetched } = useTokenBalance(
    chainId,
    pod.pod.address,
    pod.prizePool.tokens.ticket.address
  )

  return (
    <div className='flex flex-col sm:flex-row justify-between'>
      <div className='flex flex-col'>
        <TicketAmount amount={podTicket.amount} className='mr-auto' />
        <PodWinningOdds
          pod={pod}
          podTicket={podTicket}
          isPodBalanceFetched={isFetched}
          podBalanceUnformatted={data?.amountUnformatted}
        />
      </div>
      <div className='flex flex-col'>
        <TicketPrize prize={pod.prize} />
        <div className='mt-1 sm:ml-auto flex sm:flex-col'>
          <NetworkBadge
            className=''
            sizeClasses='w-3 h-3'
            textClasses='text-xxxs sm:text-xxs'
            chainId={chainId}
          />
          {!hideManage && <ManagePodTicketsTrigger className='ml-2 sm:ml-auto sm:mt-1' pod={pod} />}
        </div>
      </div>
    </div>
  )
}

const PodWinningOdds = (props) => {
  const { pod, podBalanceUnformatted, isPodBalanceFetched } = props

  const decimals = pod?.tokens.underlyingToken.decimals
  const ticketTotalSupplyUnformatted = pod?.tokens.ticket.totalSupplyUnformatted
  const sponsorshipTotalSupplyUnformatted = pod?.tokens.sponsorship.totalSupplyUnformatted
  const totalSupplyUnformatted = ticketTotalSupplyUnformatted?.add(
    sponsorshipTotalSupplyUnformatted
  )
  const numberOfWinners = pod?.prizePool.config.numberOfWinners

  const odds = isPodBalanceFetched
    ? calculateUsersOdds(podBalanceUnformatted, totalSupplyUnformatted, decimals, numberOfWinners)
    : null

  return (
    <WinningOdds
      className='flex sm:flex-col text-xxxs mr-auto'
      odds={odds}
      isLoading={!isPodBalanceFetched}
    />
  )
}

const ManagePodTicketsTrigger = (props) => {
  const { pod, className } = props

  const [isSelf] = useAtom(isSelfAtom)
  const { t } = useTranslation()
  const router = useRouter()

  const handleDepositClick = (e) => {
    e.preventDefault()
    Cookies.set(WIZARD_REFERRER_HREF, '/account', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/account`, COOKIE_OPTIONS)
    router.push(
      `/pods/[networkName]/[podAddress]/withdraw`,
      `/pods/${chainIdToNetworkName(pod.metadata.chainId)}/${pod.pod.address}/withdraw`,
      {
        shallow: true
      }
    )
  }

  if (!isSelf) {
    return null
  }

  return (
    <button
      onClick={handleDepositClick}
      className={classnames(
        'underline text-highlight-1 hover:text-inverse trans text-xxxs sm:text-xxs',
        className
      )}
    >
      {t('manage')}
    </button>
  )
}
