import React from 'react'
import classnames from 'classnames'

export const Tabs = ({ children }) => {
  return <nav
    className='flex items-end justify-between mt-2 mb-6 mx-auto text-center border-b-2 pb-1'
  >
    {children}
  </nav>
}

export const Tab = ({ isSelected, onClick, children }) => {
  return <a
    className={classnames(
      'relative border-b-2 cursor-pointer text-xs sm:text-sm text-inverse mx-2 sm:mx-3 mb-1',
      {
        'border-transparent hover:border-highlight-1 text-default hover:text-highlight-2': !isSelected,
        'border-green text-inverse hover:text-highlight-1': isSelected,
      }
    )}
    style={{
      paddingBottom: 4
    }}
    onClick={onClick}
  >
    {children}
  </a>
}

export const Content = ({ children, className }) => {
  return <div
    className={classnames(className, 'py-2 flex')}
  >
    {children}
  </div>
}

export const ContentPane = ({ children, isSelected, alwaysPresent }) => {
  let hiddenClassName = 'hidden'
  let visibleClassName = 'flex-1'

  if (alwaysPresent) {
    hiddenClassName = 'pointer-events-none opacity-0 w-0 flex-shrink'
  }

  return (
    <div className={classnames(
      {
        [hiddenClassName]: !isSelected,
        [visibleClassName]: isSelected
      }
    )}>
      {children}
    </div>
  )
}