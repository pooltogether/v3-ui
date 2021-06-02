import React from 'react'

import { useTranslation } from 'react-i18next'
import { Button } from 'lib/components/Button'
import { Tooltip } from 'lib/components/Tooltip'

export function DepositTxButton(props) {
  const { t } = useTranslation()
  const { poolIsLocked, disabled, nextStep } = props

  const handleDepositClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  const buttonClassName = poolIsLocked ? 'w-full' : 'w-48-percent'

  const button = (
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
  )

  return (
    <>
      {poolIsLocked ? (
        <Tooltip
          isButton={poolIsLocked}
          title={t('poolIsLocked')}
          tip={
            <>
              <div>{t('poolCurrentlyBeingAwarded')}</div>
              <div>{t('youWontNeedToRefreshThePage')}</div>
            </>
          }
          className='w-48-percent'
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </>
  )
}
