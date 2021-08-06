import { APP_ENVIRONMENT, useAppEnv, useUsersAddress } from '@pooltogether/hooks'
import { useRouter } from 'next/router'

import { useClaimableTokenFromTokenDrops } from 'lib/hooks/useClaimableTokensFromTokenDrop'
import { NETWORK } from '@pooltogether/utilities'

export const AccountPodTokenDropClaims = () => {
  const usersAddress = useUsersAddress()
  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { appEnv } = useAppEnv()
  const ethereumChainId = appEnv === APP_ENVIRONMENT.mainnets ? NETWORK.mainnet : NETWORK.rinkeby

  // Eth pods
  const { data, isFetched } = useClaimableTokenFromTokenDrops(ethereumChainId, address)

  return null
}
