import { useChainId } from 'lib/hooks/useChainId'
import { PRIZE_POOL_CONTRACTS } from 'lib/constants/contracts'

const governancePoolContracts = (chainId) => PRIZE_POOL_CONTRACTS[chainId]?.governance ?? []
const communityPoolContracts = (chainId) => PRIZE_POOL_CONTRACTS[chainId]?.community ?? []

export function usePoolContracts() {
  const chainId = useChainId()
  return [
    ...governancePoolContracts(chainId),
    ...communityPoolContracts(chainId).map((contract) => ({
      ...contract,
      isCommunityPool: true
    }))
  ]
}

export function useCommunityPoolContracts() {
  const chainId = useChainId()
  return communityPoolContracts(chainId).map((contract) => ({
    ...contract,
    isCommunityPool: true
  }))
}

export function useGovernancePoolContracts() {
  const chainId = useChainId()
  return governancePoolContracts(chainId)
}

export function usePoolContract(poolAddress) {
  const poolContracts = usePoolContracts()
  return poolContracts.find((contract) => contract.prizePool.address === poolAddress)
}

export function usePoolContractBySymbol(symbol) {
  const poolContracts = usePoolContracts()
  if (!symbol) return null
  return poolContracts.find((contract) => contract.symbol === symbol)
}
