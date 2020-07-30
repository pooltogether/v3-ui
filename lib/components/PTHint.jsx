import React, { cloneElement } from 'react'
import { useTooltip, TooltipPopup } from '@reach/tooltip'

export const PTHint = (props) => {
  const [trigger, tooltip] = useTooltip()

  // const { triggerRect } = tooltip
  const { isVisible, triggerRect } = tooltip

  const { children, tip } = props

  // Center the tooltip, but collisions will win
  // const centered = (triggerRect, tooltipRect) => {
  //   console.log({ triggerRect })
  //   if (!triggerRect) {
  //     return {
  //       left: -100000,
  //       top: -100000
  //     }
  //   }

  //   const triggerCenter = triggerRect.left + triggerRect.width / triggerRect
  //   const left = triggerCenter - tooltipRect.width / 2
  //   const maxLeft = window.innerWidth - tooltipRect.width - 2
  //   return {
  //     left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
  //     top: triggerRect.bottom + 8 + window.scrollY,
  //   }
  // }

  
  return <>
    {cloneElement(children, trigger)}
    {/* <div
      onMouseEnter={trigger.onMouseEnter}
      className='cursor-pointer'
    > */}
    {/* </div> */}

    {/* {isVisible && (
      // The Triangle. We position it relative to the trigger, not the popup
      // so that collisions don't have a triangle pointing off to nowhere.
      // Using a Portal may seem a little extreme, but we can keep the
      // positioning logic simpler here instead of needing to consider
      // the popup's position relative to the trigger and collisions
      <Portal>
        <div
          style={{
            position: "absolute",
            left:
              triggerRect && triggerRect.left - 10 + triggerRect.width / 2,
            top: triggerRect && triggerRect.bottom + window.scrollY,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: "10px solid black",
          }}
        />
      </Portal>
    )} */}

    <TooltipPopup
      {...tooltip}
      isVisible={isVisible}
      label={tip}
      // position={centered}
    />
  </>
}
