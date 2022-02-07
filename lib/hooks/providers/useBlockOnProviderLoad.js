import { useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { useReadProvider } from '@pooltogether/hooks'

const currentBlockAtom = atom({})

export const getBlockNumber = async (readProvider, setCurrentBlock) => {
  if (readProvider?.getBlockNumber) {
    const blockNumber = await readProvider.getBlockNumber()

    const block = await readProvider.getBlock(blockNumber)
    setCurrentBlock({
      ...block,
      blockNumber
    })
  }
}

export const useBlockOnProviderLoad = () => {
  const { network: chainId } = useOnboard()
  const readProvider = useReadProvider(chainId)
  const [currentBlock, setCurrentBlock] = useAtom(currentBlockAtom)

  useEffect(() => {
    getBlockNumber(readProvider, setCurrentBlock)
  }, [readProvider, chainId])

  return currentBlock
}
