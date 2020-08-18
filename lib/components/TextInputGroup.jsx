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
      <label
        htmlFor={id}
        className={classnames(
          'mt-0 pb-1 pl-4 trans',
          {
            'font-bold text-primary cursor-not-allowed': disabled,
            'font-bold text-default-soft hover:text-default': !disabled,
          }
        )}
      >
        {label}
      </label>
      <Input
        {...props}
        pattern={pattern}
        type={type || 'text'}
      />
    </div>
  </>
}
