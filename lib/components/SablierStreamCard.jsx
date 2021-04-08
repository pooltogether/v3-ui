import React from 'react'
import classnames from 'classnames'
import { Trans, useTranslation } from 'lib/../i18n'

import SablierSvg from 'assets/images/sablier.svg'
import { getMaxPrecision, getMinPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { secondsSinceEpoch } from 'lib/utils/secondsSinceEpoch'
import { ethers } from 'ethers'
import { getDateFromSeconds } from 'lib/utils/getDateFromSeconds'
import { Erc20Image } from 'lib/components/Erc20Image'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { shorten } from 'lib/utils/shorten'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Tooltip } from 'lib/components/Tooltip'

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
      <h3 className='mb-4'>{t('sablierStream')}</h3>

      <div className='flex'>
        <Erc20Image address={address} className='my-auto' />
        <h3>{name}</h3>
        <EtherscanAddressLink
          className='text-accent-1 trans hover:text-inverse ml-4 mt-auto mb-2'
          address={address}
        >
          ({shorten(address)})
        </EtherscanAddressLink>
      </div>

      <div className='flex flex-col xs:flex-row justify-between mt-6'>
        <div className='flex mb-2 xs:mb-0'>
          <h3 className='leading-none'>
            <PoolNumber>
              {numberWithCommas(amountPerPrizePeriod, {
                precision: getMinPrecision(amountPerPrizePeriod)
              })}
            </PoolNumber>
          </h3>
          <span className='ml-2 mt-auto'>{t('tokenEveryPrize', { token: symbol })}</span>
        </div>

        <div className='flex mb-2 xs:mb-0'>
          <h3 className='leading-none'>
            <PoolNumber>
              {numberWithCommas(amount, {
                precision: getMinPrecision(amount)
              })}
            </PoolNumber>
          </h3>
          <span className='ml-2 mt-auto'>{t('tokenInTotal', { token: symbol })}</span>
        </div>

        <div className='flex'>
          <h3 className='leading-none'>
            {numberWithCommas(prizesToBeStreamedTo, { precision: 0 })}
          </h3>
          <span className='ml-2 mt-auto lowercase'>{t('prizes')}</span>
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
