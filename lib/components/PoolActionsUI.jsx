import React from 'react'

import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export function PoolActionsUI(props) {
  return (
    <div className='flex items-center'>
      <StartAwardUI {...props} />
      <CompleteAwardUI {...props} />
    </div>
  )
}
