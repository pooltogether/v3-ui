import { find } from 'lodash'
import { DRIP_TOKENS } from 'lib/constants'

export const extractPoolRewardsFromUserDrips = ({poolAddresses, dynamicPlayerDrips}) => {
  const dripTokens = dynamicPlayerDrips?.dripTokens || []

  const balanceDrips = dynamicPlayerDrips?.balanceDrips.filter(drip => {
    return poolAddresses.includes(drip.balanceDrip.prizePool.id)
  })
  const volumeDrips = dynamicPlayerDrips?.volumeDrips.filter(drip => {
    return poolAddresses.includes(drip.volumeDrip.prizePool.id)
  })

  const playerRewards = {
    balance: [],
    volume: [],
    refVolume: []
  }

  dripTokens.forEach(drip => {
    const [, dripToken] = drip.id.split('-')
    const dripTokenData = DRIP_TOKENS[dripToken] || {name: 'Unknown', symbol: 'UNK'}

    // Balance Drips
    const balDrip = find(balanceDrips, bd => bd.balanceDrip.dripToken === dripToken)
    if (balDrip) {
      playerRewards.balance.push({
        dripToken: {
          address: dripToken,
          name: dripTokenData.name,
          symbol: dripTokenData.symbol,
        },
        ...drip,
        ...balDrip,
      })
    }

    // Volume Drips
    const volDrip = find(volumeDrips, vd => vd.volumeDrip.dripToken === dripToken)
    if (volDrip) {
      const dripData = {
        dripToken: {
          address: dripToken,
          name: dripTokenData.name,
          symbol: dripTokenData.symbol,
        },
        ...drip,
        ...volDrip,
      }

      if (volDrip.volumeDrip.referral) {
        playerRewards.refVolume.push(dripData)
      } else {
        playerRewards.volume.push(dripData)
      }
    }
  })

  return playerRewards
}