import { useContext } from 'react'

import { ALL_POOLS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useHistoricalPool } from 'lib/services/useHistoricalPool'
import { usePoolQuery } from 'lib/hooks/usePoolQuery'

export function TimeTravelPool(props) {
  const { children, pool, prize, querySymbol, poolSplitExternalErc20Awards } = props

  const poolAddress = pool?.id
  const poolVersion = pool?.version

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
    poolVersion,
    preAwardBlockNumber
  )
  if (preAwardPoolError) {
    console.warn(preAwardPoolError)
  }

  const { data: postAwardGraphPool, error } = usePoolQuery(
    poolAddress,
    poolVersion,
    postAwardBlockNumber
  )
  if (error) {
    console.warn(error)
  }

  const poolInfo = ALL_POOLS[chainId]?.find((POOL) => POOL.symbol === querySymbol)

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
