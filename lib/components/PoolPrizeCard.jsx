import React from 'react'
import BeatLoader from 'react-spinners/BeatLoader'

import { useTranslation } from 'lib/../i18n'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { PoolNumber } from 'lib/components/PoolNumber'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { Erc20Image } from 'lib/components/Erc20Image'

export const PoolPrizeCard = (props) => {
  const { pool } = props

  const { t } = useTranslation()

  return (
    <div
      className='custom-prize-box-padding pink-purple-gradient rounded-lg px-4 xs:px-6 sm:px-16 py-8 sm:pt-12 sm:pb-10 text-white my-4 mx-auto'
      style={{
        minHeight: 150
      }}
    >
      <div className='flex flex-col xs:flex-row xs:items-center justify-between'>
        <div className='w-1/2 sm:w-7/12'>
          <h6 className='font-normal text-inverse opacity-60'>
            {t('prize')} #{pool.prize.currentPrizeId}
          </h6>

          <PrizeValue pool={pool} />
        </div>

        <div className='flex flex-col justify-center pt-4 xs:pt-2 sm:pt-0 countdown-wrapper'>
          <h6 className='relative font-normal mb-1 xs:mb-2 sm:-mt-3 opacity-60 text-inverse'>
            {t('willBeAwardedIn')}
          </h6>

          <NewPrizeCountdown textAlign='left' pool={pool} flashy={false} />
        </div>
      </div>
    </div>
  )
}

const PrizeValue = (props) => {
  const { pool } = props

  if (!pool) {
    return (
      <PrizeValueHeader>
        <BeatLoader size={10} color='rgba(255,255,255,0.3)' />
      </PrizeValueHeader>
    )
  }

  if (pool.prize > 0) {
    return <USDPrizeValue amount={pool.totalPrizeAmountUSD} />
  }

  if (pool.sablierStream?.id) {
    if (!pool.sablierPrize) {
      return (
        <PrizeValueHeader>
          <BeatLoader size={10} color='rgba(255,255,255,0.3)' />
        </PrizeValueHeader>
      )
    }

    return (
      <TokenPrizeValue
        tokenAddress={pool.sablierPrize.tokenAddress}
        amount={numberWithCommas(pool.sablierPrize.amount)}
        tokenSymbol={pool.sablierPrize.tokenSymbol}
      />
    )
  }

  return <USDPrizeValue amount={0} />
}

const PrizeValueHeader = (props) => (
  <h1 className='text-6xl xs:text-4xl sm:text-5xl lg:text-6xl -mt-3 xs:mt-0 sm:-mt-3 flex'>
    {props.children}
  </h1>
)

const TokenPrizeValue = (props) => (
  <PrizeValueHeader>
    <Erc20Image address={props.tokenAddress} className='my-auto' />
    <PoolNumber>{props.amount}</PoolNumber>
    <span className='text-base lg:text-lg text-inverse mb-4 ml-2 mt-auto'>{props.tokenSymbol}</span>
  </PrizeValueHeader>
)

const USDPrizeValue = (props) => (
  <PrizeValueHeader>
    $<PoolNumber>{numberWithCommas(props.amount)}</PoolNumber>
  </PrizeValueHeader>
)
