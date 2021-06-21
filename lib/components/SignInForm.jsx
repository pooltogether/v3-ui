import React from 'react'
import { useOnboard } from '@pooltogether/hooks'
import { Button, Tooltip } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

import PoolTogetherTrophyDetailed from 'assets/images/pooltogether-trophy--detailed.svg'
import PoolTogetherPOOLToken from 'assets/images/pool-icon.svg'

export function SignInForm(props) {
  const { descriptionClassName, hideImg, retroClaim, postSignInCallback } = props

  const { t } = useTranslation()

  const { connectWallet } = useOnboard()

  return (
    <div className='text-inverse'>
      {!hideImg && (
        <img
          src={retroClaim ? PoolTogetherPOOLToken : PoolTogetherTrophyDetailed}
          className='mx-auto mb-6 w-16 xs:w-1/12'
        />
      )}

      <h5 className={descriptionClassName}>
        {retroClaim
          ? t('connectWalletToClaimPoolTokens')
          : t('connectAWalletToManageTicketsAndRewards')}
      </h5>

      <Button
        textSize='lg'
        onClick={(e) => {
          e.preventDefault()
          connectWallet(postSignInCallback)
        }}
      >
        {t('connectWallet')}
      </Button>

      <br />
      <br />
      {!retroClaim && (
        <Tooltip
          id='what-is-eth-tooltip'
          title='Ethereum'
          className='mt-4 mx-auto w-48'
          tip={
            <>
              {t('whatIsEthereumOne')} {t('whatIsEthereumTwo')}
            </>
          }
        >
          <span className='opacity-60 font-bold text-caption w-48'>{t('whatsAnEthereum')}</span>
        </Tooltip>
      )}
    </div>
  )
}
