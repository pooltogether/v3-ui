import React from 'react'
import classnames from 'classnames'
import {
  Button,
  Card,
  LoadingDots,
  PrizeFrequencyChip,
  TokenIcon
} from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { usePrizeSortedPods } from 'lib/hooks/usePrizeSortedPods'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PrizeValue } from 'lib/components/PrizeValue'
import { WinningOdds } from 'lib/components/WinningOdds'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { AprChip } from 'lib/components/AprChip'
import { COOKIE_OPTIONS, WIZARD_REFERRER_AS_PATH, WIZARD_REFERRER_HREF } from 'lib/constants'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { InteractableCard } from 'lib/components/InteractableCard'

// TODO: Token color
export const PodsList = (props) => {
  const { className } = props
  const { data: pods, isFetched } = usePrizeSortedPods()

  if (!isFetched) {
    return (
      <div className='flex flex-col justify-center w-full h-full'>
        <LoadingDots className={classnames('mx-auto', className)} />
      </div>
    )
  }

  return (
    <ul className={className}>
      {pods.map((pod) => (
        <PodListItem key={pod.pod.address} pod={pod} />
      ))}
    </ul>
  )
}

const PodListItem = (props) => {
  const { pod } = props
  const { t } = useTranslation()

  return (
    <li className='mb-8 last:mb-0'>
      <InteractableCard
        className='relative flex flex-col sm:flex-row'
        id={`_view${pod.pod.address}Pod`}
        href='/players/[playerAddress]'
        as={`/players/${pod.pod.address}`}
      >
        <NetworkCornerBadge chainId={pod.metadata.chainId} />
        <div className='relative flex flex-col sm:flex-row'>
          <PodListItemLeftHalf pod={pod} />
          <Divider />
          <PodListItemRightHalf pod={pod} />
        </div>
      </InteractableCard>
    </li>
  )
}

const NetworkCornerBadge = (props) => (
  <NetworkBadge
    chainId={props.chainId}
    className='absolute left-0 top-0 px-3 py-1 bg-light-purple-10 rounded-tl-xl rounded-br-xl border-b border-r border-accent-4'
    textClassName='text-xs xs:text-sm'
  />
)

const Divider = () => (
  <div className='hidden sm:flex flex-col items-start justify-center px-4'>
    <div className='border-default h-20 opacity-30' style={{ borderLeftWidth: 1 }}>
      &nbsp;
    </div>
  </div>
)

const PodListItemLeftHalf = (props) => {
  const { pod } = props

  const { t } = useTranslation()

  return (
    <div className='flex flex-col w-full'>
      <PrizeValue totalValueUsd={pod.prize.totalValueUsd} className='mx-auto mt-8 sm:mt-0' />
      <WinningOdds odds={pod.pod.odds} className='mx-auto' />
      <div className='flex mx-auto my-4 sm:mb-0'>
        <div className='flex mr-4'>
          <TokenIcon
            className='my-auto'
            chainId={pod.metadata.chainId}
            address={pod.tokens.underlyingToken.address}
          />
          <span className='ml-2 text-accent-1 text-xs'>{`${pod.tokens.underlyingToken.symbol} Pool`}</span>
        </div>
        <div className='my-auto'>
          <PrizeFrequencyChip t={t} prizePeriodSeconds={pod.prize.prizePeriodSeconds} />
        </div>
      </div>
    </div>
  )
}

const PodListItemRightHalf = (props) => {
  const { pod } = props

  const { t } = useTranslation()

  return (
    <div className='w-full flex'>
      <div className='flex flex-col mx-auto my-auto'>
        <NewPrizeCountdown
          center
          prizePeriodSeconds={pod.prize.prizePeriodSeconds}
          prizePeriodStartedAt={pod.prize.prizePeriodStartedAt}
          isRngRequested={pod.prize.isRngRequested}
        />
        <DepositIntoPodTrigger pod={pod} />
        <div className='flex flex-row justify-between'>
          {pod.prizePool.tokenFaucets?.map((tokenFaucet) => (
            <AprChip
              key={tokenFaucet.address}
              chainId={pod.metadata.chainId}
              tokenFaucet={tokenFaucet}
            />
          )) || <div />}
          <span className='text-xxxs text-highlight-1 trans hover:text-inverse ml-auto'>
            {t('viewPod')}
          </span>
        </div>
      </div>
    </div>
  )
}

const DepositIntoPodTrigger = (props) => {
  const { pod } = props

  const { t } = useTranslation()
  const router = useRouter()

  const handleDepositClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/pods', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/pods`, COOKIE_OPTIONS)

    router.push(
      `/pods/[networkName]/[podAddress]/deposit`,
      `/pods/${chainIdToNetworkName(pod.metadata.chainId)}/${pod.pod.address}/deposit`,
      {
        shallow: true
      }
    )
  }

  return (
    <Button
      border='green'
      text='primary'
      bg='green'
      hoverBorder='green'
      hoverText='primary'
      hoverBg='green'
      onClick={handleDepositClick}
      width='w-full'
      textSize='xxxs'
      className='my-4'
      padding='py-1'
    >
      {t('depositTicker', {
        ticker: pod.tokens.underlyingToken.symbol
      })}
    </Button>
  )
}
