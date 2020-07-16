import React from 'react'
import CountUp from 'react-countup'

export const PoolCountUp = (props) => {
  const { decimals } = props

  // We prob need to use the clever formatter from v2 that only shows decimals when necessary
  const decimalsToUse = typeof decimals === 'object' ? props.decimals : 2
  
  return <>
    <span
      className='font-number font-bold'
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
