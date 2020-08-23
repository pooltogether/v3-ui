import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import CountUp from 'react-countup'
import { usePreviousValue } from 'beautiful-react-hooks'; 

export const PoolCountUp = (props) => {
  const { bold, fontSansRegular } = props

  const [value, setValue] = useState(0)
  const prev = usePreviousValue(value)
  useEffect(() => {
    setValue(props.end)
  }, [props.end])

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
