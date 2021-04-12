import { useGovernancePools } from 'lib/hooks/usePools'

export const useClaimablePoolTokenFaucetAddresses = () => {
  const { data } = useGovernancePools()
  return data?.map((pool) => pool.tokenListener.address)
}
