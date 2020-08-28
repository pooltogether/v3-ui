import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { DateValueLineGraph } from 'lib/components/DateValueLineGraph'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'

export const TicketsSoldGraph = (
  props,
) => {
  const { pool } = props

  const generalContext = useContext(GeneralContext)
  const { paused } = generalContext

  const { loading, error, data } = useQuery(poolPrizesQuery, {
    variables: {
      prizeStrategyAddress: pool?.prizeStrategyAddress
    },
    skip: !pool?.prizeStrategyAddress,
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL,
  })

  if (error) {
    console.error(error)
  }

  let prizes = data?.prizeStrategy?.prizes

  if (error) {
    console.error(error)
  }

  if (!prizes || loading) {
    return null
  }

  return <>
    <DateValueLineGraph
      valueLabel='Tickets'
      data={prizes.map(prize => {
        return {
          value: prize.totalTicketSupply,
          date: prize.awardedTimestamp,
        }
      })}
        
      // [
      //   [
      //     {
      //       date: new Date(98, 1),
      //       value: 100,
      //     },
      //     {
      //       date: new Date(2001, 1),
      //       value: 400,
      //     },
      //     {
      //       date: new Date(),
      //       value: 200,
      //     }
      //   ]
      // ]
    />

  </>
}
