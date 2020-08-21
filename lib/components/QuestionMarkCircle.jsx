import React from 'react'
import classnames from 'classnames'

export const QuestionMarkCircle = (props) => {
  const { white } = props

  let defaultClasses = 'bg-blue text-white'
  if (white) {
    defaultClasses = 'bg-white text-blue'
  }
  
  return <>
    <span
      className={classnames(
        defaultClasses,
        'flex items-center justify-center rounded-full w-4 h-4 sm:w-5 sm:h-5 mx-1',
      )}
    >
      <span
        className='relative font-number font-bold text-xs'
        style={{
          left: '0.05rem'
        }}
      >
        ?
      </span>
    </span>
  </>
}
