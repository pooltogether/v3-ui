import React, { useContext, useEffect } from 'react'

import { useUserTickets, useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import {
  useAllPools,
  useAllPoolsFlattened,
  useCommunityPools,
  useGovernancePools
} from 'lib/hooks/usePools'
import { getPool, getPoolsByChainId, getPoolsByChainIds } from 'lib/fetchers/getPools'

export default function TestPage(props) {
  const { usersAddress } = useContext(AuthControllerContext)
  const { data } = useCommunityPools()

  useEffect(() => {
    console.log(data)
  }, [data])

  return null
}
