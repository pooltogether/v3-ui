import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { DropdownGeneric } from 'lib/components/DropdownGeneric'
import { PTCopyToClipboard } from 'lib/components/PTCopyToClipboard'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export function ContributeToLootBoxDropdown(props) {
  const { t } = useTranslation()

  const { pool } = props

  const { lootBoxIsFetching, lootBoxIsFetched, computedLootBoxAddress } = pool.lootBox

  if (lootBoxIsFetching && !lootBoxIsFetched) {
    return <V3LoadingDots />
  }

  if (!computedLootBoxAddress) {
    // prevent this warning from spamming your console
    if (Math.random() > 0.95) {
      console.warn('Could not compute loot box address! Hiding copy to clipboard feature')
    }

    return null
  }

  return (
    <>
      <div>
        <DropdownGeneric
          id='erc-20-awards-contribute-dropdown'
          className='mt-2 xs:mt-0 text-xxs sm:text-base text-lg'
          label={t('contributeToTheLootBox')}
        >
          <div className='text-inverse text-xxs xs:text-xs mr-4 xs:mr-10 w-64 xs:w-auto sm:w-auto px-5 py-3 bg-card border-2 border-secondary rounded-lg'>
            <div className='mb-2'>{t('transferTokensToLootBoxContractAddress')}</div>

            <PTCopyToClipboard widths='w-full' text={computedLootBoxAddress} />
          </div>
        </DropdownGeneric>
      </div>
    </>
  )
}
