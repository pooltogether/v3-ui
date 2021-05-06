import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import { NETWORK } from 'lib/utils/networks'

export const useUniswapLPPoolAddress = () => {
  const { appEnv } = useAppEnv()
  return appEnv === APP_ENVIRONMENT.mainnets
    ? CUSTOM_CONTRACT_ADDRESSES[NETWORK.mainnet].UniswapLPPool
    : CUSTOM_CONTRACT_ADDRESSES[NETWORK.rinkeby].UniswapLPPool
}
