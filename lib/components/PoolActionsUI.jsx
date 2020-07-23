import React from 'react'
import Cookies from 'js-cookie'

import { SHOW_AWARD_FEATURES } from 'lib/constants'
import { CompleteAwardUI } from 'lib/components/CompleteAwardUI'
import { PoolStats } from 'lib/components/PoolStats'
import { StartAwardUI } from 'lib/components/StartAwardUI'

export const PoolActionsUI = (props) => {
  const cookieShowAward = Cookies.get(SHOW_AWARD_FEATURES)

  return <>
    <PoolStats
      {...props}
    />
    
    {cookieShowAward && <>
      <StartAwardUI
        {...props}
      />
      <CompleteAwardUI
        {...props}
      />
    </>}
  </>
}

