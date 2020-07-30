import React, { useState, cloneElement } from 'react'
import { useTooltip, TooltipPopup } from '@reach/tooltip'

import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'

export const PTHint = (props) => {
  const [trigger, tooltip] = useTooltip()

  const { children, tip } = props

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

  return <>
    <button
      {...trigger}
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={toggleVisible}
      className='cursor-pointer'
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
