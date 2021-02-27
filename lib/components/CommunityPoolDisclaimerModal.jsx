import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import Portal from '@reach/portal'

import { useTranslation } from 'lib/../i18n'

export function CommunityPoolDisclaimerModal() {
  const { t } = useTranslation()

  const [disabled, setDisabled] = useState(true)

  return (
    <Portal>
      <div
        id='community-pool-disclaimer-modal'
        className='w-screen h-screen fixed t-0 l-0 r-0 b-0'
        style={{
          zIndex: 299,
        }}
      >
        <div
          className={'fixed t-0 l-0 r-0 b-0 w-full h-full bg-overlay bg-blur'}
          style={{
            zIndex: 298,
          }}
        ></div>

        <div
          className='graph-modal fixed xs:inset-4 bg-black text-white border-2 border-green rounded-lg px-6 py-4 font-bold mt-32'
          style={{
            maxHeight: '26rem',
            zIndex: 300,
          }}
        >
          <div className='flex flex-col items-center justify-center h-full text-center'>
            {t('thisPrizePoolWasCreatedByAMemberOfTheCommunity')}
            <div className='mt-4'>{t('anyoneCanCreateAPrizePool')}</div>
            <button
              href='https://status.thegraph.com/'
              className='inline-block border-b border-green hover:border-0 text-xxs mt-10'
              target='_blank'
              rel='noreferrer noopener'
              disabled={disabled}
            >
              
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
