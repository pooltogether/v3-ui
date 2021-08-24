import React from 'react'
import classnames from 'classnames'

import { Input } from 'lib/components/Input'

export const TextInputGroup = (props) => {
  const {
    id,
    label,
    alignLeft,
    disabled,
    inlineButton,
    unsignedNumber,
    unsignedWholeNumber,
    bottomRightLabel,
    rightLabel
  } = props

  let { type } = props

  let pattern = {}

  if (type === 'email') {
    pattern = {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'invalid email address'
    }
  } else if (unsignedNumber) {
    pattern = {
      value: /^\d*\.?\d*$/,
      message: 'please enter a positive number'
    }
  } else if (unsignedWholeNumber) {
    type = 'number'
    pattern = {
      value: /^\d+$/,
      message: 'please enter a positive number'
    }
  }

  return (
    <>
      <div
        className={classnames('fieldset relative w-full', {
          'mx-0': alignLeft,
          'mx-auto': !alignLeft
        })}
      >
        {(label || rightLabel) && (
          <div className={classnames('flex justify-between items-end')}>
            {label && (
              <label
                htmlFor={id}
                className={classnames('mt-0 mb-1 sm:pr-2 trans', {
                  'pl-6 sm:pl-8 pr-1 w-1/2': rightLabel,
                  'font-bold text-primary cursor-not-allowed': disabled,
                  'font-bold text-accent-3 hover:text-default': !disabled
                })}
              >
                {label}
              </label>
            )}

            {rightLabel && (
              <label
                className={classnames('mt-0 mb-1 pr-6 sm:pr-8 sm:pl-1 trans text-right', {
                  'w-1/2': rightLabel,
                  'font-bold text-primary cursor-not-allowed': disabled,
                  'font-bold text-accent-3 hover:text-default': !disabled
                })}
              >
                {rightLabel}
              </label>
            )}
          </div>
        )}

        <Input {...props} pattern={pattern} type={type || 'text'} />

        {bottomRightLabel && (
          <label
            className={classnames(
              'mt-0 sm:pr-8 sm:pl-2 trans w-full text-right font-bold text-accent-3 hover:text-default'
            )}
          >
            {bottomRightLabel}
          </label>
        )}

        {inlineButton && (
          <div
            className={classnames(
              'absolute flex items-center r-0 t-0 b-0 trans text-right font-bold pr-0'
            )}
          >
            {inlineButton}
          </div>
        )}
      </div>
    </>
  )
}
