import React from 'react'
import CountUp from 'react-countup'

export const PoolCountUp = (props) => {
  // TODO: We need to use a clever formatter (maybe one from v2)
  // that only shows the # of decimals necessary
  const decimalsToUse = (
    !!props.decimals &&
    props.decimals >= 0
  ) ? props.decimals : 2
  
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
