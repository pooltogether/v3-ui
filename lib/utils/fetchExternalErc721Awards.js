import { batch, contract } from '@pooltogether/etherplex'

import ERC721Abi from 'lib/../abis/CustomERC721'

import { axiosInstance } from 'lib/axiosInstance'

const _tryMetadataMethod = async (provider, contractAddress, etherplexTokenContract, tokenId, method) => {
  let tokenValues

  try {
    tokenValues = await batch(
      provider,
      etherplexTokenContract[method](tokenId)
    )

    return tokenValues[contractAddress][method][0]
  } catch (e) {
    console.log(`NFT with tokenId ${tokenId} likely does not support metadata using method: ${method}():`, e.message)
  }
}

export const fetchExternalErc721Awards = async ({
  provider,
  graphErc721Awards,
  balanceOfAddress,
}) => {
  const batchCalls = []

  let awards = {}
  let etherplexTokenContract
  let values
  let i, j

  // Prepare batched calls
  for (i = 0; i < graphErc721Awards?.length; i++) {
    const award = {
      ...graphErc721Awards[i],
      tokens: {}
    }
    const erc721Address = award.address

    etherplexTokenContract = contract(erc721Address, ERC721Abi, erc721Address)

    // batchCalls.push(
    //   etherplexTokenContract
    //     .balanceOf(balanceOfAddress)
    //     .name()
    //     .symbol()
    //     .ownerOf()
    // )

    // TODO: split up the batching so we can query if metadata is supported by each NFT
    //       or better yet, store the check to see if tokenURI/tokenMetadata is implemented on the Subgraph
    for (j = 0; j < award.tokenIds.length; j++) {
      const tokenId = award.tokenIds[j]

      let tokenURI = await _tryMetadataMethod(provider, erc721Address, etherplexTokenContract, tokenId, 'tokenURI')

      if (!tokenURI) {
        tokenURI = await _tryMetadataMethod(provider, erc721Address, etherplexTokenContract, tokenId, 'tokenMetadata')
      }

      award.tokens[tokenId] = {
        tokenURI
      }

      batchCalls.push(
        etherplexTokenContract
          .balanceOf(balanceOfAddress)
          .name()
          .symbol()
          .ownerOf(tokenId)
      )
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
      ownerOf: values[address].ownerOf[0],
    }

    for (j = 0; j < award.tokenIds?.length; j++) {
      const tokenId = award.tokenIds[j]
      const tokenURI = award.tokens[tokenId].tokenURI

      if (!tokenURI) {
        continue
      }

      if (Boolean(tokenURI.match('http'))) {
        try {
          // bypass CORS
          const proxyUrl = '',
            targetUrl = tokenURI

          const response = await axiosInstance.get(proxyUrl + targetUrl)

          if (response.status < 305) {
            const data = response.data

            // ignore PNGs, etc. We only want JSON objects:
            if (typeof data === 'object') {
              award.tokens[tokenId] = {
                ...award.tokens[tokenId],
                ...data
              }
            }
          }
        } catch (e) {
          console.error('error while fetching 721 with tokenURI', tokenURI)
          console.error(e)
        }
      }
    }
  }

  return awards
}
