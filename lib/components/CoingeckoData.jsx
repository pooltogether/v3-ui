import { useCoingeckoData } from 'lib/hooks/useCoingeckoData'

export const CoingeckoData = (props) => {
  const {
    children,
    dynamicExternalAwardsData,
  } = props

  const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  const addressesString = graphExternalErc20Awards?.map(award => award.address).join(',')

  const { status, data, error, isFetching } = useCoingeckoData(addressesString)

  if (error) {
    console.warn(error)
  }

  return children({ 
    coingeckoData: data
  })

}
