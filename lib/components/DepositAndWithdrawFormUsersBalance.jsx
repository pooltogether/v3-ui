import React from 'react'
import classnames from 'classnames'

import { useTranslation } from 'lib/../i18n'
import { PoolNumber } from 'lib/components/PoolNumber'
// import { PoolCountUp } from 'lib/components/PoolCountUp'

export const DepositAndWithdrawFormUsersBalance = (
  props,
) => {
  const { t } = useTranslation()
  const { label, start, end, units } = props

  let roundedClasses = props.roundedClasses || 'rounded-tl-lg rounded-tr-lg'
  let widthClasses = props.widthClasses || 'w-full'

  return <>
    <div
      className={classnames(
        widthClasses,
        roundedClasses,
        'flex text-inverse items-center justify-between mx-auto bg-default border-b-2 border-accent-4 px-6 py-3',
      )}
    >
      <div>
        {label || t('yourBalance')}
      </div>
      <div className='number'>
        <PoolNumber>
          {end}
        </PoolNumber> {units}
      </div>
    </div>
  </>
}
