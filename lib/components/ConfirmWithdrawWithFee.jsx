import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { Trans, useTranslation } from 'lib/../i18n'
import { PaneTitle } from 'lib/components/PaneTitle'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'

export function ConfirmWithdrawWithFee(props) {
  const { t } = useTranslation()

  const { nextStep, pool } = props

  return <>
    <div
      className='mx-auto'
      style={{ 
        maxWidth: 500
      }}
    >
      <PaneTitle>
        {t('uhOhYoureWithdrawingYourFundsTooSoon')}
      </PaneTitle>
    </div>

    <PaneTitle small>
      <Trans
        i18nKey='toEnsureFairnessDescription'
        defaults='You are withdrawing <bold>{{amount}} {{ticker}}</bold> and paying a <bold>{{amountTwo}} {{ticker}}</bold> fee'
        components={{
          bold: <span className='font-bold' />,
        }}
      />
    </PaneTitle>

        <div className='text-flashy mt-4 text-lg'>
      CHART
    </div>

    <ButtonDrawer>
      <Button
        onClick={nextStep}
        textSize='lg'
        className={'mx-auto sm:mt-16'}
      >
        {t('withdrawAnyway')}
      </Button>
    </ButtonDrawer>

    <a
      href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
      target='_blank'
      rel='noopener noreferrer'
      className='mt-6 underline text-xxs xs:text-xs sm:text-sm'
    >
      {t('readMoreAboutTheFairnessFee')} <FeatherIcon
        icon='external-link'
        className='is-etherscan-arrow inline-block'
      />
    </a>
    
  </>
}
