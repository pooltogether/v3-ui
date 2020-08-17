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
    children,
    as,
    href,
    border,
    bg,
    text,
    hoverBg,
    hoverBorder,
    hoverText,
    padding,
    rounded,
    transition,
    className,
    disabled,
    selected,
    textSize,
    width,
  } = props

  let defaultClasses = 'font-bold border-2 relative inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'

  // eg. textSize='sm', textSize='2xl'
  textSize = getTextSize(textSize)

  // text = 'text-match'
  padding = padding ? `${padding}` : 'px-3 py-2 sm:py-2'
  rounded = rounded ? `rounded-${rounded}` : 'rounded-lg'
  transition = transition ? `${transition}` : 'trans trans-fast'
  width = width ? `${width}` : ''

  border = border ? `border-${border}` : `border-highlight-1`
  bg = bg ? `bg-${bg}` : 'bg-primary'
  text = text ? `text-${text}` : 'text-highlight-1'
  
  hoverBg = hoverBg ? `hover:bg-${hoverBg}` : `hover:bg-primary`
  hoverBorder = hoverBorder ? `hover:border-${hoverBorder}` : `hover:border-highlight-2`
  hoverText = hoverText ? `hover:text-${hoverText}` : 'hover:text-green'

  let newClassNames = classnames(
    className,
    defaultClasses,
    bg,
    border,
    padding,
    rounded,
    text,
    hoverBg,
    hoverBorder,
    hoverText,
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
    'hoverBg',
    'hoverBorder',
    'hoverText',
    'textSize',
    'transition',
    'width',
  ])

  const animationProps = {
    whileHover: {
      scale: 1.015,
      y: -2,
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

  return <Link
    href={href}
    as={as}
    scroll={false}
  >
    <motion.a
      {...linkProps}
      {...animationProps}
      className={newClassNames}
    >
      {children}
    </motion.a>
  </Link>

}
