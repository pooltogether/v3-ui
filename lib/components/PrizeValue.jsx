import React from 'react'
import classnames from 'classnames'

import { PoolCountUp } from 'lib/components/PoolCountUp'

export const PrizeValue = (props) => {
  const { totalValueUsd, className, textClassName } = props

  if (!totalValueUsd) {
    return <div className={classnames(className, textClassName)}>$0</div>
  }

  return (
    <div className={classnames(className, textClassName)}>
      $
      <PoolCountUp fontSansRegular decimals={0} duration={6}>
        {parseFloat(totalValueUsd)}
      </PoolCountUp>
    </div>
  )
}

PrizeValue.defaultProps = {
  textClassName: 'text-8xl sm:text-7xl lg:text-8xl text-flashy font-bold'
}
