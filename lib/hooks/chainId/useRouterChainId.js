import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

export const useRouterChainId = (router) => {
  const networkName = router?.query?.networkName
  return networkNameToChainId(networkName)
}
