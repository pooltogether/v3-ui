import React from 'react'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { usePlayerTotalPoolDepositValue } from '@pooltogether/hooks'
import { toNonScaledUsdString } from '@pooltogether/utilities'

import { isSelfAtom } from 'lib/components/AccountUI'
import { GenericConnectWalletCTA } from 'lib/components/GenericConnectWalletCTA'
import { PoolNumber } from 'lib/components/PoolNumber'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import ChillWalletIllustration from 'images/pt-illustration-chill@2x.png'
import WaterslideIllustration from 'images/pt-waterslide-illustration@2x.png'
import { useUsersTotalPodDepositsValue } from 'lib/hooks/useUsersTotalPodDepositsValue'

export const AccountSummary = () => {
  const { t } = useTranslation()

  const [isSelf] = useAtom(isSelfAtom)

  const { address: usersAddress } = useOnboard()

  const router = useRouter()
  const playerAddress = router?.query?.playerAddress
  const address = playerAddress || usersAddress

  const { data: totalTicketValues, isFetched: playerTicketsIsFetched } =
    usePlayerTotalPoolDepositValue(address)
  const { data: totalPodTicketValues, isFetched: podTicketsIsFetched } =
    useUsersTotalPodDepositsValue(address)

  const isFetched = playerTicketsIsFetched && podTicketsIsFetched
  const totalTicketValueUsd = isFetched
    ? toNonScaledUsdString(
        totalTicketValues.totalValueUsdScaled.add(totalPodTicketValues.totalValueUsdScaled)
      )
    : '0'

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
          {isFetched ? (
            <h1>
              $<PoolNumber>{numberWithCommas(totalTicketValueUsd, { precision: 2 })}</PoolNumber>
            </h1>
          ) : !address ? (
            <GenericConnectWalletCTA />
          ) : (
            <ThemedClipSpinner />
          )}
        </div>

        <div className={classnames('w-32 xs:w-40 ml-auto -mr-8')}>
          <Image
            src={isSelf ? ChillWalletIllustration : WaterslideIllustration}
            alt={`chillin' wallet illustration`}
          />
        </div>
      </div>
    </div>
  )
}
