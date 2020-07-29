import React from 'react'
import classnames from 'classnames'

export const Modal = (props) => {
  const { header, children, visible } = props

  return <>
    <div
      className={classnames(
        'text-sm sm:text-base lg:text-lg',
        {
          'hidden pointer-events-none': !visible,
          'absolute block t-0 b-0 l-0 r-0 block': visible,
        }
      )}
      style={{
        backdropFilter: "blur(2px)",
        zIndex: 150000
      }}
    >
      <div
        className='flex flex-col items-center justify-center h-full w-full shadow-2xl'
      >
        <div
          className='relative message bg-inverse text-match flex flex-col w-full rounded-lg border-secondary border-2 shadow-4xl'
          style={{
            maxWidth: '30rem'
          }}
        >
          <div
            className='relative flex flex-col w-full border-b-2 border-secondary px-10 py-6 text-lg'
          >
            {header}
          </div>
          <div
            className='relative flex flex-col w-full px-10 py-6 text-sm'
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  </>
}