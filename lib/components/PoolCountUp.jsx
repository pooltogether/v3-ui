import React from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'

export const PoolCountUp = (props) => {
  const { bold } = props
  
  let fontBold = bold === undefined ? true : false

  let decimalsToUse = Number(props.decimals)
  if (isNaN(decimalsToUse)) {
    decimalsToUse = 2
  }
  
  // TODO: We need to use a clever formatter (maybe one from v2)
  // that only shows the # of decimals necessary
  return <>
    <span
      className={classnames(
        'font-number', {
          'font-bold': fontBold
        }
      )}
    >
      <CountUp
        start={props.start || 0}
        end={props.end}
        duration={1.8}
        separator={','}
        decimals={decimalsToUse}
      />
    </span>
  </>
}
