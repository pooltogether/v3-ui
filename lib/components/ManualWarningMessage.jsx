import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'

const WARNING_MESSAGE = process.env.NEXT_JS_WARNING_MESSAGE

export const ManualWarningMessage = (props) => {
  const [showPopup, setShowPopup] = useState(Boolean(WARNING_MESSAGE))

  if (!showPopup) return null

  return (
    <div className='fixed flex flex-row z-50 rounded-xl shadow-4xl p-6 bottom-20 right-4 left-4 sm:bottom-8 sm:right-8 sm:left-auto sm:clear-top text-white border-2 border-orange bg-black'>
      <button
        onClick={(e) => {
          e.preventDefault()
          setShowPopup(false)
        }}
        className='absolute r-0 t-0 text-white opacity-50 hover:opacity-100 trans outline-none focus:outline-none active:outline-none mt-2 mr-2'
      >
        <FeatherIcon icon='x' className='w-6 h-6' strokeWidth='0.16rem' />
      </button>

      <div className='flex items-center'>
        <FeatherIcon icon='alert-triangle' className='my-auto mx-auto w-6 h-6 text-orange' />
        <span className='ml-4 sm:max-w-xs text-sm sm:pl-6 sm:pr-10'>{WARNING_MESSAGE}</span>
      </div>
    </div>
  )
}
