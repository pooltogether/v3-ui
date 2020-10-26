import { useQuery } from '@apollo/client'

import { timeTravelPoolQuery } from 'lib/queries/timeTravelPoolQuery'

export const TimeTravelPool = (
  props,
) => {
  const { children, pool, prize } = props

  const query = timeTravelPoolQuery(prize?.awardedBlock)

  const variables = {
    prizePoolAddress: pool.poolAddress,
  }

  const { loading, error, data } = useQuery(query, {
    variables,
    skip: !pool || !prize,
    fetchPolicy: 'network-only',
  })

  if (error) {
    console.error(error)
  }

  const formattedData = {
    ...data?.timeTravelPrizePool,
    ticketSupply: data?.timeTravelPrizePool?.prizeStrategy?.singleRandomWinner?.ticket?.totalSupply
  }

  return children(formattedData)
}
