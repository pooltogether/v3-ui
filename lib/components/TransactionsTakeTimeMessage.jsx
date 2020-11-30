import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { PaneTitle } from 'lib/components/PaneTitle'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export function TransactionsTakeTimeMessage(props) {
  const { t } = useTranslation()

  const { title, subtitle, paneMessage } = props

  return <>
    {(title || subtitle) && <>
      <div className='-mt-8 mb-6'>
        <PaneTitle short>
          {title}
        </PaneTitle>

        <PaneTitle short>
          {subtitle}
        </PaneTitle>

        <div className='mx-auto'>
          <V3LoadingDots />
        </div>
      </div>
    </>}
    
    
    {paneMessage && <>
      <div className='mx-auto'>
        <V3LoadingDots />
      </div>

      <div className='-mt-8 mb-6'>
        <PaneTitle small>
          {paneMessage}
        </PaneTitle>
      </div>

      <div
        className='leading-tight font-bold text-xs xs:text-base sm:text-lg text-default pb-1'
      >
        {t('transactionsMayTakeAFewMinutes')}
      </div>
    </>}

  </>
}
