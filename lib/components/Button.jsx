import React from 'react'

import { getButtonClasses } from 'lib/components/ButtonLink'

export const Button = (props) => {
  // let defaultClasses = 'pt-button inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'

  // if (isBold !== false) {
  //   defaultClasses += ' font-bold'
  // }

  // if (isLowOpacity) {
  //   defaultClasses += ' opacity-50 hover:opacity-100'
  // }

  // if (isText) {
  //   // colorClass = `text-${color}-300`
  //   // defaultClasses += ' mx-auto min-width-auto'
  //   defaultClasses += ' min-width-auto'
  // }

  // backgroundColorClasses = 'bg-inverse'
  // if (!disabled) {
  //   if (inversed) {
  //     backgroundColorClasses = 'bg-transparent hover:bg-inverse'
  //   } else {
  //     backgroundColorClasses = 'bg-inverse hover:bg-green'
  //   }
  // }

  // borderClasses = `border-2 border-inverse`
  // if (!disabled) {
  //   if (inversed) {
  //     borderClasses = `border-2 border-inverse hover:border-default`
  //   } else if (blue) {
  //     borderClasses = `border-2 border-blue hover:border-blue`
  //   } else {
  //     borderClasses = `border-2 border-inverse hover:border-green`
  //   }
  // }
  
  // // paddingClasses = getPaddingClasses(paddingClasses, isText)
  // if (wide) {
  //   paddingClasses = 'px-2 sm:px-8 lg:px-12 py-2 sm:py-2'
  // } else {
  //   paddingClasses = 'px-1 py-2 sm:py-2'
  // }

  // roundedClasses = getRoundedClasses(roundedClasses)

  // if (inversed) {
  //   textColorClasses = 'text-inverse hover:text-match'
  // } else {
  //   textColorClasses = 'text-match'
  // }
  // textSizeClasses = getTextSizeClasses(textSizeClasses, isText, size)
  // transitionClasses = getTransitionClasses(transitionClasses)

  // let newClassNames = classnames(
  //   backgroundColorClasses,
  //   className,
  //   borderClasses,
  //   defaultClasses,
  //   paddingClasses,
  //   roundedClasses,
  //   size,
  //   textColorClasses,
  //   textSizeClasses,
  //   transitionClasses,
  // )

  // if (outline) {
  //   newClassNames = `${className} font-bold bg-body rounded-xl text-highlight-2 hover:text-highlight-1 border-2 border-highlight-2 hover:border-highlight-1 text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none`

  //   if (selected) {
  //     newClassNames = `opacity-40 ` + newClassNames
  //   }
  // }

  // let newProps = omit(props, [
  //   'inversed',
  //   'backgroundColorClasses',
  //   'borderClasses',
  //   'noAnim',
  //   'isBold',
  //   'isLowOpacity',
  //   'isText',
  //   'paddingClasses',
  //   'roundedClasses',
  //   'size',
  //   'textColorClasses',
  //   'textSizeClasses',
  //   'transitionClasses',
  //   'wide',
  //   'blue',
  // ])

  const classes = getButtonClasses(props)

  return <button
    {...props}
    className={classes}
  />

}
