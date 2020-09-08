import React from 'react'
import classnames from 'classnames'

import { Input } from 'lib/components/Input'

export const TextInputGroup = (
  props,
) => {
  const {
    id,
    label,
    disabled,
    type,
    unsignedNumber,
    unsignedWholeNumber,
    centerLabel,
    rightLabel,
  } = props

  let pattern = {}

  if (type === 'email') {
    pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "invalid email address"
    }
  } else if (unsignedNumber) {
    pattern = {
      value: /^\d*\.?\d*$/,
      message: 'please enter a positive number'
    }
  } else if (unsignedWholeNumber) {
    pattern = { 
      value: /^\d+$/,
      message: 'please enter a positive number'
    }
  }

  return <>
    <div
      className='input-fieldset py-2 mb-0'
    >
      <div
        className={classnames(
          'flex',
          {
            'justify-between': rightLabel,
            'justify-center': !rightLabel,
          }
        )}>
        <label
          htmlFor={id}
          className={classnames(
            'mt-0 pb-1 sm:pr-2 trans',
            {
              'sm:pl-8 w-1/2': rightLabel && !centerLabel,
              'sm:pl-8 w-1/3': rightLabel && centerLabel,
              'font-bold text-primary cursor-not-allowed': disabled,
              'font-bold text-default-soft hover:text-default': !disabled,
            }
          )}
        >
          {label}
        </label>

        {centerLabel && <>
          <label
            className={classnames(
              'mt-0 pb-1 trans w-1/3 text-center',
              {
                'font-bold text-primary cursor-not-allowed': disabled,
                'font-bold text-default-soft hover:text-default': !disabled,
              }
            )}
          >
            {centerLabel}
          </label>
        </>}

        {rightLabel && <>
          <label
            className={classnames(
              'mt-0 pb-1 sm:pr-8 sm:pl-2 trans text-right',
              {
                'w-1/2': rightLabel && !centerLabel,
                'w-1/3': rightLabel && centerLabel,
                'font-bold text-primary cursor-not-allowed': disabled,
                'font-bold text-default-soft hover:text-default': !disabled,
              }
            )}
          >
            {rightLabel}
          </label>
        </>}
      </div>

      <Input
        {...props}
        pattern={pattern}
        type={type || 'text'}
      />
    </div>
  </>
}
