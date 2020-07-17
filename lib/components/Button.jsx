import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { omit } from 'lodash'
import { motion } from 'framer-motion'

// const getPaddingClasses = (paddingClasses, isText) => {
//   if (paddingClasses) {
//     return paddingClasses
//   }

//   if (isText) {
//     return 'px-1 py-1'
//   }

//   return 'px-1 py-2 sm:py-3 lg:py-4'
// }

const getTextSizeClasses = (textSizeClasses, isText, size) => {
  if (textSizeClasses) {
    return textSizeClasses
  }

  if (isText) {
    `text-sm sm:text-base lg:text-2xl`
  }

  if (!size) {
    size = 'base'
  }

  switch (size) {
    case 'xs':
      return `text-xs sm:text-sm lg:text-base`
    case 'sm':
      return `text-sm sm:text-base lg:text-lg`
    case 'lg':
      return `text-lg sm:text-xl lg:text-2xl`
    case 'xl':
      return `text-xl sm:text-2xl lg:text-3xl`
    case '2xl':
      return `text-2xl sm:text-3xl lg:text-4xl`
    default:
      return `text-xs sm:text-sm lg:text-base`
  }
}

const getTransitionClasses = (transitionClasses) => {
  return transitionClasses || 'trans trans-fast'
}

const getRoundedClasses = (roundedClasses) => {
  return roundedClasses || 'rounded-xl'
}

export const Button = (props) => {
  // create a ref to store the textInput DOM element
  const buttonRef = useRef()

  useEffect(() => {
    const el = buttonRef.current

    el.addEventListener('click', e => {
      const previousCssText = el.style.cssText

      e = e.touches ? e.touches[0] : e

      const r = el.getBoundingClientRect(),
        d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2

      el.style.cssText = `--s: 0; --o: 1;`

      // I believe this allow the CPU to tick w/ the new cssText set above
      // before setting it to the new values
      el.offsetTop

      el.style.cssText = `${previousCssText} --t: 1; --o: 0; --d: ${d}; --x:${e.clientX - r.left}; --y:${e.clientY - r.top};`
    }, [buttonRef])
  })
  
  let {
    as,
    backgroundColorClasses,
    borderClasses,
    children,
    color,
    className,
    disabled,
    href,
    inversed,
    noAnim,
    isBold,
    isText,
    isLowOpacity,
    outline,
    paddingClasses,
    roundedClasses,
    size,
    textColorClasses,
    textSizeClasses,
    transitionClasses,
    wide,
  } = props

  let defaultClasses = 'pt-button inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'

  if (isBold !== false) {
    defaultClasses += ' font-bold'
  }

  if (isLowOpacity) {
    defaultClasses += ' opacity-50 hover:opacity-100'
  }

  if (isText) {
    // colorClass = `text-${color}-300`
    // defaultClasses += ' mx-auto min-width-auto'
    defaultClasses += ' min-width-auto'
  }

  backgroundColorClasses = 'bg-inverse'
  if (!disabled) {
    if (inversed) {
      backgroundColorClasses = 'bg-transparent hover:bg-inverse'
    } else {
      backgroundColorClasses = 'bg-inverse hover:bg-green'
    }
  }

  borderClasses = `border-4 border-inverse`
  if (!disabled) {
    if (inversed) {
      borderClasses = `border-4 border-inverse hover:border-default`
    } else {
      borderClasses = `border-4 border-inverse hover:border-green`
    }
  }
  
  // paddingClasses = getPaddingClasses(paddingClasses, isText)
  if (wide) {
    paddingClasses = 'px-12 py-2 sm:py-2'
  } else {
    paddingClasses = 'px-1 py-2 sm:py-2'
  }

  roundedClasses = getRoundedClasses(roundedClasses)

  if (inversed) {
    textColorClasses = 'text-inverse hover:text-match'
  } else {
    textColorClasses = 'text-match'
  }
  textSizeClasses = getTextSizeClasses(textSizeClasses, isText, size)
  transitionClasses = getTransitionClasses(transitionClasses)

  className = classnames(
    backgroundColorClasses,
    className,
    borderClasses,
    defaultClasses,
    paddingClasses,
    roundedClasses,
    size,
    textColorClasses,
    textSizeClasses,
    transitionClasses,
  )

  if (outline) {
    className = 'rounded-xl text-secondary border-2 border-secondary hover:text-inverse hover:bg-primary text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
    // className = 'rounded-full text-secondary border-4 border-secondary hover:text-inverse hover:bg-primary text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
  }

  let newProps = omit(props, [
    'inversed',
    'backgroundColorClasses',
    'borderClasses',
    'noAnim',
    'isBold',
    'isLowOpacity',
    'isText',
    'paddingClasses',
    'roundedClasses',
    'size',
    'textColorClasses',
    'textSizeClasses',
    'transitionClasses',
    'wide',
  ])

  if (!disabled) {
    newProps = {
      ...newProps,
      animate: 'enter',
      variants: {
        enter: {
          y: 0,
          transition: {
            duration: 0.1
          }
        },
      },
      whileHover: {
        scale: 1.03,
        y: -3,
        transition: {
          duration: 0.1
        }
      },
      whileTap: {
        scale: 0.97,
        y: 2,
        transition: {
          duration: 0.1
        }
      }
    }
  }

  if (href && as) {
    const linkProps = omit(newProps, [
      'children',
      'type',
    ])

    return <Link
      href={href}
      as={as}
      scroll={false}
    >
      <motion.a
        {...linkProps}
        ref={buttonRef}
        anim={disabled || noAnim ? '' : 'ripple'}
        className={className}
      >
        {children}
      </motion.a>
    </Link>
  } else {
    return <motion.button
      {...newProps}
      ref={buttonRef}
      anim={disabled || noAnim ? '' : 'ripple'}
      className={className}
    />
  }

}
