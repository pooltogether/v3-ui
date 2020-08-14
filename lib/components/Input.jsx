import React from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import { isBrowser } from 'react-device-detect'

export function Input(props) {
  let {
    // autoFocus,
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

  const defaultClasses = 'text-white bg-purple trans rounded-lg focus:outline-none focus:outline-none leading-none px-6 py-2 lg:py-2'
  // const defaultClasses = 'text-white border-2 border-primary bg-purple trans rounded-lg focus:outline-none focus:outline-none leading-none px-6 py-2 lg:py-2'

  if (roundedClasses === undefined) {
    roundedClasses = 'rounded'
  }

  if (marginClasses === undefined) {
    marginClasses = 'mb-2 lg:mb-2'
  }

  if (textClasses === undefined) {
    textClasses = large ? 'font-bold text-3xl sm:text-5xl' : 'text-xl sm:text-2xl'
  }

  const className = classnames(
    defaultClasses,
    marginClasses,
    textClasses,
    roundedClasses,
    props.className, 
    {
      'text-red': isError,
      'font-number': props.type === 'number'
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
  ])

  return <>
    <input
      {...newProps}
      ref={register({
        required,
        pattern,
        validate
      })}

      className={classnames(
        className,
        'bg-primary text-inverse w-full sm:w-10/12 rounded-full focus:outline-none leading-none pl-6',
      )}
    />

  </>
}