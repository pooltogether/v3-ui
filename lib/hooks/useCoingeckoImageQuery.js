import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants'
import { axiosInstance } from 'lib/axiosInstance'

const COINGECKO_IMAGE_BY_CONTRACT_ADDRESS_LAMBDA_PATH = `/.netlify/functions/coingeckoImagesByContractAddress`

const _getImage = async (address) => {
  let data = {}

  try {
    const response = await axiosInstance.get(`${COINGECKO_IMAGE_BY_CONTRACT_ADDRESS_LAMBDA_PATH}?address=${address}`)
    data = { ...response.data }
  } catch (error) {
    // console.warn(error)
  }

  return data
}

export function useCoingeckoImageQuery(address) {
  return useQuery(
    [QUERY_KEYS.coingeckoImageQuery, address],
    async () => _getImage(address),
    { 
      enabled: address,
      refetchInterval: false
    }
  )
}
