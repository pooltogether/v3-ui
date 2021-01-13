import { batch, contract } from '@pooltogether/etherplex'

import ERC1155Abi from '@pooltogether/loot-box/artifacts/ERC1155Upgradeable'

const debug = require('debug')('pool-app:fetchExternalErc1155Awards')

export const fetchExternalErc1155Awards = async ({
  provider,
  graphErc1155Awards,
  balanceOfAddress,
}) => {
  const poolsExternalErc1155AwardsData = []
  const batchCalls = []
  
  let etherplexTokenContract
  let erc1155Address
  let values
  let i
  
  const awards = graphErc1155Awards?.map(award => award.address)

  // Prepare batched calls
  for (i = 0; i < awards?.length; i++) {
    erc1155Address = awards[i]
    etherplexTokenContract = contract(erc1155Address, ERC1155Abi, erc1155Address)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(balanceOfAddress)
    )
  }

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to erc1155 data
  for (i = 0; i < awards?.length; i++) {
    erc1155Address = awards[i]
    etherplexTokenContract = awards[erc1155Address]

    const balance = values[erc1155Address].balanceOf[0]

    poolsExternalErc1155AwardsData.push({
      ...etherplexTokenContract,
      address: erc1155Address,
      balance,
    })
  }

  return poolsExternalErc1155AwardsData
}
