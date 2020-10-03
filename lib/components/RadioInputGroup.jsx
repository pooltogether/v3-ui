import React from 'react'
import classnames from 'classnames'

export const RadioInputGroup = (
  props,
) => {
  const { label, name, onChange, value, radios } = props

  const radioElements = radios.map((radio) => {
    const id = `${radio.value}-radio`
    const checked = value === radio.value
    
    return <div
      key={`radios-${radio.value}`}
      className='flex items-center justify-center radio-input-group trans w-full text-base sm:text-xl lg:text-2xl bg-white rounded-xl relative hover:text-white hover:bg-highlight-3 mx-6 bg-card'
      style={{
        maxWidth: 370,
        minHeight: 240,
        // width: '45%'
      }}
    >
      <input
        id={id}
        name={name}
        type='radio'
        onChange={onChange}
        value={radio.value}
        checked={checked}
        className='absolute hidden'
      />
      <label
        htmlFor={id}
        className={classnames(
          'flex flex-col items-center text-xs sm:text-base h-full text-inverse rounded-lg',
          'hover:text-white absolute t-0 l-0 r-0 b-0 px-8 py-8 w-full block trans mt-0',
          {
            'bg-card-selected border-2 border-dashed border-highlight-2': checked            
          }
        )}
      >
        {radio.icon}

        <h1
          className='text-2xl sm:text-5xl'
        >
          {radio.label}
        </h1>

        <div className='text-xxs sm:text-xs text-accent-1 text-center'>
          {radio.description}
        </div>
      </label>
    </div>
  })

  return <>
    <div
      className='radio-input-fieldset mb-6'
    >
      <label
        className='text-base sm:text-lg text-inverse hover:text-white trans mt-0'
      >
        {label}
      </label>

      <div className='flex items-center justify-center mt-4'>
        {radioElements}
      </div>
    </div>
  </>
}
