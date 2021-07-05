import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useOnboard } from '@pooltogether/hooks'
import { useTranslation } from 'react-i18next'

import { isSelfAtom } from 'lib/components/AccountUI'
import { GenericConnectWalletCTA } from 'lib/components/GenericConnectWalletCTA'
import { PoolNumber } from 'lib/components/PoolNumber'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { usePlayerTotalDepositValue } from 'lib/hooks/useUserTickets'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'
import WaterslideIllustration from 'assets/images/pt-waterslide-illustration@2x.png'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const [isSelf] = useAtom(isSelfAtom)

  const { address: usersAddress } = useOnboard()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: totalTicketValues, isFetched: playerTicketsIsFetched } =
    usePlayerTotalDepositValue(address)
  const totalValueUsd = totalTicketValues?.totalValueUsd

  return (
    <div
      className={classnames(
        'rounded-lg pl-6 pr-10 xs:px-10 py-5 sm:py-8 text-white my-4 sm:mt-8 sm:mb-12 mx-auto',
        {
          'pool-gradient-1': isSelf,
          'pool-gradient-2': !isSelf
        }
      )}
    >
      <div className='flex justify-between items-center'>
        <div className='leading-tight'>
          <div className='opacity-80 font-headline uppercase xs:text-sm'>{t('assets')}</div>
          {playerTicketsIsFetched ? (
            <h1>
              $<PoolNumber>{numberWithCommas(totalValueUsd, { precision: 2 })}</PoolNumber>
            </h1>
          ) : !address ? (
            <GenericConnectWalletCTA />
          ) : (
            <ThemedClipSpinner />
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
              right: isSelf && -28,
              top: isSelf ? 17 : 7
            }}
          />
        </div>
      </div>
    </div>
  )
}
