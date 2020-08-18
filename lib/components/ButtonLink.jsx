import React from 'react'
import classnames from 'classnames'
import Link from 'next/link'

export const getButtonClasses = (props) => {
  let {
    border,
    bg,
    primary,
    text,
    hoverBg,
    hoverBorder,
    hoverText,
    padding,
    rounded,
    selected,
    transition,
    className,
    textSize,
    width,
  } = props

  let defaultClasses = 'font-bold relative inline-block text-center leading-snug cursor-pointer outline-none focus:outline-none active:outline-none no-underline'
  // border-2
  let animClass = 'button-scale'
  
  if (selected) {
    defaultClasses += ` opacity-50`
    animClass = ``
  }

  
  // eg. textSize='sm', textSize='2xl'
  textSize = getTextSize(textSize)


  // text = 'text-match'
  padding = padding ? `${padding}` : 'px-6 sm:px-10 lg:px-12 py-2 sm:py-2'
  rounded = rounded ? `rounded-${rounded}` : 'rounded-lg'
  transition = transition ? `${transition}` : 'trans trans-fast'
  width = width ? `${width}` : ''

  // border = border ? `border-${border}` : `border-highlight-1`
  bg = bg ? `bg-${bg}` : 'bg-highlight-1'
  text = text ? `text-${text}` : 'text-secondary'

  hoverBg = hoverBg ? `hover:bg-${hoverBg}` : `hover:bg-purple`
  // hoverBg = hoverBg ? `hover:bg-${hoverBg}` : `hover:bg-primary`
  hoverBorder = hoverBorder ? `hover:border-${hoverBorder}` : `hover:border-highlight-2`
  hoverText = hoverText ? `hover:text-${hoverText}` : 'hover:text-green'

  
  return classnames(
    className,
    defaultClasses,
    animClass,
    bg,
    // border,
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
}

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
  } = props

  const classes = getButtonClasses(props)
  
  return <Link
    href={href}
    as={as}
    scroll={false}
  >
    <a
      // {...linkProps}
      className={classes}
    >
      {children}
    </a>
  </Link>

}
