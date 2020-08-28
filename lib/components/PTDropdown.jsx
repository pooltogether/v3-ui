import React, { forwardRef, useRef, useState, useImperativeHandle } from 'react'
import classnames from 'classnames'

export const PTDropdown = forwardRef((props, ref) => {
  let {
    children,
    label,
    startOpen,
  } = props

  const wrapperRef = useRef(null)

  const [open, setOpen] = useState(!!startOpen)

  const handleClose = () => {
    setOpen(false)

    document.removeEventListener('keydown', closeOnEscKeycode, false)
    document.removeEventListener('click', handleClickOutside, false)
  }

  const closeOnEscKeycode = (event) => {
    if (event.keyCode === 27) {
      handleClose()
    }
  }

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      handleClose()
    }
  }

  const handleOpen = () => {
    setOpen(true)

    document.addEventListener('keydown', closeOnEscKeycode, false)
    document.addEventListener('click', handleClickOutside, false)
  }

  useImperativeHandle(ref, () => {
    return {
      handleClose
    }
  })

  const handleToggle = (e) => {
    e.preventDefault()

    open ? handleClose() : handleOpen()
  }

  return <>
    <div
      ref={wrapperRef}
    >
      <button
        type='button'
        onClick={handleToggle}
        className={classnames(
          'flex items-center text-xs sm:text-base lg:text-base text-right py-1 px-2 sm:pl-4 sm:pr-3 border-2  rounded-full trans focus:outline-none focus:border-purple-300',
          {
            'hover:bg-purple-1000 hover:border-purple-600 border-purple-900 text-purple-500 hover:text-purple-300': !open,
            'bg-purple-1000 border-purple-600 text-purple-300': open,
          }
        )}
      >
        {label} <svg
          xmlns='http://www.w3.org/2000/svg'
          width='10'
          height='6'
          viewBox='0 0 10 6'
          style={{
            transformOrigin: '4px center 0'
          }}
          className={classnames(
            'ml-2 trans',
            {
              'rotate-180': open
            }
          )}
        >
          <polyline
            fill='#fff'
            stroke='#FFF'
            strokeLinecap='round'
            strokeLinejoin='round'
            points='51 67 54 70 57 67'
            transform='translate(-50 -66)'
            className='stroke-current fill-current'
          />
        </svg>
      </button>
      <div
        className={classnames(
          'mt-1 py-2 w-48 bg-lightPurple-800 rounded-lg shadow-xl absolute text-left',
          {
            'pointer-events-none r-9999': !open,
            'r-0 ': open,
          }
        )}
      >
        {children}
      </div>
    </div>
  </>
})