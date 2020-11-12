import { PoolData } from 'lib/components/PoolData'
import { UniswapData } from 'lib/components/UniswapData'
// import { timeTravelPoolQuery } from 'lib/queries/timeTravelPoolQuery'

export const TimeTravelPool = (
  props,
) => {
  const { blockNumber, children, poolAddress } = props

  // const query = timeTravelPoolQuery(blockNumber)

  // const { loading, error, data } = useQuery(query, {
  //   variables: {
  //     prizePoolAddress
  //   },
  //   skip: !prizePoolAddress || !blockNumber,
  //   fetchPolicy: 'network-only',
  // })

  // if (error) {
  //   console.error(error)
  // }



  // console.log(poolAddress, blockNumber)

  return <PoolData
    poolAddress={poolAddress}
    blockNumber={blockNumber}
  >
    {(pools) => {
      if (!pools) {
        return children({
          loading: true
        })
      }

      let pool = pools?.find(_pool => _pool.id === poolAddress)

      pool = {
        ...pool,
        ticketSupply: pool.prizeStrategy?.singleRandomWinner?.ticket?.totalSupply
      }

      const addresses = pool?.prizeStrategy?.externalErc20Awards?.map(award => award.address)
      
      return <UniswapData
        addresses={addresses}
        blockNumber={blockNumber}
        poolAddress={poolAddress}
      >
        {(uniswapData) => {
          return children(pool)
        }}
      </UniswapData>
    }}
  </PoolData>

   
}
