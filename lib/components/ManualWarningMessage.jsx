import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'

const WARNING_MESSAGE = process.env.NEXT_JS_WARNING_MESSAGE

export const ManualWarningMessage = (props) => {
  const [showPopup, setShowPopup] = useState(Boolean(WARNING_MESSAGE))

  if (!showPopup) return null

  return (
    <div className='fixed z-50 text-inverse p-6 rounded-xl sm:bottom-4 sm:right-4 sm:clear-top text-white border-2 border-orange bg-black flex flex-row max-w-full'>
      <button
        onClick={(e) => {
          e.preventDefault()
          setShowPopup(false)
        }}
        className='absolute r-0 t-0 text-inverse opacity-70 hover:opacity-100 trans outline-none focus:outline-none active:outline-none mt-2 mr-2'
      >
        <FeatherIcon icon='x' className='w-4 h-4' strokeWidth='0.09rem' />
      </button>
      <FeatherIcon icon='alert-triangle' className='my-auto mx-auto w-8 h-8 text-orange' />
      <span className='ml-4 max-w-3/4 sm:max-w-xs'>{WARNING_MESSAGE}</span>
    </div>
  )
}
