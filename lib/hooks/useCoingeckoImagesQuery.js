import { useQuery } from 'react-query'

import { QUERY_KEYS } from 'lib/constants'
import { axiosInstance } from 'lib/axiosInstance'

const COINGECKO_IMAGE_BY_CONTRACT_ADDRESS_LAMBDA_PATH = `/.netlify/functions/coingeckoImagesByContractAddress`

const _getImages = async (addresses) => {
  let data = {}

  try {
    const promises = addresses.map((address) => {
      return axiosInstance.get(
        `${COINGECKO_IMAGE_BY_CONTRACT_ADDRESS_LAMBDA_PATH}?address=${address}`
      )
    })

    const responses = await Promise.all(promises)
    const imageObjects = responses.map((response) => response.data)

    data = {
      ...imageObjects
    }
  } catch (error) {
    console.warn(error)
  }

  return data
}

// I think this method of fetching images could be ideal but for some reason
// it's hammering Coingecko's API over and over
// Also it doesn't remove dupes so hits for the same token multiple times
export function useCoingeckoImagesQuery(addresses) {
  return useQuery(
    [QUERY_KEYS.coingeckoImagesByContractAddressesQuery, addresses.join('-')],
    async () => _getImages(addresses),
    {
      enabled: addresses?.length > 0,
      refetchInterval: false
    }
  )
}
