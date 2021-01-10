import { isEmpty, omit } from 'lodash'

export const compileHistoricalErc721Awards = (externalErc721Awards, externalErc721ChainData) => {
  let data = []

  if (
    isEmpty(externalErc721Awards) ||
    isEmpty(externalErc721ChainData)
  ) {
    return data
  }

  // Format each 721 into it's own nice, shallow award data object
  externalErc721Awards.forEach(obj => {
    const erc721ChainData = externalErc721ChainData[obj.address]
    delete erc721ChainData.tokenIds

    obj.tokenIds.forEach(tokenId => {
      const metadata = erc721ChainData.tokens[tokenId]
      const objData = omit(obj, 'tokenIds')
      const chainData = omit(erc721ChainData, 'tokens')

      data.push({
        tokenId,
        metadata,
        ...objData,
        ...chainData
      })
    })
  })

  return data
}
