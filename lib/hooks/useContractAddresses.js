import { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { getContractAddresses } from 'lib/services/getContractAddresses'
import { poolToast } from 'lib/utils/poolToast'

export function useContractAddresses(chainId) {
  // const { supportedNetwork } = useContext(AuthControllerContext)

  let contractAddresses

  try {
    // if (supportedNetwork) {
    contractAddresses = getContractAddresses(chainId)
    // }
  } catch (e) {
    poolToast.error(e)
    console.error(e)
  }

  return { contractAddresses }
}
