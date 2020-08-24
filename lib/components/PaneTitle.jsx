import React from 'react'

export const PaneTitle = (props) => {
  const {
    children,
    small,
  } = props

  let fontClasses = 'text-2xl sm:text-5xl lg:text-5xl text-inverse'
  let spacingClasses = 'pb-10'

  if (small) {
    fontClasses = 'text-lg sm:text-2xl lg:text-3xl text-default-soft'
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