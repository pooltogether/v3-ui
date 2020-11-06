import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'

export function UniswapData(props) {
  const {
    children,
    dynamicExternalAwardsData,
  } = props

  const graphExternalErc20Awards = dynamicExternalAwardsData?.daiPool?.externalErc20Awards
  const addresses = graphExternalErc20Awards?.map(award => award.address)

  const { status, data, error, isFetching } = useUniswapTokensQuery(addresses)

  if (error) {
    console.warn(error)
  }

  return children({ 
    data
  })

}
