import React, { useState, cloneElement } from 'react'
import classnames from 'classnames'
import { useTooltip, TooltipPopup } from '@reach/tooltip'

import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'

export const PTHint = (props) => {
  const { children, className, title } = props
  let { tip } = props

  const [trigger, tooltip] = useTooltip()

  const [isVisible, setIsVisible] = useState(false)

  const show = (e) => {
    setIsVisible(true)
    trigger.onMouseLeave(e)
  }

  const hide = (e) => {
    setIsVisible(false)
    trigger.onMouseLeave(e)
  }

  const toggleVisible = (e) => {
    // TODO: improve on this since you should be able to hover over any
    // part of the tooltip and have it stay on screen
    // setTimeout(() => {
    setIsVisible(!isVisible)
    trigger.onMouseLeave(e)
    // }, 2000)
  }

  if (title) {
    tip = <>
      <h5 className='bg-inverse text-accent-1'>
        {title}
      </h5>

      {tip}
    </>
  }

  return <>
    <button
      {...trigger}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={toggleVisible}
      className={classnames(
        className,
        'cursor-pointer'
      )}
      style={{
        pointerEvents: 'all'
      }}
    >
      {children ? children : <QuestionMarkCircle />}
    </button>

  
    <TooltipPopup
      {...tooltip}
      isVisible={isVisible}
      label={tip}
    />
  </>
}
