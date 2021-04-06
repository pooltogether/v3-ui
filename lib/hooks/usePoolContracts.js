import { useChainId } from 'lib/hooks/useChainId'
import { PRIZE_POOL_CONTRACTS } from 'lib/constants/contracts'

export function usePoolContracts() {
  const chainId = useChainId()
  return [...PRIZE_POOL_CONTRACTS[chainId].governance, ...PRIZE_POOL_CONTRACTS[chainId].community]
}

export function useCommunityPoolContracts() {
  const chainId = useChainId()
  return PRIZE_POOL_CONTRACTS[chainId].community
}

export function useGovernancePoolContracts() {
  const chainId = useChainId()
  return PRIZE_POOL_CONTRACTS[chainId].governance
}

export function usePoolContract(poolAddress) {
  const poolContracts = usePoolContracts()
  return poolContracts.find((contract) => contract.prizePool.address === poolAddress)
}
