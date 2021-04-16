import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'

export const useChainId = () => useWalletNetwork().walletChainId
