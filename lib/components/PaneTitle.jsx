import React from 'react'

export function PaneTitle(props) {
  const { children, small } = props

  if (!children) {
    return null
  }

  let fontClasses = 'text-lg sm:text-xl text-inverse font-bold'
  let spacingClasses = 'pb-2 xs:pb-4'

  if (small) {
    fontClasses = 'text-xxs xs:text-sm sm:text-lg lg:text-xl text-inverse font-bold'
    spacingClasses = 'pb-2'
  }

  return (
    <div
      className={`leading-snug xs:leading-tight ${fontClasses} ${spacingClasses} mx-auto`}
      style={{
        maxWidth: 550,
      }}
    >
      {children}
    </div>
  )
}
