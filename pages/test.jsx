import React, { useContext, useEffect } from 'react'

import { useUserTickets, useUserTicketsFormattedByPool } from 'lib/hooks/useUserTickets'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useAllPools, useCommunityPools, useGovernancePools } from 'lib/hooks/usePools'
import { getPool, getPoolsByChainId, getPoolsByChainIds } from 'lib/fetchers/getPools'
import { useEnvReadProviders } from 'lib/hooks/providers/useEnvProviders'
import { useAllUsersPrizes } from 'lib/hooks/useAllUsersPrizes'

export default function TestPage(props) {
  const { usersAddress } = useContext(AuthControllerContext)
  // const { data } = useCommunityPools()
  const { data } = useAllUsersPrizes('0xb8bd8f4c420ada4d999f2619503d5aaa139ed7c2')

  useEffect(() => {
    console.log('prizes:', data)
  }, [data])

  return null
}
