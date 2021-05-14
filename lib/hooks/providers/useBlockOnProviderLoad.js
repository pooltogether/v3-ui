import { useContext, useEffect } from 'react'
import { atom, useAtom } from 'jotai'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

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
  const { chainId } = useContext(AuthControllerContext)
  const { data: readProvider } = useReadProvider(chainId)
  const [currentBlock, setCurrentBlock] = useAtom(currentBlockAtom)

  useEffect(() => {
    getBlockNumber(readProvider, setCurrentBlock)
  }, [readProvider, chainId])

  return currentBlock
}
