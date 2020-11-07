import { useCoingeckoTokensQuery } from 'lib/hooks/useCoingeckoTokensQuery'
import { useCoingeckoEthPriceQuery } from 'lib/hooks/useCoingeckoEthPriceQuery'

export function CoingeckoQueries(props) {
  const {
    children,
    dynamicExternalAwardsData,
  } = props

  const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  const addressesString = graphExternalErc20Awards?.map(award => award.address).join(',')

  const { status, data, error, isFetching } = useCoingeckoTokensQuery(addressesString)

  if (error) {
    console.warn(error)
  }


  const {
    status: ethPriceStatus,
    data: ethPriceData,
    error: ethPriceError,
    isFetching: ethPriceFetching
  } = useCoingeckoEthPriceQuery()

  if (error) {
    console.warn(error)
  }

  const coingeckoData = {
    ...ethPriceData,
    ...data,
  }

  return children({ 
    coingeckoData
  })

}
