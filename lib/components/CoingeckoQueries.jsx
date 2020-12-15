// import { useCoingeckoTokensQuery } from 'lib/hooks/useCoingeckoTokensQuery'
// import { useCoingeckoEthPriceQuery } from 'lib/hooks/useCoingeckoEthPriceQuery'

// export function CoingeckoQueries(props) {
//   const {
//     children,
//     dynamicExternalAwardsData,
//   } = props

//   const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
//   const addressesString = graphExternalErc20Awards?.map(award => award.address).join(',')

//   const { data, error } = useCoingeckoTokensQuery(addressesString)

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
