import React from 'react'

export const QuestionMarkCircle = () => {
  return <>
    <span
      className='relative font-bold font-number inline-flex items-center justify-center bg-blue rounded-full w-5 h-5 sm:w-6 sm:h-6 text-white text-center mx-1'
      style={{
        top: -1,
      }}
    >
      <span
        className='relative text-sm'
        style={{
          top: 1,
        }}
      >
        ?
      </span>
    </span>
    {/* <FeatherIcon
      icon='help-circle'
      className='relative w-6 h-6 text-red'
      style={{
        top: 4,
      }}
    /> */}
  </>
}
