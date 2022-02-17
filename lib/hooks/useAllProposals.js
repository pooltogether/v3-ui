import gql from 'graphql-tag'
import { request } from 'graphql-request'
import { useQuery } from 'react-query'
import { isEmpty } from 'lodash'
import { batch, contract } from '@pooltogether/etherplex'
import { useReadProvider } from '@pooltogether/hooks'

import GovernorAlphaABI from 'abis/GovernorAlphaABI'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import {
  CONTRACT_ADDRESSES,
  POOLTOGETHER_CURRENT_GOVERNANCE_GRAPH_URIS,
  PROPOSAL_STATES,
  SECONDS_PER_BLOCK
} from 'lib/constants'
import { useBlockOnProviderLoad } from 'lib/hooks/providers/useBlockOnProviderLoad'
import { NETWORK } from 'lib/utils/networks'

export function useAllProposals() {
  const { refetch, data, isFetched, error } = useFetchProposals()

  if (error) {
    console.error(error)
  }

  return {
    refetch,
    data,
    isFetched,
    error
  }
}

function useFetchProposals() {
  // TODO: read useEnv() to get proper chainId to use here, but
  // only if it's mainnet or rinkeby since we don't have governance on other networks

  const readProvider = useReadProvider(NETWORK.mainnet)
  const block = useBlockOnProviderLoad()

  return useQuery(
    [QUERY_KEYS.proposalsQuery, NETWORK.mainnet, block?.blockNumber],
    async () => {
      return getProposals(readProvider, NETWORK.mainnet, block)
    },
    {
      enabled: readProvider && !isEmpty(block)
    }
  )
}

async function getProposals(provider, chainId, block) {
  const query = proposalsQuery()
  const governanceAddress = CONTRACT_ADDRESSES[chainId].GovernorAlpha

  try {
    const proposals = {}

    const subgraphData = await request(POOLTOGETHER_CURRENT_GOVERNANCE_GRAPH_URIS[chainId], query)

    const batchCalls = []
    subgraphData.proposals.forEach((proposal) => {
      const governanceContract = contract(proposal.id, GovernorAlphaABI, governanceAddress)
      batchCalls.push(governanceContract.proposals(proposal.id))
      batchCalls.push(governanceContract.state(proposal.id))
    })

    const proposalChainData = await batch(provider, ...batchCalls)

    const blockNumber = block.number
    const currentTimestamp = block.timestamp
    subgraphData.proposals.forEach((proposal) => {
      const { id, description } = proposal

      const endDateSeconds =
        currentTimestamp + SECONDS_PER_BLOCK * (Number(proposal.endBlock) - blockNumber)

      proposals[id] = {
        ...proposal,
        title: description?.split(/# |\n/g)[1] || 'Untitled',
        description: description || 'No description.',
        againstVotes: proposalChainData[id].proposals.againstVotes,
        forVotes: proposalChainData[id].proposals.forVotes,
        totalVotes: proposalChainData[id].proposals.forVotes.add(
          proposalChainData[id].proposals.againstVotes
        ),
        status: PROPOSAL_STATES[proposalChainData[id].state[0]],
        endDateSeconds
      }
    })

    return proposals
  } catch (error) {
    // console.error(JSON.stringify(error.message, undefined, 2))
    // throw new Error(error)
    return {
      proposals: {},
      error
    }
  }
}

const proposalsQuery = () => {
  return gql`
    query proposalsQuery {
      proposals {
        id
        proposer {
          id
          delegatedVotesRaw
          delegatedVotes
          tokenHoldersRepresentedAmount
        }
        targets
        values
        signatures
        calldatas
        startBlock
        endBlock
        description
        status
        executionETA
      }
    }
  `
}
