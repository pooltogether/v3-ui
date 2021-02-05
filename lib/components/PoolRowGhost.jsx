import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { ButtonLink } from 'lib/components/ButtonLink'

export const PoolRowGhost = (props) => {
  const { t } = useTranslation()

  return (
    <>
      <div className='bg-highlight-8 w-full px-6 sm:px-10 mb-4 py-4 trans rounded-lg text-inverse mt-4'>
        <div className='flex flex-col items-center py-6 trans'>
          <div className='text-xl xs:text-2xl sm:text-3xl'>
            <span className={`mx-4`} role='img' aria-label='ticket emoji'>
              🎟️
            </span>{' '}
            <span className={`mx-4`} role='img' aria-label='trophy'>
              🏆
            </span>{' '}
            <span className={`mx-4`} role='img' aria-label='ticket emoji'>
              🎟️
            </span>
          </div>
          <div className='flex justify-center w-full text-inverse mb-4 text-center text-xxs xs:text-sm sm:text-base lg:text-lg'>
            {t('suggestANewPool')}
          </div>

          <ButtonLink
            secondary
            href='https://discord.gg/hxPhPDW'
            as='https://discord.gg/hxPhPDW'
            // width='w-7/12 sm:w-1/2'
          >
            {t('suggestPool')}
          </ButtonLink>
        </div>
      </div>
    </>
  )
}
