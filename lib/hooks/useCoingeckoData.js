import { useQuery } from 'react-query'

import {
  COINGECKO_POLLING_INTERVAL
} from 'lib/constants'
import { axiosInstance } from 'lib/axiosInstance'

const COINGECKO_LAMBDA_PATH = `/.netlify/functions/coingecko-price-api`

const getCoingeckoData = async (_, erc20AddressesString) => {
  const { data } = await axiosInstance.post(
    COINGECKO_LAMBDA_PATH,
    {
      addressesString: erc20AddressesString
    }
  )

  return data
}

export function useCoingeckoData(erc20AddressesString) {
  return useQuery(
    ['coingeckoData', erc20AddressesString],
    getCoingeckoData,
    { 
      enabled: erc20AddressesString,
      refetchInterval: COINGECKO_POLLING_INTERVAL
    }
  )
}
