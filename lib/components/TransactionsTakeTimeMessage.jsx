import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'

export const TransactionsTakeTimeMessage = (props) => {
  const { t } = useTranslation()

  return <>
    <div className='mx-auto -mb-2'>
      <V3LoadingDots />
    </div>

    <div
      className='leading-tight font-bold text-base sm:text-lg lg:text-xl text-default-soft pb-2'
    >
      {t('transactionsMayTakeAFewMinutes')}
    </div>

    <div
      className='text-inverse'
    >
      <Trans
        i18nKey='estimatedWaitTime'
        defaults='<bold>Estimated wait time:</bold> <lineBreak /> {{waitTime}}'
        values={{ waitTime: 'put actual estimate here!' }}
        components={{
          bold: <span className='font-bold' />,
          lineBreak: <br />
        }}
      />
    </div>
  </>
}
