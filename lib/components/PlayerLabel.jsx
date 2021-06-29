import React from 'react'
import { shorten } from '@pooltogether/utilities'
import { Tooltip } from '@pooltogether/react-components'
import FeatherIcon from 'feather-icons-react'

import { useTranslation } from 'react-i18next'

const PLAYER_LABELS = {
  '0x57e848a6915455a7e77cf0d55a1474befd9c374d': 'yearn.finance DAI Users',
  '0x387fca8d7e2e09655b4f49548607b55c0580fc63': 'yearn.finance USDC Users',
  '0x2f994e2e4f3395649eee8a89092e63ca526da829': '🐳 PoolTogether DAI Pod Users',
  '0x386eb78f2ee79adde8bdb0a0e27292755ebfea58': '🐳 PoolTogether USDC Pod Users',
  '0x09accc89e3599137c83fb87acb9443a15c4bd268': '🐳 /r/ethfinance Pod Users'
}

// mapping of YEARN strategy contracts to their corresponding vaults
const YEARN_STRATEGIES_TO_VAULTS = {
  '0x57e848a6915455a7e77cf0d55a1474befd9c374d': '0x19d3364a399d251e894ac732651be8b0e4e85001',
  '0x387fca8d7e2e09655b4f49548607b55c0580fc63': '0x5f18c75abdae578b483e5f43f12a39cf75b973a9'
}

const YEARN_STRATEGIES_TO_NUM_HOLDERS = {
  '0x57e848a6915455a7e77cf0d55a1474befd9c374d': 939,
  '0x387fca8d7e2e09655b4f49548607b55c0580fc63': 2240
}

export const PlayerLabel = (props) => {
  const { t } = useTranslation()
  const { id } = props

  let playerAddress = props.playerAddress?.toLowerCase()

  let label = Boolean(PLAYER_LABELS[playerAddress])
    ? PLAYER_LABELS[playerAddress]
    : shorten(playerAddress)

  const numHolders = YEARN_STRATEGIES_TO_NUM_HOLDERS[playerAddress]

  return (
    <span className='flex flex-wrap'>
      <span className='xs:whitespace-nowrap'>{label}</span>
      {Boolean(numHolders) && (
        <>
          <Tooltip
            id={`player-label-${id}-tooltip`}
            className='inline-block ml-1'
            tip={t('numHoldersInYearnVault', { numHolders })}
          >
            <span className='flex mr-2'>
              {` (~${numHolders})`} <FeatherIcon icon='info' className='w-4 h-4 my-auto ml-1' />
            </span>
          </Tooltip>
        </>
      )}{' '}
    </span>
  )
}
