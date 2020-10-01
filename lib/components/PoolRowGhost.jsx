import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { useTranslation } from 'lib/../i18n'
import { ButtonLink } from 'lib/components/ButtonLink'
import { InteractableCard } from 'lib/components/InteractableCard'

export const PoolRowGhost = (
  props,
) => {  
  const { t } = useTranslation()
  
  return <>
    <InteractableCard
      selected
      key={`pool-row-ghost-card`}
      href='https://discord.gg/hxPhPDW'
      as={`https://discord.gg/hxPhPDW`}
    >
      <div className='flex flex-col items-center'>
        <div
          className='flex justify-center font-bold w-full text-primary mb-4'
        >
          {t('suggestANewPool')}
        </div>

        <ButtonLink
          secondary
          href='https://discord.gg/hxPhPDW'
          as='https://discord.gg/hxPhPDW'
          width='w-7/12 sm:w-1/2'
        >
          {t('suggestPool')}
        </ButtonLink>
      </div>
    </InteractableCard>
  </>
}
