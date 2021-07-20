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

import { usePrizeSortedPods } from 'lib/hooks/usePrizeSortedPods'
import { NetworkBadge } from 'lib/components/NetworkBadge'
import { PrizeValue } from 'lib/components/PrizeValue'
import { WinningOdds } from 'lib/components/WinningOdds'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { AprChip } from 'lib/components/AprChip'

// TODO: Token color
export const PodsList = (props) => {
  const { className } = props
  const { data: pods, isFetched } = usePrizeSortedPods()

  if (!isFetched) {
    return <LoadingDots className={classnames('mx-auto', className)} />
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
      <Card className='relative flex flex-col sm:flex-row'>
        <NetworkCornerBadge chainId={pod.metadata.chainId} />
        <PodListItemLeftHalf pod={pod} />
        <Divider />
        <PodListItemRightHalf pod={pod} />
      </Card>
    </li>
  )
}

const NetworkCornerBadge = (props) => (
  <NetworkBadge
    chainId={props.chainId}
    className='absolute left-0 top-0 py-2 px-3 bg-light-purple-10 rounded-tl-xl rounded-br-xl'
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

  return (
    <div className='flex flex-col w-full'>
      <PrizeValue totalValueUsd={pod.prize.totalValueUsd} className='mx-auto' />
      <WinningOdds odds={pod.pod.odds} className='mx-auto' />
      <div className='flex mx-auto mt-4'>
        <div className='flex mr-4'>
          <TokenIcon
            className='my-auto'
            chainId={pod.metadata.chainId}
            address={pod.tokens.underlyingToken.address}
          />
          <span className='ml-2 text-accent-1 text-xs'>{`${pod.tokens.underlyingToken.symbol} Pool`}</span>
        </div>
        <PrizeFrequencyChip prizePeriodSeconds={pod.prize.prizePeriodSeconds} />
      </div>
    </div>
  )
}

const PodListItemRightHalf = (props) => {
  const { pod } = props

  return (
    <div className='flex flex-col w-full my-auto'>
      <NewPrizeCountdown
        center
        prizePeriodSeconds={pod.prize.prizePeriodSeconds}
        prizePeriodStartedAt={pod.prize.prizePeriodSeconds}
        isRngRequested={pod.prize.isRngRequested}
      />
      <DepositIntoPodTrigger pod={pod} />
      <AprChip
        className='mx-auto mt-2'
        chainId={pod.metadata.chainId}
        tokenFaucetDripToken={pod.tokens.tokenFaucetDripToken}
        tokenListener={pod.tokenListener}
        ticket={pod.tokens.ticket}
        prizePool={pod.prizePool}
      />
    </div>
  )
}

const DepositIntoPodTrigger = (props) => {
  const { pod } = props

  const { t } = useTranslation()

  return (
    <Button
      border='green'
      text='primary'
      bg='green'
      hoverBorder='green'
      hoverText='primary'
      hoverBg='green'
      // onClick={handleGetTicketsClick}
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
