import React from 'react'
import classnames from 'classnames'

export const CheckboxInputGroup = (
  props,
) => {
  const {
    id,
    disabled,
    label,
    handleClick,
    checked,
  } = props

  const defaultClasses = 'flex justify-start items-center trans trans-faster cursor-pointer font-bold outline-none focus:outline-none hover:outline-none active:outline-none leading-none px-0 py-1'
  const roundedClasses = 'rounded-xl'
  const marginClasses = 'mt-1 mb-1 sm:mb-3 lg:mb-4'
  const textClasses = 'text-sm sm:text-base lg:text-xl'

  return <>
    <div
      className={classnames(
        defaultClasses,
        textClasses,
        marginClasses,
        roundedClasses,
        {
          'text-secondary inner-lg': checked,
          'text-default-soft hover:text-primary': !checked,
        }
      )}
      onClick={handleClick}
    >
      <div
        className={classnames(
          'flex items-center justify-center mr-3 text-3xl leading-none'
        )}
      >
        <div
          className={classnames(
            'flex items-center rounded-lg w-6 h-6 lg:w-8 lg:h-8 border-2 trans',
            {
              'text-white bg-white border-secondary hover:border-secondary': checked,
              'text-darkened bg-white border-secondary hover:border-primary': !checked,
            }
          )}
        >
          <svg
            className={classnames(
              'relative check',
              {
                'checked': checked
              }
            )}
            width='135'
            height='110'
            viewBox='0 0 135 110'
          >
            <path d='M96.8002 0L30.7002 66.1L0.200195 37.4' />
          </svg>
        </div>
      </div>

      <div
        className='font-normal text-left text-xs sm:text-base lg:text-lg flex flex-col items-start justify-start leading-snug'
      >
        {label}
      </div>

    </div>
  </>
}
