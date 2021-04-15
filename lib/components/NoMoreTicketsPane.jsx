import React from 'react'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { useCurrentPool } from 'lib/hooks/usePools'
import { Button } from 'lib/components/Button'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { PaneTitle } from 'lib/components/PaneTitle'
import { handleCloseWizard } from 'lib/utils/handleCloseWizard'

export function NoMoreTicketsPane(props) {
  const { t } = useTranslation()

  const router = useRouter()

  const handleClose = (e) => {
    e.preventDefault()

    handleCloseWizard(router)
  }

  const { data: pool } = useCurrentPool()

  return (
    <div className='text-xl xs:text-3xl sm:text-5xl'>
      <span className={`mx-4`} role='img' aria-label='ticket emoji'>
        🎟️
      </span>{' '}
      <span className={`mx-4`} role='img' aria-label='flushed face'>
        😳
      </span>{' '}
      <span className={`mx-4`} role='img' aria-label='ticket emoji'>
        🎟️
      </span>
      <div className='pane-title'>
        <PaneTitle>{t('theNextPoolWillBeLaunchedIn')}</PaneTitle>
        <PaneTitle small>
          <div className='mt-4'>
            <NewPrizeCountdown center textSize='text-lg sm:text-3xl lg:text-5xl' pool={pool} />
          </div>
        </PaneTitle>

        <div className='my-6 xs:mt-8 p-4 sm:p-6 sm:w-2/3 mx-auto text-xxs xs:text-xs sm:text-base text-white bg-raspberry border-highlight-7 border-2 rounded-sm'>
          <p className='font-bold mb-2'>{t('thePoolIsCurrentlyFull')}</p>

          <p>{t('noMoreTicketsCanBePurchased')}</p>
        </div>

        <Button onClick={handleClose}>{t('backToHome')}</Button>
      </div>
    </div>
  )
}
