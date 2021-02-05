import React from 'react'
import classnames from 'classnames'

export const FormLockedOverlay = ({
  children,
  title,
  flexColJustifyClass = 'justify-center',
  topMarginClass = 'sm:-mt-4',
  zLayerClass = 'z-20',
}) => {
  if (flexColJustifyClass === 'justify-start') {
    topMarginClass = 'sm:mt-4'
  }

  return (
    <>
      <div
        className={classnames(
          `${flexColJustifyClass} ${zLayerClass}`,
          `flex flex-col items-center absolute text-center p-4 lg:p-10 rounded-lg bg-overlay t-0 l-0 r-0 b-0`
        )}
      >
        <div
          className={`${topMarginClass} bg-primary text-inverse rounded-lg text-center mx-auto px-3 sm:px-6 py-4 sm:py-6 text-base sm:text-lg text-purple-200 w-10/12 sm:w-3/4`}
        >
          <div className='text-sm sm:text-base lg:text-lg uppercase text-lightPurple-600 font-bold mb-2'>
            {title}
          </div>

          {children}
        </div>
      </div>
    </>
  )
}
