import React from 'react'
import CountUp from 'react-countup'

export const PoolCountUp = (props) => {
  return <>
    <span
      className='font-number font-bold'
    >
      <CountUp
        start={props.start || 0}
        end={props.end}
        duration={1.8}
        separator={','}
        decimals={props.decimals || 2}
      />
    </span>
  </>
}
