import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { ButtonLink } from 'lib/components/ButtonLink'
import { NonInteractableCard } from 'lib/components/NonInteractableCard'

export const PoolRowGhost = (
  props,
) => {  
  const { t } = useTranslation()
  
  return <>
    <div
      className='hover:bg-default border-accent-4 border-dashed border-2 w-full px-4 xs:px-6 mb-4 py-5 sm:py-6 trans rounded-lg text-inverse'
    >

      <div className='flex flex-col items-center py-6 opacity-80 hover:opacity-100 trans'>
        <h6
          className='flex justify-center font-bold w-full text-default-soft mb-4 text-center'
        >
          {t('suggestANewPool')}
        </h6>

        <ButtonLink
          secondary
          href='https://discord.gg/hxPhPDW'
          as='https://discord.gg/hxPhPDW'
          width='w-7/12 sm:w-1/2'
        >
          {t('suggestPool')}
        </ButtonLink>
      </div>
    </div>
  </>
}
