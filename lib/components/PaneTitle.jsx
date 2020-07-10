import React from 'react'

export const PaneTitle = (props) => {
  const {
    children,
    small,
  } = props

  let fontClasses = 'text-2xl sm:text-5xl lg:text-5xl text-inverse'
  let spacingClasses = 'pb-10'

  if (small) {
    fontClasses = 'text-lg sm:text-2xl lg:text-3xl text-primary'
    spacingClasses = 'mb-0 pb-0'
  }

  return <>
    <div
      className={`font-bold ${fontClasses} ${spacingClasses}`}
    >
      {children}
    </div>
  </>

}