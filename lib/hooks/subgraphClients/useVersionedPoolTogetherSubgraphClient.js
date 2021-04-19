import { usePoolTogetherSubgraph310Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph310Client'
import { usePoolTogetherSubgraph332Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph332Client'
import { usePoolTogetherSubgraph338Client } from 'lib/hooks/subgraphClients/usePoolTogetherSubgraph338Client'

export function useVersionedPoolTogetherSubgraphClient(version) {
  let client
  switch (version) {
    case '3.1.0':
      client = usePoolTogetherSubgraph310Client()
      break
    case '3.3.2':
      client = usePoolTogetherSubgraph332Client()
      break
    case '3.3.8':
      client = usePoolTogetherSubgraph338Client()
      break
    default:
      client = usePoolTogetherSubgraph310Client()
      break
  }

  return client
}
