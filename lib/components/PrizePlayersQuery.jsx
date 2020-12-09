import { useContext } from 'react'
import { useRouter } from 'next/router'

import { PLAYER_PAGE_SIZE } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useControlledTokenBalanceQuery } from 'lib/hooks/useControlledTokenBalanceQuery'

export function PrizePlayersQuery(props) {
  const {
    children,
    pool,
    prize
  } = props

  const router = useRouter()
  const page = router?.query?.page ?
    parseInt(router.query.page, 10) :
    1
  const skip = (page - 1) * PLAYER_PAGE_SIZE

  const blockNumber = prize?.awardedBlock ? 
    prize?.awardedBlock - 1 :
    undefined

  const { chainId, pauseQueries } = useContext(AuthControllerContext)

  const { status, data, error, isFetching } = useControlledTokenBalanceQuery(pauseQueries, chainId, pool, blockNumber, page, skip)

  if (error) {
    console.warn(error)
  }

  console.log("PPQ", data)

  return children({ error, data, isFetching })
}

