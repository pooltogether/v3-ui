import { useWalletChainId } from 'lib/hooks/chainId/useWalletChainId'
import { PRIZE_POOL_CONTRACTS } from 'lib/constants/contracts'
import { useEnvironmentChainIds } from 'lib/hooks/chainId/useEnvironmentChainIds'

export function useAllPoolContracts() {
  const communityContracts = useCommunityPoolContracts()
  const governanceContracts = useGovernancePoolContracts()
  return [...Object.values(governanceContracts), ...Object.values(communityContracts)].flat()
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

export function usePoolContractByAddress(poolAddress) {
  const poolContracts = useAllPoolContracts()
  if (!poolAddress) return null
  return poolContracts.find((contract) => contract.prizePool.address === poolAddress)
}

export function usePoolContractBySymbol(symbol) {
  const poolContracts = useAllPoolContracts()
  if (!symbol) return null
  return poolContracts.find((contract) => contract.symbol === symbol)
}
