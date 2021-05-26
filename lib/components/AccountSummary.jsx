import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useOnboard } from '@pooltogether/hooks'

import { useTranslation } from 'react-i18next'
import { isSelfAtom } from 'lib/components/AccountUI'
import { Button } from 'lib/components/Button'
import { PoolNumber } from 'lib/components/PoolNumber'
import { SmallLoader } from 'lib/components/loaders/SmallLoader'
import { Tooltip } from 'lib/components/Tooltip'
import { usePlayerTotalDepositValue } from 'lib/hooks/useUserTickets'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'
import WaterslideIllustration from 'assets/images/pt-waterslide-illustration@2x.png'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const [isSelf] = useAtom(isSelfAtom)

  const { connectWallet, address: usersAddress } = useOnboard()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: totalTicketValues, isFetched: playerTicketsIsFetched } =
    usePlayerTotalDepositValue(address)
  const totalValueUsd = totalTicketValues?.totalValueUsd

  return (
    <div
      className={classnames(
        'rounded-lg pl-6 pr-10 xs:px-10 py-5 text-white my-4 sm:mt-8 sm:mb-12 mx-auto',
        {
          'pool-gradient-1': isSelf,
          'pool-gradient-2': !isSelf
        }
      )}
    >
      <div className='flex justify-between items-center'>
        <div className='leading-tight'>
          <h6 className='font-normal'>{t('assets')}</h6>
          {playerTicketsIsFetched ? (
            <h1>
              $<PoolNumber>{numberWithCommas(totalValueUsd, { precision: 2 })}</PoolNumber>
            </h1>
          ) : !address ? (
            <>
              <div className='text-xxxs sm:text-base font-bold mt-1'>
                {t('connectAWalletToManageTicketsAndRewards')}
              </div>

              <Button
                textSize='xs'
                padding='px-4 py-1'
                className='mt-4'
                onClick={(e) => {
                  e.preventDefault()
                  connectWallet(() => {})
                }}
              >
                {t('connectWallet')}
              </Button>

              <div className='flex flex-col sm:flex-row sm:items-center mt-8'>
                <Tooltip
                  id='whatIsEthereum'
                  tip={
                    <>
                      Ethereum Wallet?
                      <br />
                      {t('whatIsEthereumOne')}
                      <br />
                      <br />
                      {t('whatIsEthereumTwo')}
                    </>
                  }
                >
                  <div className='flex items-center opacity-60 font-bold text-accent-1 text-xxs'>
                    <FeatherIcon icon='info' className='w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1' />
                    {t('whatsAnEthereum')}
                  </div>
                </Tooltip>

                <div className='opacity-60 font-bold sm:ml-8 mt-1 sm:mt-0'>
                  <a
                    href='https://ethereum.org/en/wallets'
                    target='_blank'
                    className='text-accent-1 text-xxxxs sm:text-xxs flex items-center'
                  >
                    {t('learnMoreAboutEthereumWallets')}{' '}
                    <FeatherIcon
                      icon='external-link'
                      className='w-3 h-3 sm:w-4 sm:h-4 inline-block ml-1'
                    />
                  </a>
                </div>
              </div>
            </>
          ) : (
            <SmallLoader />
          )}
        </div>

        <div>
          <img
            src={isSelf ? ChillWalletIllustration : WaterslideIllustration}
            alt={`chillin' wallet illustration`}
            className={classnames('w-32 xs:w-40 mx-auto relative mb-4', {
              '-mr-4': isSelf
            })}
            style={{
              right: isSelf && -10,
              top: isSelf ? 17 : 7
            }}
          />
        </div>
      </div>
    </div>
  )
}
