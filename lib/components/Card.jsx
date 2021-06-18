import React from 'react'
import classnames from 'classnames'

export const Card = (props) => (
  <div
    className={classnames(
      'non-interactable-card bg-card rounded-lg',
      {
        'my-4': !props.noMargin,
        'py-4 xs:py-6 px-4 xs:px-6 sm:px-10': !props.noPad
      },
      props.className
    )}
    id={props.id}
  >
    {props.children}
  </div>
)

export const CardDetailsList = (props) => (
  <ul
    className='xs:bg-primary theme-light--no-gutter text-inverse rounded-lg p-0 xs:px-4 sm:px-10 xs:py-8 mt-4 flex flex-col text-xs xs:text-base sm:text-lg'
    id={props.id}
  >
    {props.children}
  </ul>
)
