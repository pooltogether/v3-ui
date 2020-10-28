import React from 'react'

export const Card = (props) => {
  const { card } = props
  const { content, icon, title } = card

  return <div
    className='w-full sm:w-1/2 lg:w-1/3 px-4'
  >
    <div
      className='non-interactable-card mt-2 sm:mt-10 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='text-caption uppercase'
      >
        {icon && <img
          src={icon}
          className='inline-block mr-2 card-icon'
        />} {title}
      </div>
      <div className='mt-1'>
        {content}
      </div>
    </div>
  </div>
}

export const CardGrid = (props) => {
  const { cards, cardGroupId } = props

  return <>
    <div
      className='flex flex-col sm:flex-row sm:flex-wrap -mx-4'
    >
      {cards.map((card, index) => {
        return <Card 
          key={`${cardGroupId}-card-${index}`}
          card={card}
        />
      })}
    </div>
  </>

}
