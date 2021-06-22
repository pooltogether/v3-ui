import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { Button } from '@pooltogether/react-components'

import { Trans, useTranslation } from 'react-i18next'
import { PaneTitle } from 'lib/components/PaneTitle'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { WithdrawalTimeRemainingChart } from 'lib/components/WithdrawalTimeRemainingChart'

export function ConfirmWithdrawWithFee(props) {
  const { t } = useTranslation()

  const { pool, exitFees, nextStep } = props

  const timelockDurationSeconds = exitFees.timelockDurationSeconds

  return (
    <>
      <div
        className='mx-auto'
        style={{
          maxWidth: 550
        }}
      >
        <PaneTitle>{t('uhOhYoureWithdrawingYourFundsTooSoon')}</PaneTitle>
      </div>

      <PaneTitle small>
        <Trans
          i18nKey='toEnsureFairnessDescription'
          defaults='You are withdrawing <bold>{{amount}} {{ticker}}</bold> and paying a <bold>{{amountTwo}} {{ticker}}</bold> fee'
          components={{
            bold: <span className='font-bold' />
          }}
        />
      </PaneTitle>

      <WithdrawalTimeRemainingChart pool={pool} timelockDurationSeconds={timelockDurationSeconds} />

      <ButtonDrawer>
        <Button onClick={nextStep} textSize='lg' className={'_withdrawBtn _confirmWithFee mx-auto'}>
          {t('withdrawAnyway')}
        </Button>
      </ButtonDrawer>

      <a
        href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
        target='_blank'
        rel='noopener noreferrer'
        className='mt-6 underline text-xxs xs:text-xs sm:text-sm mx-auto leading-tight w-full sm:w-1/4'
      >
        {t('readMoreAboutTheFairnessFee')}{' '}
        <FeatherIcon icon='arrow-up-right' className='is-etherscan-arrow inline-block' />
      </a>
    </>
  )
}
