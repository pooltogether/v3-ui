import React from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import { isBrowser } from 'react-device-detect'

import { DEFAULT_INPUT_CLASSES } from 'lib/constants'

export function Input(props) {
  let {
    autoFocus,
    large,
    small,
    marginClasses,
    paddingClasses,
    borderClasses,
    bgClasses,
    textClasses,
    roundedClasses,
    pattern,
    isError,
    required,
    register,
    validate,
  } = props

  const defaultTextClasses = 'text-xxs xs:text-sm sm:text-xl lg:text-2xl'

  if (roundedClasses === undefined) {
    roundedClasses = 'rounded-full'
  }

  if (marginClasses === undefined) {
    marginClasses = ''
  }

  if (paddingClasses === undefined) {
    if (large) {
      paddingClasses = 'px-12 py-3'
    } else {
      paddingClasses = 'px-8 py-3'
    }
  }

  if (borderClasses === undefined) {
    borderClasses = 'border'
  }

  if (bgClasses === undefined) {
    bgClasses = 'bg-input'
  }

  if (textClasses === undefined) {
    if (large) {
      textClasses = 'text-3xl sm:text-4xl'
    } else if (small) {
      textClasses = 'text-xxs xs:text-xs sm:text-sm lg:text-base'
    } else {
      textClasses = defaultTextClasses
    }
  }

  const className = classnames(
    DEFAULT_INPUT_CLASSES,
    marginClasses,
    paddingClasses,
    borderClasses,
    bgClasses,
    textClasses,
    roundedClasses,
    props.className,
    {
      'text-red': isError,
    }
  )

  const newProps = omit(props, [
    'alignLeft',
    'label',
    'small',
    'large',
    'marginClasses',
    'paddingClasses',
    'borderClasses',
    'bgClasses',
    'inlineButton',
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

  return (
    <>
      <input
        {...newProps}
        autoFocus={autoFocus && isBrowser}
        ref={register({
          required,
          pattern,
          validate,
        })}
        className={classnames(className, 'focus:outline-none')}
      />
    </>
  )
}
