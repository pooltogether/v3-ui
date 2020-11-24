import React from 'react'

export function PaneTitle(props) {
  const {
    children,
    small,
    short,
  } = props

  if (!children) {
    return null
  }

  let fontClasses = 'text-lg sm:text-2xl lg:text-3xl text-inverse font-bold'
  let spacingClasses = 'pb-2 xs:pb-6'

  if (small) {
    fontClasses = 'text-sm sm:text-lg lg:text-xl text-inverse'
    spacingClasses = 'pb-1'
  }

  if (short) {
    spacingClasses = 'pb-2'
  }

  return <>
    <div
      className={`leading-tight ${fontClasses} ${spacingClasses}`}
    >
      {children}
    </div>
  </>

}