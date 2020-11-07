import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'

export function UniswapData(props) {
  const {
    blockNumber,
    children,
    dynamicExternalAwardsData,
  } = props

  const { status, data, error, isFetching } = useUniswapTokensQuery(dynamicExternalAwardsData, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children({ 
    data
  })

}
