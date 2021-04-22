import React, { useContext, useEffect } from 'react'

import { useUserTickets, useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useAllPools, useCommunityPools, useGovernancePools } from 'lib/hooks/usePools'
import { getPool, getPoolsByChainId, getPoolsByChainIds } from 'lib/fetchers/getPools'
import { useEnvReadProviders } from 'lib/hooks/providers/useEnvProviders'

export default function TestPage(props) {
  const { usersAddress } = useContext(AuthControllerContext)
  // const { data } = useCommunityPools()
  const { data } = useEnvReadProviders()

  useEffect(() => {
    console.log('providers:', data)
  }, [data])

  return null
}
