import React from 'react'

import { Tooltip } from 'lib/components/Tooltip'
import { shorten } from 'lib/utils/shorten'
import { BlockExplorerLink } from './BlockExplorerLink'

const PLAYER_LABELS = {
  '0x57e848a6915455a7e77cf0d55a1474befd9c374d': 'yearn.finance Users'
}

// mapping of YEARN strategy contracts to their corresponding vaults
const YEARN_STRATEGIES_TO_VAULTS = {
  '0x57e848a6915455a7e77cf0d55a1474befd9c374d': '0x19d3364a399d251e894ac732651be8b0e4e85001'
}

const YEARN_STRATEGIES_TO_NUM_HOLDERS = {
  '0x57e848a6915455a7e77cf0d55a1474befd9c374d': 939
}

export const PlayerLabel = (props) => {
  const { playerAddress, id } = props

  let label = Boolean(PLAYER_LABELS[playerAddress])
    ? PLAYER_LABELS[playerAddress]
    : shorten(playerAddress)

  const numHolders = YEARN_STRATEGIES_TO_NUM_HOLDERS[playerAddress]

  return (
    <>
      {label}{' '}
      {Boolean(numHolders) && (
        <>
          {` (~${numHolders})`}

          <Tooltip
            id={id}
            className='inline-block ml-1'
            tip={`There were ${numHolders} unique depositors in this yearn.finance vault last time this was updated.`}
          />
        </>
      )}{' '}
    </>
  )
}
