import React from 'react'
import classnames from 'classnames'

export const Tabs = (props) => {
  const { children, className } = props
  return (
    <nav className={classnames('flex items-center justify-center mb-2 text-center', className)}>
      {children}
    </nav>
  )
}

export const Tab = ({ isSelected, onClick, children }) => {
  return (
    <a
      onClick={onClick}
      className={classnames(
        'cursor-pointer border-b-4 relative capitalize text-center leading-none flex justify-start',
        'items-center text-sm xs:text-lg lg:text-xl py-2 trans tracking-wider outline-none',
        'focus:outline-none active:outline-none font-bold mr-6 sm:mr-8 text-accent-2',
        {
          'hover:text-highlight-1 border-transparent': !isSelected,
          'selected border-highlight-8': isSelected
        }
      )}
    >
      {children}
    </a>
  )
}

export const ContentPane = (props) => {
  const { children, isSelected, alwaysPresent, onlyRenderOnSelect } = props
  let hiddenClassName = 'hidden'
  let visibleClassName = 'flex-1'

  if (alwaysPresent) {
    hiddenClassName = 'pointer-events-none opacity-0 w-0 flex-shrink'
  }

  if (onlyRenderOnSelect && !isSelected) return null

  return (
    <div
      className={classnames('w-full', {
        [hiddenClassName]: !isSelected,
        [visibleClassName]: isSelected
      })}
    >
      {children}
    </div>
  )
}
