import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { useRouter } from 'next/router'

export const useRouterChainId = () => {
  const router = useRouter()
  const networkName = router?.query?.networkName
  return networkNameToChainId(networkName)
}
