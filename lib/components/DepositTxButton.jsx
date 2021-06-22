import React from 'react'
import { Button, Tooltip } from '@pooltogether/react-components'

import { useTranslation } from 'react-i18next'

export function DepositTxButton(props) {
  const { t } = useTranslation()
  const { poolIsLocked, disabled, nextStep } = props

  const handleDepositClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  const buttonClassName = poolIsLocked ? 'w-full' : 'w-48-percent'

  return (
    <Tooltip
      isEnabled={poolIsLocked}
      isButton={poolIsLocked}
      title={t('poolIsLocked')}
      id={`deposit-tx-pool-is-locked-tooltip`}
      tip={
        <>
          <div>{t('poolCurrentlyBeingAwarded')}</div>
          <div>{t('youWontNeedToRefreshThePage')}</div>
        </>
      }
      className='w-48-percent'
    >
      <Button
        id='_depositToken'
        noAnim={disabled}
        textSize='lg'
        onClick={handleDepositClick}
        disabled={disabled}
        className={buttonClassName}
      >
        {t('deposit')}
      </Button>
    </Tooltip>
  )
}
