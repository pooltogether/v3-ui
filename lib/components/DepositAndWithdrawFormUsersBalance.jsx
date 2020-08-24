import React from 'react'
import classnames from 'classnames'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const DepositAndWithdrawFormUsersBalance = (
  props,
) => {
  const { label, start, end, units } = props

  let roundedClasses = props.roundedClasses || 'rounded-tl-lg rounded-tr-lg'
  let widthClasses = props.widthClasses || 'w-full xs:w-10/12 sm:w-10/12'

  return <>
    <div
      className={classnames(
        widthClasses,
        roundedClasses,
        'flex text-inverse items-center justify-between mx-auto bg-default border-b-2 border-accent-4 px-6 py-3',
      )}
    >
      <div>
        {label || 'Your balance:'}
      </div>
      <div>
        <PoolCountUp
          {...props}
          start={start}
          end={end}
          decimals={2}
        /> {units}
      </div>
    </div>
  </>
}
