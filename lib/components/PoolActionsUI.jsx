import React from 'react'
import Cookies from 'js-cookie'

import { SHOW_MANAGE_LINKS } from 'lib/constants'
import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export function PoolActionsUI(props) {
  const cookieShowAward = Cookies.get(SHOW_MANAGE_LINKS)

  return <>
    {cookieShowAward && <>
      <div
        className='flex items-center'
      >
        <StartAwardUI
          {...props}
        />
        <CompleteAwardUI
          {...props}
        />
      </div>
    </>}
  </>
}
