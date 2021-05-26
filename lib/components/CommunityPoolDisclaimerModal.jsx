import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import Portal from '@reach/portal'
import Cookies from 'js-cookie'

import { COOKIE_OPTIONS } from 'lib/constants'
import { useTranslation } from 'next-i18next'
import { CheckboxInputGroup } from 'lib/components/CheckboxInputGroup'
import { Button } from 'lib/components/Button'
import { useIsPoolYieldSourceKnown } from 'lib/hooks/useIsPoolYieldSourceKnown'

const CheckboxContainer = (props) => (
  <div className='flex mx-auto px-4 py-2 sm:px-8 sm:py-2 mt-4 text-inverse rounded-lg font-bold'>
    {props.children}
  </div>
)

export function CommunityPoolDisclaimerModal(props) {
  const { t } = useTranslation()

  const acceptedCookieKey = `accepted-${props.poolSymbol}`

  const [checked, setChecked] = useState(false)
  const [accepted, setAccepted] = useState(Boolean(Cookies.get(acceptedCookieKey)))

  const { pool } = props

  const handleHideModal = (e) => {
    e.preventDefault()

    Cookies.set(acceptedCookieKey, 'true', COOKIE_OPTIONS)
    setAccepted(true)
  }
  const isYieldSourceKnown = useIsPoolYieldSourceKnown(pool)

  if (!pool.contract.isCommunityPool || accepted || isYieldSourceKnown) {
    return null
  }

  return (
    <Portal>
      <div
        id='community-pool-disclaimer-modal'
        className='w-screen h-screen fixed t-0 l-0 r-0 b-0'
        style={{
          zIndex: 299
        }}
      >
        <div
          className={'fixed t-0 l-0 r-0 b-0 w-full h-full bg-overlay bg-blur'}
          style={{
            zIndex: 298
          }}
        ></div>

        <div
          className='warning-modal fixed xs:inset-4 bg-black text-white border-2 border-orange rounded-lg px-6 sm:px-12 py-8 mt-32'
          style={{
            maxHeight: '30rem',
            zIndex: 300
          }}
        >
          <div className='flex flex-col items-center justify-center h-full text-center rounded-lg text-orange'>
            <FeatherIcon
              className='h-8 w-8 stroke-current stroke-2 mx-2 mb-4'
              icon='alert-circle'
            />
            <div className='font-bold text-xl'>{t('headsUp')}</div>

            <div className='mt-4 text-sm'>
              {t('thisPrizePoolWasCreatedByAMemberOfTheCommunity')} {t('anyoneCanCreateAPrizePool')}
            </div>

            <div style={{ transform: 'scale(1.15)' }}>
              <CheckboxContainer>
                <CheckboxInputGroup
                  marginClasses='mx-auto my-0'
                  id='i-understand'
                  name='i-understand'
                  label={t('iUnderstand')}
                  title=''
                  checked={checked}
                  handleClick={() => setChecked(!checked)}
                />
              </CheckboxContainer>
            </div>

            <Button
              tertiary
              onClick={handleHideModal}
              className='mt-2 w-48-percent'
              disabled={!checked}
            >
              {t('continue')}
            </Button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
