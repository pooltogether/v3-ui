import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'

import { Trans, useTranslation } from 'lib/../i18n'
import { PaneTitle } from 'lib/components/PaneTitle'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { WithdrawalTimeRemainingChart } from 'lib/components/WithdrawalTimeRemainingChart'

export function ConfirmWithdrawWithFee(props) {
  const { t } = useTranslation()

  const { pool, exitFees, nextStep } = props

  const timelockDurationSeconds = exitFees.timelockDurationSeconds

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

    <WithdrawalTimeRemainingChart
      pool={pool}
      timelockDurationSeconds={timelockDurationSeconds}
    />

    <ButtonDrawer>
      <Button
        id='_withdrawAnywayBtn'
        onClick={nextStep}
        textSize='lg'
        className={'mx-auto'}
      >
        {t('withdrawAnyway')}
      </Button>
    </ButtonDrawer>

    <a
      href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
      target='_blank'
      rel='noopener noreferrer'
      className='mt-6 underline text-xxs xs:text-xs sm:text-sm mx-auto leading-tight w-full sm:w-1/4'
    >
      {t('readMoreAboutTheFairnessFee')} <FeatherIcon
        icon='external-link'
        className='is-etherscan-arrow inline-block'
      />
    </a>
    
  </>
}
