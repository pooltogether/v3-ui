import { ethers } from 'ethers'

export function calculateEstimatedPoolPrize(poolData) {
  const principal = ethers.utils.parseEther(poolData.totalSupply).add(poolData.totalSponsorship)
  const supplyRatePerBlock = poolData.supplyRatePerBlock || 0
  const remainingBlocks = poolData.estimateRemainingBlocksToPrize || 0

  console.log({
    principal: principal.toString(),
    remainingBlocks: remainingBlocks.toString(),
    supplyRatePerBlock: supplyRatePerBlock.toString()
  })

  return principal.mul(supplyRatePerBlock).mul(remainingBlocks)
}
