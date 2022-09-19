import MulticallAbi from '@abis/Multicall'
import { Signer } from '@ethersproject/abstract-signer'
import { BaseProvider } from '@ethersproject/providers'
import { getReadProvider } from '@pooltogether/wallet-connection'
import { getMulticallContractAddress } from '@utils/getMulticallContractAddress'
import { Contract, ethers } from 'ethers'

export const getMulticallContract = (
  chainId: number,
  _providerOrSigner?: BaseProvider | Signer
): Contract => {
  const multicallAddress = getMulticallContractAddress(chainId)
  const providerOrSigner = _providerOrSigner || getReadProvider(chainId)
  return new ethers.Contract(multicallAddress, MulticallAbi, providerOrSigner)
}
