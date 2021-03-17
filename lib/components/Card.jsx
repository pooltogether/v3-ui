import React from 'react'

export const Card = (props) => (
  <div
    className='non-interactable-card my-10 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'
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
