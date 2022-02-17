import { LinkIcon } from '@pooltogether/react-components'
import { NETWORK } from '@pooltogether/utilities'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const POOLS_TO_SHOW_PROMPT = ['0xee06abe9e2af61cabcb13170e01266af2defa946']

export const V4WithdrawFlowBanner = (props) => {
  const { className, pool } = props
  const { t } = useTranslation()

  // const promptKey = useMemo(() => getPromptKey(pool.chainId), [pool.prizePool.address])
  // Hide for CELO & BSC
  // Hide for POOL and OHM
  if (!POOLS_TO_SHOW_PROMPT.includes(pool.prizePool.address) && NETWORK.mainnet !== pool.chainId) {
    return null
  }

  return (
    <div
      className={classNames('gradient-new-full w-full sm:w-1/2 p-px rounded mx-auto', className)}
    >
      <div className='py-2 px-4 bg-actually-black bg-opacity-60 rounded flex justify-between'>
        <div className='flex flex-col space-y-1 text-left'>
          <span>{t('gasFeesTooHigh')}</span>
          <span>{t('wantMorePrizes')}</span>
          <span>{t('tiredOfWhales')}</span>
        </div>
        <div className='my-auto'>
          <span>🌊🏆</span>
          <a
            href='https://app.pooltogether.com/'
            className='text-xs font-bold underline flex'
            target='_blank'
            rel='noopener noreferrer'
          >
            {t('checkOutV4', 'Check out v4')}
            <LinkIcon className='w-4 h-4 my-auto' />
          </a>
        </div>
      </div>
    </div>
  )
}
