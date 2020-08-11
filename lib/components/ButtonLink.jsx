import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Link from 'next/link'
import { omit } from 'lodash'
import { motion } from 'framer-motion'

const getTextSize = (size) => {
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

export const ButtonLink = (props) => {
  let {
    asFormButton,
    children,
    as,
    href,
    border,
    bg,
    text,
    padding,
    rounded,
    transition,
    className,
    disabled,
    selected,
    size,
    wide,
    width,
  } = props

  let defaultClasses = 'border-4 relative font-bold inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'

  // eg. textSize='sm', textSize='2xl'
  const textSize = padding ? `${padding}` : getTextSize(size)

  // text = 'text-match'
  padding = padding ? `${padding}` : 'px-1 py-2 sm:py-2'
  rounded = rounded ? `rounded-${rounded}` : 'rounded-md'
  transition = transition ? `${transition}` : 'trans trans-fast'
  width = width ? `${width}` : ''

  border = border ? `border-${border}` : `border-inverse`
  bg = bg ? `bg-${bg}` : 'bg-primary'
  text = text ? `text-${text}` : 'text-secondary'

  // if (color === 'primary') {
  //   background = 'bg-primary'
  //   text = 'text-secondary'
  // }

  // if (color === 'purple') {
  //   background = 'bg-purple'
  //   text = 'text-secondary'
  //   borderClasses = ` border-highlight`
  // }

  // if (wide) {
  //   paddingClasses = 'px-2 sm:px-8 lg:px-12 py-2 sm:py-2'
  // }

  let newClassNames = classnames(
    className,
    defaultClasses,
    bg,
    border,
    padding,
    rounded,
    text,
    textSize,
    transition,
    width
  )

  let newProps = omit(props, [
    'bg',
    'border',
    'padding',
    'rounded',
    'size',
    'text',
    'textSize',
    'transition',
    'width',
    'wide',
  ])

  const animationProps = {
    whileHover: {
      scale: 1.01,
      y: -3,
      transition: {
        duration: 0.1
      }
    },
    whileTap: {
      scale: 0.98,
      y: 2,
      transition: {
        duration: 0.1
      }
    }
  }

  const linkProps = omit(newProps, [
    'children',
    'href',
    'as'
  ])

  // if (asFormButton) {
  //   return <motion.button
  //     {...newProps}
  //     className={newClassNames}
  //   />
  // }

  return <Link
    href={href}
    as={as}
    scroll={false}
  >
    <a
      {...linkProps}
      className={newClassNames}
    >
      <motion.span
        {...animationProps}
        className='inline'
      >
        {children}
      </motion.span>
    </a>
  </Link>

}

ButtonLink.propTypes = {
  href: PropTypes.string.required,
  as: PropTypes.string.required,
}