import { isEmpty } from 'lodash'

export const compileErc721Awards = (erc721ChainData, poolData) => {
  const erc721GraphData = poolData?.prizeStrategy?.externalErc721Awards

  if (isEmpty(erc721ChainData) || isEmpty(erc721GraphData)) {
    return {}
  }

  const keys = Object.keys(erc721ChainData)

  return keys.map(key => ({
    ...erc721ChainData[key],
    ...erc721GraphData[key],
  }))
}
