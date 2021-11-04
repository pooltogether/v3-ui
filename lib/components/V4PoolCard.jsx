import { batch, contract } from '@pooltogether/etherplex'
import { useReadProvider } from '@pooltogether/hooks'
import { NO_REFETCH_QUERY_OPTIONS } from '@pooltogether/hooks/dist/constants'
import {
  Chip,
  LoadingDots,
  NetworkIcon,
  SquareButton,
  SquareButtonSize,
  SquareButtonTheme,
  TokenIcon
} from '@pooltogether/react-components'
import { NETWORK, sToMs } from '@pooltogether/utilities'
import PrizeTierHistoryAbi from 'abis/PrizeTierHistoryAbi'
import DrawBeaconAbi from 'abis/DrawBeaconAbi'
import classnames from 'classnames'
import { BigNumber } from 'ethers'
import { formatUnits, parseUnits } from 'ethers/lib/utils'
import { Card } from 'lib/components/Card'
import { InteractableCard } from 'lib/components/InteractableCard'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { Divider, PoolRowContents, PoolRowContentSide } from 'lib/components/PoolRow'
import { PrizeValue } from 'lib/components/PrizeValue'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { useTranslation } from 'react-i18next'

const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const PRIZE_TIER_HISTORY = '0xdD1cba915Be9c7a1e60c4B99DADE1FC49F67f80D'
const DRAW_BEACON = '0x0D33612870cd9A475bBBbB7CC38fC66680dEcAC5'
const PRIZE_DECIMALS = 6
const CHAINS_TO_SHOW = [NETWORK.mainnet, NETWORK.polygon]

export const V4PoolCard = (props) => {
  const { filter } = props
  const { data: prize } = useV4Prize()
  const { t } = useTranslation()

  if (filter && !CHAINS_TO_SHOW.includes(filter)) {
    return null
  }

  return (
    <InteractableCard
      id={`_viewv4Pool`}
      href='https://v4.pooltogether.com'
      className='mt-1 sm:mt-2 relative'
    >
      <CustomNetworkBadge />
      <PoolRowContents>
        <PoolRowContentSide className='py-2 p-4 lg:px-6 sm:pt-3 sm:pb-5 justify-center sm:justify-start'>
          <div className='flex flex-col mx-auto'>
            <div className='flex items-center justify-center'>
              <TokenIcon
                chainId={NETWORK.mainnet}
                address={USDC}
                sizeClassName='w-9 h-9'
                className='mr-2 my-auto'
              />
              <PrizeValue totalValueUsd={prize || 0} />
            </div>

            <div className='flex items-center justify-center'>
              <PrizeFrequency />
            </div>
          </div>
        </PoolRowContentSide>
        <Divider />
        <PoolRowContentSide>
          <div className='flex flex-col mx-auto'>
            <PrizeCountdown />
            <DepositLink />
            <span className='text-inverse text-xxxs mt-2 mx-auto sm:mr-0 sm:ml-auto'>
              {t('viewApp', 'View app')}
            </span>
          </div>
        </PoolRowContentSide>
      </PoolRowContents>
    </InteractableCard>
  )
}

const CustomNetworkBadge = (props) => {
  const { className } = props
  return (
    <div
      className={classnames(
        className,
        `absolute t-0 l-0 px-3 py-1 rounded-tl-xl rounded-br-xl border-b border-r border-accent-4 flex items-center`
      )}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)'
      }}
    >
      <div className='flex flex-row-reverse'>
        <NetworkIcon chainId={NETWORK.mainnet} className='-ml-2' />
        <NetworkIcon chainId={NETWORK.polygon} />
      </div>
      <span className={`text-flashy ml-2`}>Multi-chain</span>
    </div>
  )
}
const PrizeFrequency = () => <Chip textClasses='text-inverse' text='In weekly prizes' />

