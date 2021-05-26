// import React from 'react'
// import { ethers } from 'ethers'
// import { sub, fromUnixTime } from 'date-fns'
// import { compact } from 'lodash'

// import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
// import { useTranslation } from 'react-i18next'
// import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
// import { usePoolPrizesQuery } from 'lib/hooks/usePoolPrizesQuery'

// const NUMBER_OF_POINTS = 10
// const MIN_NUMBER_OF_POINTS = 2

// export const PrizeValueGraph = (props) => {
//   const { pool, renderEmptyState } = props

//   const { t } = useTranslation()

//   const page = 1
//   const skip = 0
//   const { data, error, isFetched } = usePoolPrizesQuery(pool, page, skip)

//   let prizes = [].concat(data?.prizePool?.prizes)

//   if (error) {
//     console.error(error)
//   }

//   const decimals = pool?.underlyingCollateralDecimals

//   if (!decimals || !prizes.length || !isFetched || prizes.length < MIN_NUMBER_OF_POINTS) {
//     if (renderEmptyState) return renderEmptyState()
//     return null
//   }

//   if (!prizes[0]?.awardedBlock) {
//     prizes.shift()
//   }

//   const dataArray = prizes.map((prize) => {
//     const prizeValue = prize.awardedControlledTokens.reduce(
//       (accumulator, currentValue) => accumulator.add(ethers.BigNumber.from(currentValue.amount)),
//       ethers.constants.Zero
//     )

//     const prizeValueFormatted = ethers.utils.formatUnits(
//       prizeValue || '0',
//       decimals || DEFAULT_TOKEN_PRECISION
//     )

//     return {
//       value: parseFloat(prizeValueFormatted),
//       date: fromUnixTime(prize.awardedTimestamp)
//     }
//   })

//   if (dataArray.length < NUMBER_OF_POINTS) {
//     dataArray.push({
//       value: 0,
//       date: sub(dataArray[dataArray.length - 1].date, {
//         years: 0,
//         months: 0,
//         weeks: 1,
//         days: 0,
//         hours: 0,
//         minutes: 0,
//         seconds: 0
//       })
//     })
//   }

//   return (
//     <DateValueLineGraph
//       id='historic-prizes-graph'
//       valueLabel={t('prizeValueLabel', {
//         tokenSymbol: pool?.underlyingCollateralSymbol?.toUpperCase()
//       })}
//       data={[dataArray]}
//     />
//   )
// }
