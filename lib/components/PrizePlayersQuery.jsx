import { useRouter } from 'next/router'

import { PLAYER_PAGE_SIZE } from 'lib/constants'
import { useControlledTokenBalanceQuery } from 'lib/hooks/useControlledTokenBalanceQuery'

export function PrizePlayersQuery(props) {
  const { children, pool, blockNumber } = props

  const router = useRouter()
  const page = router?.query?.page ? parseInt(router.query.page, 10) : 1
  const skip = (page - 1) * PLAYER_PAGE_SIZE

  const { data, error, isFetched, isFetching } = useControlledTokenBalanceQuery(
    pool,
    page,
    skip,
    blockNumber
  )

  if (error) {
    console.warn(error)
  }

  return children({ error, data, isFetched, isFetching })
}
