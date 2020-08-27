import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'
import { usePreviousValue } from 'beautiful-react-hooks'; 

export const PoolCountUp = (props) => {
  const { bold, fontSansRegular } = props


  // The CountUp library only works with floats and ints, not strings
  if (
    isNaN(props.start) ||
    isNaN(props.end) ||
    typeof props.start === 'string' ||
    typeof props.end === 'string'
  ) {
    return props.end
  }



  let [value, setValue] = useState(0)
  let prev = usePreviousValue(value)
  useEffect(() => {
    setValue(props.end)
  }, [props.end])

  let fontBold = bold === undefined ? true : false

  let decimalsToUse = Number(props.decimals)
  if (isNaN(decimalsToUse)) {
    decimalsToUse = 2
  }

  // TODO: Replace this! What we need is a clever formatter (maybe the one from v2)
  // that only shows the # of decimals necessary
  if (decimalsToUse === 0) {
    prev = parseInt(prev, 10)
    value = parseInt(value, 10)
  }

  return <>
    <span
      className={classnames(
        {
          'font-sans-regular': fontSansRegular,
          'font-number': !fontSansRegular,
          'font-bold': fontBold,
        }
      )}
    >
      <CountUp
        start={prev || 0}
        end={value}
        duration={1.8}
        separator={','}
        decimals={decimalsToUse}
      />
    </span>
  </>
}
