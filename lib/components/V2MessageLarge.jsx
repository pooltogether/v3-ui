import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const bn = ethers.utils.bigNumberify

export const V2MessageLarge = (
  props,
) => {
  const { t } = useTranslation()
  
  const { usersAddress } = useContext(AuthControllerContext)
  // const {  } = useContext(AuthControllerContext)

  let usersTotalV2Balance = ethers.utils.parseEther('1.1')
  // normalizeTo18Decimals support USDC!

  const userHasV2Balance = usersTotalV2Balance.gte(
    bn('1000000000000000000')
  )

  // if (!userHasV2Balance) {
  //   return false
  // }

  return <>
    <div
      className='bg-raspberry text-white border-highlight-7 py-4 px-8 sm:p-6 sm:p-10 mb-10 rounded-lg border-2'
    >
      <div className='flex flex-col items-center sm:flex-row text-center sm:text-left justify-between'>
        <div
          className='w-full sm:w-2/3 sm:mr-2'
        >
          <h4
            className='sm:leading-10 mb-2'
          >
            <span
              className={`text-2xl block sm:inline`}
              role='img'
              aria-label='alarm clock'
            >💸</span> {t('itsTimeToMoveYourFunds')}
          </h4>

          <div
            className='sm:text-sm lg:text-lg my-2 sm:my-0'
          >
            {t('nowLiveV3MoreFun')} <br
              className='hidden sm:block'
            />{t('youCanManuallyWithdrawAmountFunds', {
              amount: ''
            })} 
          </div>
        </div>

        <div
          className='w-full sm:w-1/3 mt-4 mb-2 sm:my-0'
        >
          <ButtonLink
            bg='highlight-2'
            text='primary'
            as='https://v2.pooltogether.com'
            href='https://v2.pooltogether.com'
          >
            {t('openPoolTogetherV2')}
          </ButtonLink>
        </div>
      </div>
    </div>
  </>
}
