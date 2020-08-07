import React from 'react'

import { BlankStateMessage } from 'lib/components/BlankStateMessage'

export const ErrorMessage = (props) => {
  return <div
    className='text-red font-bold p-4 mx-auto border-2'
  >
    <BlankStateMessage>
      {props.children}
    </BlankStateMessage>
  </div>
}
