import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'

export const DepositTxButton = (props) => {
  const { t } = useTranslation()
  const { poolIsLocked, disabled, nextStep } = props

  const handleDepositClick = (e) => {
    e.preventDefault()
    nextStep()
  }

  const buttonClassName = poolIsLocked ? 'w-full' : 'w-48-percent'

  const button = <>
    <Button
      noAnim={disabled}
      textSize='lg'
      onClick={handleDepositClick}
      disabled={disabled}
      className={buttonClassName}
    >
      {t('deposit')}
    </Button>
  </>

  return <>
    {poolIsLocked ? <>
      <PTHint
        isButton={poolIsLocked}
        title={t('poolIsLocked')}
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            {t('poolCurrentlyBeingAwarded')}
          </div>
          <div
            className='text-xs sm:text-sm'
          >
            {t('youWontNeedToRefreshThePage')}
          </div>
        </>}
        className='w-48-percent'
      >
        {button}
      </PTHint>
    </> : button}
  </>
}
