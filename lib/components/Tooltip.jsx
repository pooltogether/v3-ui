import React, { useRef } from 'react'
import ReactTooltip from 'react-tooltip'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'

export const Tooltip = (props) => {
  const { children, tip, className, svgClassName, id, effect, isEnabled } = props
  const ref = useRef(null)

  if (!isEnabled) {
    return children
  }

  if (!id) {
    console.warn('Component requires an id! <Tooltip /> with children: ', children)
  }

  return (
    <>
      <span
        data-tip
        data-for={`${id}-tooltip`}
        className={classnames('inline cursor-pointer', className)}
      >
        {children || <FeatherIcon icon='info' className={classnames('w-4 h-4', svgClassName)} />}
      </span>
      <ReactTooltip
        clickable
        ref={ref}
        backgroundColor='#111'
        id={`${id}-tooltip`}
        place='top'
        effect={effect}
        data-multiline
        className='max-w-3/4 sm:max-w-sm text-center leading-relaxed font-normal rounded-lg'
        overridePosition={({ left, top }, currentEvent, currentTarget, node) => {
          const d = document.documentElement
          left = Math.min(d.clientWidth - node.clientWidth, left)
          top = Math.min(d.clientHeight - node.clientHeight, top)
          left = Math.max(0, left)
          top = Math.max(0, top)
          return { top, left }
        }}
      >
        <>
          <button
            onClick={() => {
              const current = ref.current
              current.tooltipRef = null
              ReactTooltip.hide()
            }}
            className='ml-auto mb-1 absolute block xs:hidden'
            style={{
              right: 17,
              top: 7
            }}
          >
            <FeatherIcon icon='x' className='w-4 h-4 text-white relative -r-3' />
          </button>
          {tip}
        </>
      </ReactTooltip>
    </>
  )
}

Tooltip.defaultProps = {
  effect: 'solid',
  isEnabled: true
}
