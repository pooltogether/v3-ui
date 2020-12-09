import { POOLTOGETHER_VERSION_START_BLOCKS, POOLTOGETHER_GRAPH_URIS  } from 'lib/constants'

// Determines the correct subgraph to use depending on the block being queried
// and the environment the app is set to (ie. staging or production)
// (eg. if incoming block # is: 7400000, use 3_0_1)
// (eg. if incoming block # is: 7700000, use 3_1_0)

// v_3_0_1: 7399763
// v_3_1_0: 7687002
export function getPoolSubgraphUri(chainId, incomingBlockNumber, env = process.env.NEXT_JS_ENV) {
  const v3_0_1StartingBlock = POOLTOGETHER_VERSION_START_BLOCKS['v3_0_1'][env][chainId]
  const v3_1_0StartingBlock = POOLTOGETHER_VERSION_START_BLOCKS['v3_1_0'][env][chainId]

  if (incomingBlockNumber >= v3_0_1StartingBlock && incomingBlockNumber < v3_1_0StartingBlock) {
    return POOLTOGETHER_GRAPH_URIS['v3_0_1'][env][chainId]
  } else if (incomingBlockNumber >= v3_1_0StartingBlock) {
    return POOLTOGETHER_GRAPH_URIS['v3_1_0'][env][chainId]
  } else {
    console.warn('getPoolSubgraphUri(), Could not find Subgraph URI for chainId, env and incomingBlockNumber:', chainId, env, incomingBlockNumber)
    return false
  }
}
