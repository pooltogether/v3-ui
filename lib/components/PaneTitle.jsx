import React from 'react'

export function PaneTitle(props) {
  const { children, small } = props

  if (!children) {
    return null
  }

  let fontClasses = 'text-lg sm:text-xl text-inverse font-bold'
  let spacingClasses = 'mb-2 xs:mb-4'

  if (small) {
    fontClasses = 'text-xxs xs:text-sm text-inverse font-bold'
    spacingClasses = 'mb-2'
  }

  return (
    <div
      className={`leading-snug xs:leading-relaxed ${fontClasses} ${spacingClasses} mx-auto mt-2`}
      style={{
        maxWidth: 550
      }}
    >
      {children}
    </div>
  )
}
