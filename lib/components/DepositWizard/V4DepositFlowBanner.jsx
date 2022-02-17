import { LinkIcon } from '@pooltogether/react-components'
import { NETWORK } from '@pooltogether/utilities'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const getPromptKey = (chainId) => {
  const prompts = getPromptKeys(chainId)
  const randomIndex = Math.round(Math.random() * 100) % prompts.length
  return prompts[randomIndex]
}

const getPromptKeys = (chainId) => {
  const genericPrompts = ['wantMorePrizes', 'tiredOfWhales']
  const gasPrompts = ['gasFeesTooHigh']
  switch (chainId) {
    case NETWORK.polygon:
      return genericPrompts
    default:
      return genericPrompts.concat(gasPrompts)
  }
}

const CHAINS_TO_HIDE_PROMPT = [NETWORK.celo, NETWORK.bsc]
const POOLS_TO_HIDE_PROMPT = [
  '0x396b4489da692788e327e2e4b2b0459a5ef26791',
  '0xeab695a8f5a44f583003a8bc97d677880d528248'
]

export const V4DepositFlowBanner = (props) => {
  const { className, pool } = props
  const { t } = useTranslation()
  const promptKey = useMemo(() => getPromptKey(pool.chainId), pool.prizePool.address)

  // Hide for CELO & BSC
  // Hide for POOL and OHM
  if (
    CHAINS_TO_HIDE_PROMPT.includes(pool.chainId) ||
    POOLS_TO_HIDE_PROMPT.includes(pool.prizePool.address)
  ) {
    return null
  }

  return (
    <div
      className={classNames('gradient-new-full w-full sm:w-1/2 p-px rounded mx-auto', className)}
    >
      <div className='py-2 px-4 bg-actually-black bg-opacity-60 rounded flex justify-between'>
        <span>{t(promptKey)}</span>
        <div className='flex'>
          <span className='mr-1'>🌊🏆</span>
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
