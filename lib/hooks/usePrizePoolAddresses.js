import { contractAddresses } from '@pooltogether/current-pool-data'
import { useOnboard } from '@pooltogether/hooks'
import { useMemo } from 'react'

export const usePrizePoolAddresses = () => {
  const { network: chainId } = useOnboard()

  return useMemo(() => {
    const addresses = []

    const contracts = contractAddresses[chainId]

    if (contracts) {
      const contractKeys = Object.keys(contracts)

      contractKeys.forEach((key) => {
        if (contracts[key].prizePool) {
          addresses.push(contracts[key].prizePool)
        }
      })
    }

    return addresses
  }, [chainId])
}
