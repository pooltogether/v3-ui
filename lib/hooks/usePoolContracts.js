import { useWalletChainId } from 'lib/hooks/useWalletChainId'
import { PRIZE_POOL_CONTRACTS } from 'lib/constants/contracts'
import { useEnvironmentChainIds } from 'lib/hooks/useEnvironmentChainIds'

export function useAllPoolContracts() {
  const communityContracts = useCommunityPoolContracts()
  const governanceContracts = useGovernancePoolContracts()
  return [...governanceContracts, ...communityContracts]
}

export function useCommunityPoolContracts() {
  const chainIds = useEnvironmentChainIds()
  return chainIds.reduce((contracts, chainId) => {
    contracts[chainId] = PRIZE_POOL_CONTRACTS[chainId].community.map((contract) => ({
      ...contract,
      isCommunityPool: true
    }))
    return contracts
  }, {})
}

export function useGovernancePoolContracts() {
  const chainIds = useEnvironmentChainIds()
  return chainIds.reduce((contracts, chainId) => {
    contracts[chainId] = PRIZE_POOL_CONTRACTS[chainId].governance
    return contracts
  }, {})
}

export function usePoolContractByAddress(chainId, poolAddress) {
  const poolContracts = useAllPoolContracts()
  return poolContracts[chainId].find((contract) => contract.prizePool.address === poolAddress)
}

export function usePoolContractBySymbol(chainId, symbol) {
  const poolContracts = useAllPoolContracts()
  if (!symbol) return null
  return poolContracts[chainId].find((contract) => contract.symbol === symbol)
}
