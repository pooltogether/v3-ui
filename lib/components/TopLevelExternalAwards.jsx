import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { Erc20AwardsTable } from 'lib/components/Erc20AwardsTable'
import { Erc721AwardsTable } from 'lib/components/Erc721AwardsTable'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const TopLevelExternalAwards = (props) => {
  const { t } = useTranslation()
  
  const { pool } = props

  console.log(pool?.compiledExternalErc20Awards)
  console.log(pool?.compiledExternalErc721Awards)

  const compiledExternalErc20Awards = pool?.compiledExternalErc20Awards
  const compiledExternalErc721Awards = pool?.compiledExternalErc721Awards
  
  return <>
    <div
      id='top-level-awards-table'
      className='non-interactable-card mt-4 mb-2 sm:mb-0 sm:mt-10 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='text-caption uppercase mb-3'
      >
        <img
          src={GiftIcon}
          className='inline-block mr-2 card-icon'
        /> {t('grandPrize')}
      </div>

      <Erc20AwardsTable
        {...props}
        compiledExternalErc20Awards={compiledExternalErc20Awards}
      />

      <Erc721AwardsTable
        {...props}
        compiledExternalErc721Awards={compiledExternalErc721Awards}
      />
    </div>
  </>
}
