import React from 'react'
import FeatherIcon from 'feather-icons-react'
import { useOnboard } from '@pooltogether/hooks'
import { Button, Tooltip } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

export const GenericConnectWalletCTA = () => {
  const { t } = useTranslation()
  const { connectWallet } = useOnboard()

  return (
    <>
      <div className='text-xxxs sm:text-sm font-bold mt-1'>
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
          id='what-is-ethereum-tooltip'
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
            className='text-accent-1 text-xxs flex items-center'
          >
            {t('learnMoreAboutEthereumWallets')}{' '}
            <FeatherIcon
              icon='arrow-up-right'
              className='w-3 h-3 sm:w-4 sm:h-4 inline-block ml-1'
            />
          </a>
        </div>
      </div>
    </>
  )
}