const useV4Prize = () => {
  const { readProvider, isReadProviderReady } = useReadProvider(NETWORK.mainnet)
  const enabled = isReadProviderReady
  return useQuery(['useV4Prize'], () => getV4Prize(readProvider), {
    enabled,
    ...NO_REFETCH_QUERY_OPTIONS
  })
}

const getV4Prize = async (readProvider) => {
  const prizeTierHistory = contract(PRIZE_TIER_HISTORY, PrizeTierHistoryAbi, PRIZE_TIER_HISTORY)
  let response = await batch(readProvider, prizeTierHistory.getNewestDrawId())
  const drawId = response[PRIZE_TIER_HISTORY].getNewestDrawId[0]
  console.log({ drawId })
  response = await batch(readProvider, prizeTierHistory.getPrizeTier(drawId))
  const prizeTier = response[PRIZE_TIER_HISTORY].getPrizeTier[0]
  console.log({ prizeTier })
  const prizeAmountUnformatted = prizeTier.prize
  const weeklyPrizeAmountUnformatted = prizeAmountUnformatted.mul(7)
  console.log(formatUnits(weeklyPrizeAmountUnformatted, PRIZE_DECIMALS))
  return formatUnits(weeklyPrizeAmountUnformatted, PRIZE_DECIMALS)
}

const PrizeCountdown = () => {
  const { data: drawBeaconData, isFetched: isDrawBeaconFetched } = useDrawBeaconPeriodEndTime()

  if (!isDrawBeaconFetched) {
    return (
      <div className='w-72 flex justify-center'>
        <LoadingDots />
      </div>
    )
  }

  return (
    <NewPrizeCountdown
      center
      textSize='text-sm sm:text-lg'
      prizePeriodSeconds={drawBeaconData.periodSeconds}
      prizePeriodStartedAt={drawBeaconData.startedAtSeconds}
      isRngRequested={false}
    />
  )
}

export const useDrawBeaconPeriodEndTime = () => {
  const { readProvider, isReadProviderReady } = useReadProvider(NETWORK.mainnet)
  const [refetchIntervalMs, setRefetchIntervalMs] = useState(sToMs(60 * 2.5))
  const enabled = isReadProviderReady

  const onSuccess = (drawBeaconData) => {
    const { endsAtSeconds } = drawBeaconData
    let refetchIntervalMs = sToMs(endsAtSeconds.toNumber()) - Date.now()
    // Refetch when the period is done
    if (refetchIntervalMs > 0) {
      setRefetchIntervalMs(refetchIntervalMs)
    } else {
      // Otherwise, refetch every 2.5 minutes (1/2 the time for the defender cron job)
      setRefetchIntervalMs(sToMs(60 * 2.5))
    }
  }

  return useQuery(['useDrawBeaconPeriod'], () => getDrawBeaconPeriodEndTime(readProvider), {
    enabled,
    refetchInterval: refetchIntervalMs,
    onSuccess
  })
}

const getDrawBeaconPeriodEndTime = async (readProvider) => {
  const drawBeacon = contract(DRAW_BEACON, DrawBeaconAbi, DRAW_BEACON)
  let response = await batch(
    readProvider,
    drawBeacon.beaconPeriodEndAt().getBeaconPeriodStartedAt().getBeaconPeriodSeconds()
  )
  const startedAtSeconds = response[DRAW_BEACON].getBeaconPeriodStartedAt[0]
  const periodSeconds = BigNumber.from(response[DRAW_BEACON].getBeaconPeriodSeconds[0])
  const endsAtSeconds = response[DRAW_BEACON].beaconPeriodEndAt[0]
  console.log({ startedAtSeconds, periodSeconds, endsAtSeconds })
  return { startedAtSeconds, periodSeconds, endsAtSeconds }
}

const DepositLink = () => {
  const { t } = useTranslation()
  return (
    <SquareButton
      className='mt-2 w-full'
      theme={SquareButtonTheme.rainbow}
      size={SquareButtonSize.sm}
    >
      {t('depositTicker', { ticker: 'USDC' })}
    </SquareButton>
  )
}
