import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'

import { useTranslation } from 'lib/../i18n'
import { DropdownGeneric } from 'lib/components/DropdownGeneric'
import { poolToast } from 'lib/utils/poolToast'

export const ContributeToLootBoxDropdown = (props) => {
  const { t } = useTranslation()

  const { pool } = props

  const handleCopy = () => {
    poolToast.success(t('copiedToClipboard'))
  }

  return <>
    <DropdownGeneric
      id='erc-20-awards-contribute-dropdown'
      className='mt-2 xs:mt-0 text-xxs sm:text-base text-lg'
      label={t('contributeToTheLootBox')}
    >
      <div
        className='text-inverse text-xxs xs:text-xs mr-4 xs:mr-10 w-40 xs:w-auto sm:w-auto px-5 py-3 bg-card border-2 border-secondary rounded-lg'
      >
        <div className='mb-2'>
          {t('transferTokensToLootBoxContractAddress')}
        </div>

        <CopyToClipboard
          text={pool.poolAddress}
          onCopy={handleCopy}
        >
          <a
            className='flex w-full items-center cursor-pointer stroke-current hover:text-secondary text-primary h-8 py-1 xs:mb-2 sm:mb-0 bg-accent-grey-3 hover:bg-highlight-2 rounded-sm'
            title='Copy to clipboard'
          >
            <span
              className='px-2 flex-grow font-bold text-xxs xs:text-xs w-16 truncate'
            >
              {pool.poolAddress}
            </span>
            <FeatherIcon
              icon='copy'
              className='w-4 h-4 mx-1 my-1 justify-self-end'
            />
          </a>
        </CopyToClipboard>
      </div>
    </DropdownGeneric>
  </>
}