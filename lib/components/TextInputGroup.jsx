import React from 'react'
import classnames from 'classnames'

import { Input } from 'lib/components/Input'

export const TextInputGroup = (
  props,
) => {
  const {
    id,
    label,
    required,
    disabled,
    type,
    onBlur,
    pattern,
    placeholder,
    onChange,
    value,
    large,
  } = props

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
        id={id}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        type={type || 'text'}
        pattern={pattern}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        large={large}
      />
    </div>
  </>
}
