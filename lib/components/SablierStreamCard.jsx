import React from 'react'
import classnames from 'classnames'
import { Trans, useTranslation } from 'lib/../i18n'

import SablierSvg from 'assets/images/sablier.svg'
import { getMaxPrecision, numberWithCommas } from 'lib/utils/numberWithCommas'
import { secondsSinceEpoch } from 'lib/utils/secondsSinceEpoch'
import { ethers } from 'ethers'
import { getDateFromSeconds } from 'lib/utils/getDateFromSeconds'
import { Erc20Image } from 'lib/components/Erc20Image'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { shorten } from 'lib/utils/shorten'

export const SablierStreamCard = (props) => {
  const { pool } = props
  const { t } = useTranslation()

  if (!pool?.sablierStream?.id || !pool?.sablierPrize) return null

  const {
    amountPerPrizePeriod,
    tokenSymbol,
    tokenAddress,
    tokenName,
    startTime,
    stopTime,
    totalDeposit
  } = pool.sablierPrize
  const { prizePeriodSeconds } = pool

  const currentTime = ethers.BigNumber.from(secondsSinceEpoch())
  const streamTotalTime = stopTime.sub(startTime)
  const currentTimeRelativeToStreamStart = currentTime.sub(startTime)
  const percentOfStreamDone = currentTimeRelativeToStreamStart.mul(100).div(streamTotalTime)
  const prizesToBeStreamedTo = streamTotalTime.div(prizePeriodSeconds)

  return (
    <div
      id='sablier-card'
      className='non-interactable-card my-10 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <h3 className='mb-4'>{t('sablierStream')}</h3>

      <div className='flex'>
        <Erc20Image address={tokenAddress} className='my-auto' />
        <h3>{tokenName}</h3>
        <EtherscanAddressLink
          className='text-accent-1 trans hover:text-inverse ml-4 mt-auto mb-2'
          address={tokenAddress}
        >
          ({shorten(tokenAddress)})
        </EtherscanAddressLink>
      </div>

      <div className='flex flex-col xs:flex-row justify-between mt-6'>
        <div className='flex mb-2 xs:mb-0'>
          <h3 className='leading-none'>
            {numberWithCommas(amountPerPrizePeriod, {
              precision: getMaxPrecision(amountPerPrizePeriod)
            })}
          </h3>
          <span className='ml-2 mt-auto'>{t('tokenEveryPrize', { token: tokenSymbol })}</span>
        </div>

        <div className='flex mb-2 xs:mb-0'>
          <h3 className='leading-none'>
            {numberWithCommas(totalDeposit, {
              precision: getMaxPrecision(totalDeposit)
            })}
          </h3>
          <span className='ml-2 mt-auto'>{t('tokenInTotal', { token: tokenSymbol })}</span>
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
    <div className={classnames('w-full h-2 flex flex-row rounded-full overflow-hidden mt-2')}>
      <div className='bg-secondary' style={{ width: `${percentage}%` }} />
      <div className='bg-tertiary' style={{ width: `${100 - percentage}%` }} />
    </div>
  )
}
