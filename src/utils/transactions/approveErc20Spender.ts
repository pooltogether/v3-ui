import ERC20Abi from '@abis/ERC20'
import { TransactionResponse } from '@ethersproject/providers'
import { ethers, Signer } from 'ethers'

export const approveErc20Spender = async (
  signer: Signer,
  tokenAddress: string,
  spenderAddress: string,
  amountUnformatted = ethers.constants.MaxUint256
) => {
  const allowanceContract = new ethers.Contract(tokenAddress, ERC20Abi, signer)
  const response: TransactionResponse = await allowanceContract.approve(
    spenderAddress,
    amountUnformatted
  )
  return response
}
