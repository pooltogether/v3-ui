// import { useQuery } from 'react-query'

// import {
//   COINGECKO_POLLING_INTERVAL,
//   QUERY_KEYS
// } from 'lib/constants'
// import { axiosInstance } from 'lib/axiosInstance'

// const COINGECKO_ETH_PRICE_LAMBDA_PATH = `/.netlify/functions/coingecko-eth-price-api`

// const getCoingeckoEthPriceData = async (_) => {
//   const { data } = await axiosInstance.post(
//     COINGECKO_ETH_PRICE_LAMBDA_PATH,
//   )

//   return data
// }

// export function useCoingeckoEthPriceQuery() {
//   return useQuery(
//     [QUERY_KEYS.coingeckoEthPriceQuery],
//     getCoingeckoEthPriceData,
//     {
//       enabled: true,
//       refetchInterval: COINGECKO_POLLING_INTERVAL
//     }
//   )
// }
