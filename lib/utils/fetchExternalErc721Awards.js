import { batch, contract } from '@pooltogether/etherplex'
import { isEmpty } from 'lodash'

import ERC721Abi from '@pooltogether/pooltogether-contracts/abis/ERC721UpgradeSafe'

import { axiosInstance } from 'lib/axiosInstance'

const debug = require('debug')('pool-app:fetchExternalErc721Awards')

const _getExternalErc721ItemAwardsChainData = async (
  provider,
  externalErc721Awards,
  poolAddress,
) => {
  const batchCalls = []

  let awards = {}
  let etherplexTokenContract
  let values, tokenValues
  let i, j

  // Prepare batched calls
  for (i = 0; i < externalErc721Awards?.length; i++) {
    const award = {
      ...externalErc721Awards[i],
      tokens: {}
    } 
    const erc721Address = award.address

    etherplexTokenContract = contract(erc721Address, ERC721Abi, erc721Address)

    batchCalls.push(
      etherplexTokenContract
        .balanceOf(poolAddress)
        .name()
        .symbol()
    )


    // TODO: split up the batching so we can query if metadata is supported by each NFT
    //       or better yet, store the check to see if tokenURI is implemented on the Subgraph
    for (j = 0; j < award.tokenIds?.length; j++) {
      const tokenId = award.tokenIds[j]

      try {
        tokenValues = await batch(
          provider,
          etherplexTokenContract
            .tokenURI(tokenId)
        )

        award.tokens[tokenId] = {
          tokenURI: tokenValues[erc721Address].tokenURI[0]
        }
      } catch (e) {
        console.log(`NFT with tokenId prob ${tokenId} does not support metadata (tokenURI()):`, e.message)
      }
    }

    awards[award.address] = award
  }

    
  // Execute batched calls
  values = await batch(
    provider,
    ...batchCalls
  )

  // Map batch call results to erc721 data and get metadata
  for (i = 0; i < externalErc721Awards?.length; i++) {
    const address = externalErc721Awards[i].address

    const award = awards[address]
    
    awards[address] = {
      ...award,
      tokens: awards[address].tokens,
      name: values[address].name[0],
      symbol: values[address].symbol[0],
      balance: values[address].balanceOf[0],
    }

    for (j = 0; j < award.tokenIds?.length; j++) {
      const tokenId = award.tokenIds[j]
      const tokenURI = award.tokens[tokenId].tokenURI
      debug(tokenURI)

      if (tokenURI.indexOf('http://') == 0 || tokenURI.indexOf('https://') == 0) {
        try {
          // bypass CORS
          const proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = tokenURI

          const response = await axiosInstance.get(proxyUrl + targetUrl)

          console.log(response.status)
          if (response.status < 305) {
            const data = response.data

            award.tokens[tokenId] = {
              ...award.tokens[tokenId],
              ...data
            }
          }
        } catch (e) {
          console.error('error while fetching 721 with tokenURI', tokenURI)
          console.error(e)
        }
      }
    }
  }
  debug(awards)

  return awards
}

export const fetchExternalErc721Awards = async (
  provider,
  externalAwardsGraphData,
  poolData,
) => {
  const poolAddress = poolData.poolAddress

  if (
    provider &&
    poolAddress &&
    !isEmpty(poolData) &&
    !isEmpty(externalAwardsGraphData)
  ) {
    let data = null

    data = await _getExternalErc721ItemAwardsChainData(
      provider,
      externalAwardsGraphData.externalErc721Awards,
      poolAddress,
    )

    return data
  }
}
