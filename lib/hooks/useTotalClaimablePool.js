import { ethers } from 'ethers'
import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { useClaimableTokenFromTokenFaucets } from 'lib/hooks/useClaimableTokenFromTokenFaucets'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'

export const useTotalClaimablePool = (address) => {
  const {
    error: claimableFromTokenFaucetsError,
    data: claimableFromTokenFaucets,
    isFetched: claimableFromTokenFaucetIsFetched
  } = useClaimableTokenFromTokenFaucets(address)

  const poolTokenChainId = usePoolTokenChainId()

  if (claimableFromTokenFaucetsError) {
    console.error(claimableFromTokenFaucetsError)
  }

  const {
    error: retroPoolClaimError,
    data: retroPoolClaimData,
    isFetched: retroPoolClaimDataIsFetched
  } = useRetroactivePoolClaimData()

  if (retroPoolClaimError) {
    console.error(retroPoolClaimError)
  }

  const isFetched = claimableFromTokenFaucetIsFetched && retroPoolClaimDataIsFetched

  const poolTokenAddress = CUSTOM_CONTRACT_ADDRESSES[poolTokenChainId].GovernanceToken.toLowerCase()

  let total
  if (isFetched) {
    total = Number(claimableFromTokenFaucets.totals?.[poolTokenAddress]?.totalClaimableAmount) || 0

    if (retroPoolClaimData?.formattedAmount && !retroPoolClaimData.isClaimed) {
      total += retroPoolClaimData.formattedAmount
    }
  }

  return {
    isFetched,
    total
  }
}
