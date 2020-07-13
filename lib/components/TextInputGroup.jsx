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
    unsignedWholeNumber,
  } = props

  let pattern = {}

  if (type === 'email') {
    pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "invalid email address"
    }
  }

  if (unsignedWholeNumber) {
    pattern = { 
      value: /^\d+$/,
      message: 'please enter a number'
    }
  }

  return <>
    <div
      className='input-fieldset py-2 mb-0'
    >
      <label
        htmlFor={id}
        className={classnames(
          'mt-0 pb-1 trans',
          {
            'text-primary cursor-not-allowed': disabled,
            'text-primary hover:text-inverse': !disabled,
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
