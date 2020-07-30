import React, { useContext, Portal, cloneElement } from 'react'
import Tooltip, { useTooltip, TooltipPopup } from "@reach/tooltip"
// import Tooltip from 'react-tooltip-lite'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'

export const PTHint = (props) => {
  const [trigger, tooltip] = useTooltip()
  // console.log({ trigger })
  // console.log({ tooltip })

  const { isVisible, triggerRect } = tooltip;

  const { children, tip } = props

  const themeContext = useContext(ThemeContext)
  const { theme } = themeContext

  // Center the tooltip, but collisions will win
  // const centered = (triggerRect, tooltipRect) => {
  //   const triggerCenter = triggerRect.left + triggerRect.width / 2;
  //   const left = triggerCenter - tooltipRect.width / 2;
  //   const maxLeft = window.innerWidth - tooltipRect.width - 2;
  //   return {
  //     left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
  //     top: triggerRect.bottom + 8 + window.scrollY,
  //   };
  // };
  
  return <>
    {/* <div
      onMouseEnter={trigger}
    > */}
      {cloneElement(children, trigger)}
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
      label={tip}
      // aria-label={ariaLabel}
      style={{
        background: theme === 'light' ? 'white' : 'white',
        color: theme === 'light' ? 'black' : 'black',
      }}
      // position={centered}
    />
  </>
}
  
  // const [tipOpen, setTipOpen] = true
  // // const [tipOpen, setTipOpen] = false

  // const showTip = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  //   setTipOpen(true)
  // }

  // const hideTip = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  //   setTipOpen(false)
  // }

  // const toggleTip = (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()

  //   setTipOpen(!state.tipOpen)
  // }


  // const {
  //   children,
  //   childrenClassName,
  //   tip,
  //   className
  // } = props

  // let buttonText

  // const cn = className || ''
  // const ccn = childrenClassName || 'cursor-pointer trans'
  // const childrenProvided = children

  // if (childrenProvided) {
  //   buttonText = children
  // } else {
  //   buttonText = <span
  //     className='flex items-center justify-center inline-block bg-white rounded-lg w-10 h-10 text-blue-500 text-center font-bold rounded-full'
  //   >
  //     <span
  //       className='relative text-base font-number'
  //       style={{
  //         left: '0.03rem'
  //       }}
  //     >
  //       ?
  //     </span>
  //   </span>
  // }

//   return <Tooltip
//       label='Fall in love all over again"
//       style={{
//         background: "hsla(0, 0%, 0%, 0.75)",
//         color: "white",
//         border: "none",
//         borderRadius: "4px",
//         padding: "0.5em 1em",
//       }}
//       // className={cn}
//     >
//       {tip}
//     </Tooltip>
// }