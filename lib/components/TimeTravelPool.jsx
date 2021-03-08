import { useContext } from 'react'

import { POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useHistoricalPool } from 'lib/services/useHistoricalPool'
import { usePoolQuery } from 'lib/hooks/usePoolQuery'

export function TimeTravelPool(props) {
  const { children, poolAddress, prize, querySymbol, poolSplitExternalErc20Awards } = props

  if (!querySymbol) {
    return children({
      timeTravelPool: {},
      preAwardTimeTravelPool: {}
    })
  }

  // Rewind to the block _before_ the prize was awarded
  const preAwardBlockNumber = props.blockNumber - 1

  // And after the award:
  const postAwardBlockNumber = props.blockNumber

  const { chainId } = useContext(AuthControllerContext)

  const { data: preAwardGraphPool, error: preAwardPoolError } = usePoolQuery(
    poolAddress,
    preAwardBlockNumber
  )
  if (preAwardPoolError) {
    console.warn(preAwardPoolError)
  }

  const { data: postAwardGraphPool, error } = usePoolQuery(poolAddress, postAwardBlockNumber)
  if (error) {
    console.warn(error)
  }

  const poolInfo = POOLS[chainId]?.find((POOL) => POOL.symbol === querySymbol)

  const preAwardTimeTravelPool = useHistoricalPool(
    poolInfo,
    preAwardGraphPool,
    poolAddress,
    preAwardBlockNumber,
    prize,
    poolSplitExternalErc20Awards
  )

  const timeTravelPool = useHistoricalPool(
    poolInfo,
    postAwardGraphPool,
    poolAddress,
    postAwardBlockNumber,
    prize,
    poolSplitExternalErc20Awards
  )

  return children({
    timeTravelPool,
    preAwardTimeTravelPool
  })
}
