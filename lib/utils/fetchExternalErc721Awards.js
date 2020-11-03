import { batch, contract } from '@pooltogether/etherplex'

import ERC721Abi from 'lib/../abis/CustomERC721'

import { axiosInstance } from 'lib/axiosInstance'

const debug = require('debug')('pool-app:fetchExternalErc721Awards')

const _tryMetadataMethod = async (provider, contractAddress, etherplexTokenContract, tokenId, method) => {
  let tokenValues

  try {
    tokenValues = await batch(
      provider,
      etherplexTokenContract[method](tokenId)
    )
    debug(tokenValues)

    return tokenValues[contractAddress][method][0]
  } catch (e) {
    // console.error(e)
    debug(`NFT with tokenId ${tokenId} likely does not support metadata using method: ${method}():`, e.message)
  }
}

export const fetchExternalErc721Awards = async ({
  provider,
  graphErc721Awards,
  poolAddress,
}) => {
  const batchCalls = []

  let awards = {}
  let etherplexTokenContract
  let values, tokenValues
  let i, j

  // Prepare batched calls
  for (i = 0; i < graphErc721Awards?.length; i++) {
    const award = {
      ...graphErc721Awards[i],
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
    //       or better yet, store the check to see if tokenURI/tokenMetadata is implemented on the Subgraph
    for (j = 0; j < award.tokenIds?.length; j++) {
      const tokenId = award.tokenIds[j]

      let tokenURI = await _tryMetadataMethod(provider, erc721Address, etherplexTokenContract, tokenId, 'tokenURI')

      if (!tokenURI) {
        tokenURI = await _tryMetadataMethod(provider, erc721Address, etherplexTokenContract, tokenId, 'tokenMetadata')
      }

      award.tokens[tokenId] = {
        tokenURI
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
  for (i = 0; i < graphErc721Awards?.length; i++) {
    const address = graphErc721Awards[i].address

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

      if (!tokenURI) {
        continue
      }
      debug(tokenURI)

      if (tokenURI.indexOf('http://') == 0 || tokenURI.indexOf('https://') == 0) {
        try {
          // bypass CORS
          const proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = tokenURI

          const response = await axiosInstance.get(proxyUrl + targetUrl)

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
