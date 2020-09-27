import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'

import { differenceInMinutes } from 'date-fns'

import { Trans, useTranslation } from 'lib/../i18n'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { gasStationDataQuery } from 'lib/queries/gasStationDataQuery'


export const TransactionsTakeTimeMessage = (props) => {
  const { t } = useTranslation()

  const { tx } = props

  const [waitTime, setWaitTime] = useState(null)

  const gasStationDataQueryResult = useQuery(gasStationDataQuery)
  const gasStationData = gasStationDataQueryResult?.data?.gasStationData

  useEffect(() => {
    if (gasStationData && gasStationData['fast']) {
      window.differenceInMinutes = differenceInMinutes
      const gasPairs = ['average', 'fast', 'fastest', 'safeLow'].map(pair => {
        const gasInGwei = gasStationData[pair] / 10

        const waitKey = pair === 'average' ? 'avgWait' : `${pair}Wait`
        const waitTime = gasStationData[waitKey]

        return {
          pair,
          waitTime,
          gasInGwei
        }
      })

      const findClosest = (x) => {
        return gasPairs.reduce((best, current) => {
          return (current.gasInGwei <= x && (!best || current.gasInGwei > best.gasInGwei))
            ? current
            : best
        }, undefined)
      }

      const txGasPriceInGwei = parseInt(
        ethers.utils.formatUnits(tx.ethersTx.gasPrice, 'gwei'),
        10
      )
      
      const closestPair = findClosest(txGasPriceInGwei)

      const _waitTime = closestPair ? closestPair.waitTime : gasStationData['safeLowWait']

      setWaitTime(_waitTime)
    }
  }, [gasStationData])  

  return <>
    <div className='mx-auto -mb-6 -mt-6'>
      <V3LoadingDots />
    </div>

    <div
      className='leading-tight font-bold text-xs xs:text-base sm:text-lg text-default pb-1'
    >
      {t('transactionsMayTakeAFewMinutes')}
    </div>

    {waitTime && <>
      <div
        className='text-blue'
      >
        <span className='font-bold'>
          {t('estimatedWaitTime')}
        </span> {waitTime > 1 ?
          t('waitTimeMinutes', { waitTime }) :
          t('lessThanAMinute')
        }
      </div>
    </>}
  </>
}
