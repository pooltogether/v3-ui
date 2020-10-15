import { find } from 'lodash'

// import { DRIP_TOKENS } from 'lib/constants'

export const extractPoolRewardsFromUserDrips = ({poolAddresses, dynamicPlayerDrips}) => {
  const dripTokens = dynamicPlayerDrips?.dripTokens || []

  const balanceDrips = []
  const volumeDrips = []

  // const balanceDrips = dynamicPlayerDrips?.balanceDrips.filter(drip => {
  //   return poolAddresses.includes(drip.balanceDrip.prizePool.id)
  // })
  // const volumeDrips = dynamicPlayerDrips?.volumeDrips.filter(drip => {
  //   return poolAddresses.includes(drip.volumeDrip.prizePool.id)
  // })

  const playerRewards = {
    allDrips: [],
    balance: [],
    volume: [],
    refVolume: []
  }

  dripTokens.forEach(drip => {
    const [comptroller, dripToken, player] = drip.id.split('-')
    const dripTokenData = { name: 'Unknown', symbol: 'UNK' }
    // const dripTokenData = DRIP_TOKENS[dripToken] || {name: 'Unknown', symbol: 'UNK'}
    let finalDripData = {
      dripToken: {
        address: dripToken,
        name: dripTokenData.name,
        symbol: dripTokenData.symbol,
      },
      ...drip,
    }

    // Balance Drips
    const balDrip = find(balanceDrips, bd => bd.balanceDrip.dripToken === dripToken)
    if (balDrip) {
      finalDripData = {
        ...finalDripData,
        ...balDrip
      }
      playerRewards.balance.push({...finalDripData})
    }

    // Volume Drips
    const volDrip = find(volumeDrips, vd => vd.volumeDrip.dripToken === dripToken)
    if (volDrip) {
      finalDripData = {
        ...finalDripData,
        ...volDrip
      }
      if (volDrip.volumeDrip.referral) {
        playerRewards.refVolume.push({...finalDripData})
      } else {
        playerRewards.volume.push({...finalDripData})
      }
    }

    playerRewards.allDrips.push({...finalDripData})
  })

  return playerRewards
}