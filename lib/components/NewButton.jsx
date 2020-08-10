import React, { useRef, useEffect } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { omit } from 'lodash'
import { motion } from 'framer-motion'

const getTextSizeClasses = (textSizeClasses, isText, size) => {
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

export const NewButton = (props) => {
  let {
    as,
    href,
    children,
    color,
    className,
    disabled,
    selected,
    size,
    wide,
    width,
  } = props

  let defaultClasses = 'relative font-bold inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'
  let backgroundColorClasses = 'bg-primary'
  let textColorClasses = 'text-match'
  let borderClasses = `border-4 border-inverse`
  let paddingClasses = 'px-1 py-2 sm:py-2'
  let roundedClasses = 'rounded-md'
  let transitionClasses = 'trans trans-fast'
  let textSizeClasses = getTextSizeClasses(size)
  let widthClasses = ''

  if (width === 'full') {
    widthClasses = 'w-full'
  }

  if (color === 'primary') {
    backgroundColorClasses = 'bg-primary'
    textColorClasses = 'text-secondary'
  }

  if (color === 'purple') {
    backgroundColorClasses = 'bg-purple'
    textColorClasses = 'text-secondary'
    borderClasses = `border-purple`
  }

  if (wide) {
    paddingClasses = 'px-2 sm:px-8 lg:px-12 py-2 sm:py-2'
  }

  let newClassNames = classnames(
    className,
    defaultClasses,
    backgroundColorClasses,
    borderClasses,
    paddingClasses,
    roundedClasses,
    textColorClasses,
    textSizeClasses,
    transitionClasses,
    widthClasses
  )

  let newProps = omit(props, [
    'backgroundColorClasses',
    'borderClasses',
    'paddingClasses',
    'roundedClasses',
    'size',
    'textColorClasses',
    'textSizeClasses',
    'transitionClasses',
    'widthClasses',
    'wide',
  ])

  newProps = {
    ...newProps,
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

  if (href && as) {
    const linkProps = omit(newProps, [
      'children',
      // 'type',
    ])

    return <Link
      href={href}
      as={as}
      scroll={false}
    >
      <motion.a
        {...linkProps}
        className={newClassNames}
      >
        {children}
      </motion.a>
    </Link>
  } else {
    return <motion.button
      {...newProps}
      className={newClassNames}
    />
  }

}
