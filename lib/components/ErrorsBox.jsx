import React from 'react'

export const ErrorsBox = (props) => {
  const { errors } = props

  const errorMessages = Object.values(errors).map(error => error.message)

  return <>
    <div className='text-red' style={{minHeight: 24}}>
      {errorMessages.map(errorMsg => errorMsg)}
    </div>
  </>
}
