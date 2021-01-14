import { orderBy } from 'lodash'

import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { compileLootBoxErc20s } from 'lib/services/compileLootBoxErc20s'
import { compileLootBoxErc721s } from 'lib/services/compileLootBoxErc721s'
import { compileLootBoxErc1155s } from 'lib/services/compileLootBoxErc1155s'
import { getAllAwards } from 'lib/services/getAllAwards'
import { uniswapTokensToQuery } from 'lib/services/uniswapTokensToQuery'

export const useLootBoxAwards = function (lootBox, externalErcAwards, blockNumber) {
  // mash the top-level 721s, 20s and anything in the lootbox together:
  const { lootBoxAwards, erc20Awards, erc721Awards, erc1155Awards } = getAllAwards(lootBox, externalErcAwards)

  const { addresses } = uniswapTokensToQuery(erc20Awards)
  const { data: uniswapPriceData } = useUniswapTokensQuery(addresses, blockNumber)
  const compiledErc20s = compileLootBoxErc20s(erc20Awards, uniswapPriceData)
  const compiledErc721s = compileLootBoxErc721s(erc721Awards)
  const compiledErc1155s = compileLootBoxErc1155s(erc1155Awards)

  let awards = { ...compiledErc20s, ...compiledErc721s, ...compiledErc1155s }
  awards = orderBy(awards, ({ value }) => value || '', ['desc'])

  return { awards, lootBoxAwards }
}
