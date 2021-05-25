import { useIsWalletOnSupportedNetwork } from '@pooltogether/hooks'
import { SUPPORTED_NETWORKS } from 'lib/constants'

import { getContractAddresses } from 'lib/services/getContractAddresses'
import { poolToast } from 'lib/utils/poolToast'

export function useContractAddresses(chainId) {
  const supportedNetwork = SUPPORTED_NETWORKS.includes(chainId)

  let contractAddresses

  try {
    if (supportedNetwork) {
      contractAddresses = getContractAddresses(chainId)
    }
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }

  return { contractAddresses }
}
