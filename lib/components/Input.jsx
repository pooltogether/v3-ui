import React from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import { isBrowser } from 'react-device-detect'

import { DEFAULT_INPUT_CLASSES } from 'lib/constants'

export function Input(props) {
  let {
    autoFocus,
    // placeholder,
    // handleChange,
    // value,
    marginClasses,
    large,
    textClasses,
    roundedClasses,
    pattern,
    isError,
    required,
    register,
    validate,
  } = props

  if (roundedClasses === undefined) {
    roundedClasses = 'rounded-full'
  }

  if (marginClasses === undefined) {
    marginClasses = 'mb-2 lg:mb-2'
  }

  if (textClasses === undefined) {
    textClasses = large ? 'font-bold text-3xl sm:text-5xl' : 'text-xxs xs:text-sm sm:text-xl lg:text-2xl'
  }

  const className = classnames(
    DEFAULT_INPUT_CLASSES,
    marginClasses,
    textClasses,
    roundedClasses,
    props.className, 
    {
      'text-red': isError,
    }
  )

  const newProps = omit(props, [
    'label',
    'large',
    'marginClasses',
    'roundedClasses',
    'textClasses',
    'isError',
    'isLight',
    'register',
    'required', // required is consumed by the register func but we don't want it on the <input />
    'pattern',
    'validate',
    'unsignedNumber',
    'unsignedWholeNumber',
    'centerLabel',
    'rightLabel',
    'bottomRightLabel',
  ])

  return <>
    <input
      {...newProps}
      autoFocus={autoFocus && isBrowser}
      ref={register({
        required,
        pattern,
        validate
      })}

      // rounded-full
      className={classnames(
        className,
        'focus:outline-none pl-6',
      )}
    />

  </>
}