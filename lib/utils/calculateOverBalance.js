import { ethers } from 'ethers'

export function calculateOverBalance(erc20UserQuery, purchaseAmount, userBalance) {
  const { decimals, loading } = erc20UserQuery

  let over = null

  if (!loading && purchaseAmount) {
    const balanceInEther = ethers.utils.formatUnits(userBalance, decimals)

    const userBalanceInt = parseInt(balanceInEther, 10)
    const purchaseAmountInt = parseInt(purchaseAmount, 10)

    over = purchaseAmountInt > userBalanceInt
  }

  return over
}
