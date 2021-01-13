import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

// Etherplex was choking on the loot-box/contracts ABI so I created one with only the balanceOf fxn definition
import ERC1155Abi from 'lib/../abis/ERC1155Custom'

const debug = require('debug')('pool-app:fetchExternalErc1155Awards')

export const fetchExternalErc1155Awards = async ({
  provider,
  erc1155Awards,
  balanceOfAddress,
}) => {
  const poolsExternalErc1155AwardsData = []
  const batchCalls = []
  
  let etherplexTokenContract
  let values
  let i

  // Prepare batched calls
  for (i = 0; i < erc1155Awards?.length; i++) {
    const award = erc1155Awards[i]
    const address = award.address
    const tokenId = ethers.utils.bigNumberify(award.tokenIds[0])
    etherplexTokenContract = contract(address, ERC1155Abi, address)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(balanceOfAddress, tokenId)
    )
  }

  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to erc1155 data
  for (i = 0; i < erc1155Awards?.length; i++) {
    const award = erc1155Awards[i]
    const address = award.address

    const balance = values[address].balanceOf[0]

    poolsExternalErc1155AwardsData.push({
      address,
      balance,
    })
  }

  return poolsExternalErc1155AwardsData
}
