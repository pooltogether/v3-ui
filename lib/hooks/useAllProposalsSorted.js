import { useMemo } from 'react'

import { PROPOSAL_STATUS } from 'lib/constants'
import { useAllProposals } from 'lib/hooks/useAllProposals'

export function useAllProposalsSorted() {
  const { refetch, data: proposals, isFetching, isFetched, error } = useAllProposals()

  const sortedProposals = useMemo(() => {
    const active = []

    if (!proposals) return { active }

    Object.keys(proposals).forEach((id) => {
      const proposal = proposals[id]

      if (proposal.status === PROPOSAL_STATUS.active) {
        active.push(proposal)
      }
    })

    return {
      active
    }
  }, [proposals])

  return {
    refetch,
    sortedProposals,
    data: proposals,
    isFetching,
    isFetched,
    error
  }
}
