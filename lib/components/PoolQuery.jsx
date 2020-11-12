import { usePoolQuery } from 'lib/hooks/usePoolQuery'

export function PoolQuery(props) {
  const {
    blockNumber,
    children,
    poolAddress,
  } = props

  const { status, data, error, isFetching } = usePoolQuery(poolAddress, blockNumber)

  if (error) {
    console.warn(error)
  }

  return children(data)
}
