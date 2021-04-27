import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

export const useWalletChainId = () => useWalletNetwork().walletChainId
