import { useAllPodsByChainId } from 'lib/hooks/useAllPodsByChainId'
import { useAllPoolsKeyedByChainId } from 'lib/hooks/usePools'
import { useMemo } from 'react'
import TokenFaucetAbi from '@pooltogether/pooltogether-contracts_3_4/abis/TokenFaucet'
import TokenDropAbi from 'abis/TokenDropAbi'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import {
  FIRST_POLYGON_USDT_FAUCET_ADDRESS,
  FIRST_SUSHI_FAUCET_ADDRESS,
  SECOND_POLYGON_USDT_FAUCET_ADDRESS
} from 'lib/constants/tokenFaucets'

const TOKEN_FAUCETS_TO_SHOW_ZEROED = [FIRST_SUSHI_FAUCET_ADDRESS, FIRST_POLYGON_USDT_FAUCET_ADDRESS]
const TOKEN_FAUCETS_TO_HIDE = [SECOND_POLYGON_USDT_FAUCET_ADDRESS]

export const useAllTokenFaucetsByChainId = () => {
  const {
    data: poolsByChainId,
    isFetched: isPoolsFetched,
    refetch: refetchPools
  } = useAllPoolsKeyedByChainId()
  const {
    data: podsByChainId,
    isFetched: isPodsFetched,
    refetch: refetchPods
  } = useAllPodsByChainId()

  const isFetched = isPodsFetched && isPoolsFetched

  const refetch = async () => {
    refetchPods()
    refetchPools()
  }

  const data = useMemo(() => {
    if (!isFetched) {
      return null
    }

    const tokenFaucetsByChainId = {}

    const poolTokenFaucetsByChainId = getPoolTokenFaucetsByChainId(poolsByChainId)
    const podTokenFaucetsByChainId = getPodTokenFaucetsByChainId(podsByChainId)

    const poolChainIds = Object.keys(poolTokenFaucetsByChainId).map(Number)
    const podChainIds = Object.keys(podTokenFaucetsByChainId).map(Number)
    const allChainIds = new Set([...podChainIds, ...poolChainIds])

    allChainIds.forEach((chainId) => {
      const tokenFaucets = []

      const poolTokenFaucets = poolTokenFaucetsByChainId[chainId]?.map((tf) => ({
        ...tf,
        isPod: false
      }))
      if (poolTokenFaucets) {
        tokenFaucets.push(...poolTokenFaucets)
      }

      const podTokenFaucets = podTokenFaucetsByChainId[chainId]?.map((tf) => ({
        ...tf,
        isPod: true
      }))
      if (podTokenFaucets) {
        tokenFaucets.push(...podTokenFaucets)
      }

      tokenFaucetsByChainId[chainId] = tokenFaucets
    })

    return tokenFaucetsByChainId
  }, [poolsByChainId, podsByChainId, isFetched])

  return {
    refetch,
    isFetched,
    data
  }
}

const getPodTokenFaucetsByChainId = (podsByChainId) => {
  const podTokenFaucetsByChainId = {}
  const abi = TokenDropAbi

  const chainIds = Object.keys(podsByChainId).map(Number)

  chainIds.forEach((chainId) => {
    podTokenFaucetsByChainId[chainId] = []
    const pods = podsByChainId[chainId]

    pods.forEach((pod) => {
      const tokenFaucet = pod.prizePool.tokenFaucets.find(
        (tokenFaucet) => tokenFaucet.address.toLowerCase() === pod.faucet.address.toLowerCase()
      )
      const dripToken = pod.prizePool.tokens.tokenFaucetDripTokens?.find(
        (dripToken) =>
          dripToken.tokenFaucetAddress.toLowerCase() === tokenFaucet.address.toLowerCase()
      )
      const dripTokenAddress = dripToken?.address

      if (!tokenFaucet || !dripTokenAddress) {
        return
      }

      let apr = tokenFaucet.apr
      let faucetDripPerDay = tokenFaucet.dripRatePerDay
      const ticket = pod.tokens.ticket
      const podStablecoin = pod.tokens.podStablecoin
      const underlyingToken = pod.tokens.underlyingToken
      const label = `${underlyingToken.symbol} Pod`
      const addressToClaimFrom = pod.tokenDrop.address
      const href = `/players/[address]`
      const as = `/players/${pod.pod.address}`

      if (TOKEN_FAUCETS_TO_HIDE.includes(addressToClaimFrom)) {
        return
      } else if (TOKEN_FAUCETS_TO_SHOW_ZEROED.includes(addressToClaimFrom)) {
        apr = 0
        faucetDripPerDay = 0
      }

      podTokenFaucetsByChainId[chainId].push({
        abi,
        addressToClaimFrom,
        apr,
        faucetDripPerDay,
        label,
        href,
        as,
        tokens: {
          underlyingToken,
          dripToken,
          ticket,
          podStablecoin
        }
      })
    })
  })

  return podTokenFaucetsByChainId
}

const getPoolTokenFaucetsByChainId = (poolsByChainId) => {
  const poolTokenFaucets = {}
  const abi = TokenFaucetAbi

  const chainIds = Object.keys(poolsByChainId).map(Number)

  chainIds.forEach((chainId) => {
    const pools = poolsByChainId[chainId]
    poolTokenFaucets[chainId] = []

    pools.forEach((pool) => {
      const underlyingToken = pool.tokens.underlyingToken
      const ticket = pool.tokens.ticket

      const label = `${underlyingToken.symbol} Pool`
      const href = `/pools/[networkName]/[symbol]`
      const as = `/pools/${chainIdToNetworkName(chainId)}/${pool.prizePool.address}`

      pool?.tokenFaucets.forEach((tokenFaucet) => {
        let apr = tokenFaucet.apr
        let faucetDripPerDay = tokenFaucet.dripRatePerDay
        const addressToClaimFrom = tokenFaucet.address
        const dripToken = pool.tokens.tokenFaucetDripTokens.find(
          (dripToken) =>
            dripToken.tokenFaucetAddress.toLowerCase() === tokenFaucet.address.toLowerCase()
        )

        if (TOKEN_FAUCETS_TO_HIDE.includes(addressToClaimFrom)) {
          return
        } else if (TOKEN_FAUCETS_TO_SHOW_ZEROED.includes(addressToClaimFrom)) {
          apr = 0
          faucetDripPerDay = 0
        }

        poolTokenFaucets[chainId].push({
          abi,
          addressToClaimFrom,
          apr,
          faucetDripPerDay,
          label,
          href,
          as,
          tokens: {
            underlyingToken,
            dripToken,
            ticket
          }
        })
      })
    })
  })

  return poolTokenFaucets
}
