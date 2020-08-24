import React from 'react'
import classnames from 'classnames'

export const Tabs = ({ children }) => {
  return <nav
    className='flex items-center justify-center mb-2 mx-auto text-center'
  >
    {children}
  </nav>
}

export const Tab = ({ isSelected, onClick, children }) => {
  return <a
    onClick={onClick}
    className={classnames(
      'tab-link relative cursor-pointer text-base sm:text-xl lg:text-xl mx-2 sm:mx-3 mb-1 px-3 font-bold pb-2',
      {
        'text-default-soft hover:text-highlight-2': !isSelected,
        'selected text-highlight-1 hover:text-highlight-1': isSelected,
      }
    )}
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