import React from 'react'

export const RadioInputGroup = (
  props,
) => {
  const { label, name, onChange, value, radios } = props

  const radioElements = radios.map((radio) => {
    const id = `${radio.value}-radio`
    
    return <div
      key={`radios-${radio.value}`}
      className='flex items-center justify-center radio-input-group trans w-full text-base sm:text-xl lg:text-2xl bg-white rounded-xl relative hover:text-white hover:bg-highlight-3 mx-2'
      style={{
        maxWidth: 300,
        minHeight: 200,
        width: '45%'
      }}
    >
      <input
        id={id}
        name={name}
        type='radio'
        onChange={onChange}
        value={radio.value}
        checked={value === radio.value}
        className='absolute hidden'
      />
      <label
        htmlFor={id}
        className='flex items-center text-xs sm:text-base h-full text-primary hover:text-white absolute t-0 l-0 r-0 b-0 px-4 w-full block  trans mt-0'
      >
        <div className='-mt-4 text-center mx-auto'>
          {radio.label}
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
