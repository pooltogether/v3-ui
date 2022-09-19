import { MULTICALL_ADDRESS } from '@constants/multicall'

export const getMulticallContractAddress = (chainId: number) => MULTICALL_ADDRESS[chainId]
