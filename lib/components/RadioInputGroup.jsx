import React from 'react'

export const RadioInputGroup = (
  props,
) => {
  const { label, name, onChange, value, radios } = props

  const radioElements = radios.map((radio) => {
    const id = `${radio.value}-radio`
    
    return <div
      key={`radios-${radio.value}`}
      className='radio-input-group trans w-full sm:w-10/12 text-base sm:text-xl lg:text-2xl bg-secondary rounded-xl relative mx-auto hover:bg-green'
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
        className='text-primary relative pl-6 py-3 w-full block mb-4 relative overflow-hidden trans'
      >
        {radio.label}
      </label>
    </div>
  })

  return <>
    <div
      className='radio-input-fieldset mb-6'
    >
      <label
        className='text-inverse hover:text-inverse trans mt-0'
      >
        {label}
      </label>

      {radioElements}
    </div>
  </>
}
