import { axiosInstance } from 'lib/axiosInstance'

export async function getGasPrices (value) {
  const ethGasStationLambdaPath = `/.netlify/functions/eth-gas-station`

  let gasPrices = undefined
  let response

  try {
    // console.log({ axiosInstance})
    response = await axiosInstance.get(ethGasStationLambdaPath)

    if (response.status === 201) {
      gasPrices = response.data
    }
  } catch (error) {
    console.error(error)
  }

  return gasPrices
}