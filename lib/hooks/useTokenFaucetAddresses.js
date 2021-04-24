import { useAllPools, useGovernancePools } from 'lib/hooks/usePools'

export const useTokenFaucetAddresses = () => {
  const { data } = useAllPools()
  return data?.map((pool) => pool.tokenListener?.address).filter(Boolean)
}
