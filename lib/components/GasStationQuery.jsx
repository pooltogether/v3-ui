import { useEffect } from 'react'
import { useInterval } from 'beautiful-react-hooks'

import { gasStationDataVar } from 'lib/apollo/cache'

const GAS_STATION_LAMBDA_PATH = `/.netlify/functions/eth-gas-station`

export function GasStationQuery(props) {
  // const getNewGasStationData = async () => {
  //   try {
  //     const response = await fetch(GAS_STATION_LAMBDA_PATH)
  //     const gasPrices = await response.json()

  //     gasStationDataVar(gasPrices)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useInterval(() => {
  //   getNewGasStationData()
  // }, 60000)

  // useEffect(() => {
  //   getNewGasStationData()
  // }, [])

  return null
}
