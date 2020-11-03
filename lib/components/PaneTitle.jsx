import React from 'react'

export function PaneTitle(props) {
  const {
    children,
    small,
    short,
  } = props

  let fontClasses = 'text-2xl sm:text-3xl lg:text-4xl text-inverse'
  let spacingClasses = 'pb-2 xs:pb-8'

  if (small) {
    fontClasses = 'text-sm sm:text-xl lg:text-2xl text-default-soft'
    spacingClasses = 'pb-1'
  }

  if (short) {
    spacingClasses = 'pb-2'
  }

  return <>
    <div
      className={`leading-tight font-bold ${fontClasses} ${spacingClasses}`}
    >
      {children}
    </div>
  </>

}