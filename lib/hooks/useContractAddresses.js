import { SUPPORTED_NETWORKS } from 'lib/constants'
import { poolToast } from '@pooltogether/react-components'

import { getContractAddresses } from 'lib/services/getContractAddresses'

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
