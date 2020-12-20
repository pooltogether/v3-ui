// import { useCoingeckoTokensQuery } from 'lib/hooks/useCoingeckoTokensQuery'
// import { useCoingeckoEthPriceQuery } from 'lib/hooks/useCoingeckoEthPriceQuery'

// export function CoingeckoQueries(props) {
//   const {
//     addresses,
//     children,
//     dynamicExternalAwardsData,
//   } = props


//   const { data, error } = useCoingeckoTokensQuery(addresses)

//   if (error) {
//     console.warn(error)
//   }


//   const {
//     data: ethPriceData,
//     error: ethPriceError,
//   } = useCoingeckoEthPriceQuery()

//   if (error) {
//     console.warn(error)
//   }

//   const coingeckoData = {
//     ...ethPriceData,
//     ...data,
//   }

//   return children({ 
//     coingeckoData
//   })

// }
