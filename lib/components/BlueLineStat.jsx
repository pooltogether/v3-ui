import React from 'react'

export const BlueLineStat = ({
  title,
  value,
}) => {
  return <>
    <div
      className='font-bold uppercase flex items-center justify-center text-inverse text-xs sm:text-sm lg:text-base'
    >
      <span
        className='inline-block w-5 bg-primary mr-2'
        style={{
          height: 2
        }}
      ></span> {title} <span
        className='inline-block w-5 bg-primary ml-2'
        style={{
          height: 2
        }}
      ></span>
    </div>

    <div
      className='font-number flex justify-center font-bold text-secondary text-xl sm:text-2xl lg:text-3xl mb-2 glow'
    >
      {value}
    </div>
  </>
}