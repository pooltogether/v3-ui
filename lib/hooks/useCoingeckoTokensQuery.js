// import { useQuery } from 'react-query'

// import {
//   COINGECKO_POLLING_INTERVAL,
//   QUERY_KEYS
// } from 'lib/constants'
// import { axiosInstance } from 'lib/axiosInstance'

// const COINGECKO_LAMBDA_PATH = `/.netlify/functions/coingecko-price-api`

// const getCoingeckoTokensData = async (_, erc20AddressesString) => {
//   const { data } = await axiosInstance.post(
//     COINGECKO_LAMBDA_PATH,
//     {
//       addressesString: erc20AddressesString
//     }
//   )

//   return data
// }

// export function useCoingeckoTokensQuery(erc20AddressesString) {
//   return useQuery(
//     [QUERY_KEYS.coingeckoTokensQuery, erc20AddressesString],
//     getCoingeckoTokensData,
//     {
//       enabled: erc20AddressesString,
//       refetchInterval: COINGECKO_POLLING_INTERVAL
//     }
//   )
// }
