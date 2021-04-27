import React from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { Tooltip } from 'lib/components/Tooltip'
import { getDateFromSeconds } from 'lib/utils/getDateFromSeconds'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { secondsSinceEpoch } from 'lib/utils/secondsSinceEpoch'
import { shorten } from 'lib/utils/shorten'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'

export const SablierStreamCard = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  if (!pool.prize.sablierStream.id) return null

  const { amountPerPrizePeriod, startTime, stopTime, amount } = pool.prize.sablierStream
  const { symbol, address, name } = pool.tokens.sablierStreamToken
  const { prizePeriodSeconds } = pool.config

  const currentTime = ethers.BigNumber.from(secondsSinceEpoch())
  const streamTotalTime = stopTime.sub(startTime)
  const currentTimeRelativeToStreamStart = currentTime.sub(startTime)
  const percentOfStreamDone = currentTimeRelativeToStreamStart.mul(100).div(streamTotalTime)
  const prizesToBeStreamedTo = streamTotalTime.div(prizePeriodSeconds)

  return (
    <div
      id='sablier-card'
      className='non-interactable-card my-4 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <h3 className=''>{t('prizeStream')}</h3>

      <div className='flex items-center'>
        <Erc20Image address={address} />
        <h6>{name}</h6>
        <BlockExplorerLink
          chainId={pool.chainId}
          className='text-accent-1 trans hover:text-inverse ml-4'
          address={address}
        >
          ({shorten(address)})
        </BlockExplorerLink>
      </div>

      <div className='flex flex-col xs:flex-row justify-between mt-6'>
        <div className='flex items-baseline mb-2 xs:mb-0'>
          <h5>
            <PoolNumber>{numberWithCommas(amountPerPrizePeriod)}</PoolNumber>
          </h5>
          <span className='ml-2'>{t('tokenEveryPrize', { token: symbol })}</span>
        </div>

        <div className='flex items-baseline mb-2 xs:mb-0'>
          <h5>
            <PoolNumber>{numberWithCommas(amount)}</PoolNumber>
          </h5>
          <span className='ml-2'>{t('tokenInTotal', { token: symbol })}</span>
        </div>

        <div className='flex items-baseline'>
          <h5>{prizesToBeStreamedTo.toString()}</h5>
          <span className='ml-2 lowercase'>{t('prizes')}</span>
        </div>
      </div>

      <div className='flex flex-col mt-6'>
        <div className='flex justify-between'>
          <span className='text-xxs'>
            {getDateFromSeconds(startTime.toString()).toDateString()}
          </span>
          <span className='text-xxs'>{getDateFromSeconds(stopTime.toString()).toDateString()}</span>
        </div>
        <StreamBar percentage={percentOfStreamDone} />
      </div>
    </div>
  )
}

const StreamBar = (props) => {
  const { percentage } = props

  return (
    <Tooltip effect='float' id='sablier-stream-percentage' tip={`${percentage}%`}>
      <div className={classnames('w-full h-2 flex flex-row rounded-full overflow-hidden mt-2')}>
        <div className='bg-secondary' style={{ width: `${percentage}%` }} />
        <div className='bg-tertiary' style={{ width: `${100 - percentage}%` }} />
      </div>
    </Tooltip>
  )
}
