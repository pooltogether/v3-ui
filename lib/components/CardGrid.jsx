import React from 'react'
import classnames from 'classnames'

export function Card(props) {
  const { card, className } = props
  const { content, icon, title, noMinHeight } = card

  return (
    <div className={classnames(className, 'w-full px-4')}>
      <div
        className={classnames(
          'non-interactable-card py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg',
          {
            'card-min-height-desktop': !noMinHeight
          }
        )}
      >
        <div className='text-caption uppercase'>
          {icon && <img src={icon} className='inline-block mr-2 card-icon' />} {title}
        </div>
        <div className='mt-1'>{content}</div>
      </div>
    </div>
  )
}

export function CardGrid(props) {
  const { cards, cardGroupId, className } = props

  return (
    <div className={classnames('flex flex-col sm:flex-row sm:flex-wrap -mx-4', className)}>
      {cards.map((card, index) => {
        return (
          <Card
            key={`${cardGroupId}-card-${index}`}
            card={card}
            className={classnames({
              'sm:w-full': cards.length < 2,
              'sm:w-1/2': cards.length === 2,
              'sm:w-1/2 lg:w-1/3': cards.length >= 3
            })}
          />
        )
      })}
    </div>
  )
}
