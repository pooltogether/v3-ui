import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { DropdownGeneric } from 'lib/components/DropdownGeneric'
import { PTCopyToClipboard } from 'lib/components/PTCopyToClipboard'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useEthereumLootBoxQuery } from 'lib/hooks/useEthereumLootBoxQuery'

export function ContributeToLootBoxDropdown(props) {
  const { t } = useTranslation()

  const { pool } = props

  const response = useEthereumLootBoxQuery(pool)
  const { computedLootBoxAddress } = response?.data || {}

  // const addressToCopy = computedLootBoxAddress || pool.poolAddress

  if (!Boolean(computedLootBoxAddress)) {
    return <V3LoadingDots />
  }

  return <>
    <div>
      <DropdownGeneric
        id='erc-20-awards-contribute-dropdown'
        className='mt-2 xs:mt-0 text-xxs sm:text-base text-lg'
        label={t('contributeToTheLootBox')}
      >
        <div
          className='text-inverse text-xxs xs:text-xs mr-4 xs:mr-10 w-64 xs:w-auto sm:w-auto px-5 py-3 bg-card border-2 border-secondary rounded-lg'
        >
          <div className='mb-2'>
            {t('transferTokensToLootBoxContractAddress')}
          </div>

          <PTCopyToClipboard
            widths='w-full'
            text={computedLootBoxAddress}
          />
        </div>
      </DropdownGeneric>
    </div>
  </>
}