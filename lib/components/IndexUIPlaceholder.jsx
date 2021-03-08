import React from 'react'

const IndexUIPlaceholderRow = () => {
  return (
    <div
      className={
        'w-full px-3 sm:px-4 sm:px-4 mb-3 py-3 sm:py-4 inline-block  trans rounded-lg border-0 text-inverse bg-primary hover:bg-secondary hover:text-primary cursor-pointer shadow-md hover:shadow-xl'
      }
      style={{
        minHeight: 120
      }}
    >
      <div className='flex justify-between items-center'>
        <div className='text-lg sm:text-xl font-bold w-5/12 sm:w-3/12'>...</div>

        <div className='flex items-center ml-4 w-6/12 sm:w-3/12 lg:w-1/3'>...</div>

        <div className='flex items-center w-1/12'></div>
      </div>

      <div className='mt-5 flex items-center'>
        <div className='w-6/12 sm:w-10/12 lg:w-11/12'>...</div>
      </div>
    </div>
  )
}

export const IndexUIPlaceholder = (props) => {
  return (
    <>
      <ul>
        <IndexUIPlaceholderRow />
        <IndexUIPlaceholderRow />
        <IndexUIPlaceholderRow />
      </ul>
    </>
  )
}
