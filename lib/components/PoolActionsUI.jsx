import React from 'react'
import Cookies from 'js-cookie'

import { SHOW_AWARD_FEATURES } from 'lib/constants'
import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const PoolActionsUI = (props) => {
  const cookieShowAward = Cookies.get(SHOW_AWARD_FEATURES)

  return <>
    {cookieShowAward && <>
      <div
        className='flex sm:justify-end items-center mt-4 mt-2'
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

