import React from 'react'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import { LootBoxWon } from 'lib/components/LootBoxWon'
import { isSelfAtom } from 'lib/components/AccountUI'
import { useLootBoxesWon } from 'lib/hooks/useLootBoxesWon'

import LootBoxIllustration from 'images/lootbox-closed-halo@2x.png'

// This component should only show up for the currentUser viewing their own account
export const AccountLootBoxes = (props) => {
  const [isSelf] = useAtom(isSelfAtom)

  if (!isSelf) {
    return null
  }

  return <AccountLootBoxesView />
}

const AccountLootBoxesView = (props) => {
  const { t } = useTranslation()

  const { address: usersAddress } = useOnboard()
  const { data: lootBoxesWon, isFetched: lootBoxesIsFetched } = useLootBoxesWon(usersAddress)

  if (!lootBoxesIsFetched || lootBoxesWon.length === 0) {
    return null
  }

  return (
    <>
      <div className='text-accent-2 mt-16 mb-4 opacity-90 font-headline uppercase xs:text-lg'>
        {t('myLootBoxes')}
      </div>

      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'>
        <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>
          <div className='flex-col order-2 xs:order-1 xs:w-3/4'>
            {lootBoxesWon.map((lootBox) => (
              <LootBoxWon key={lootBox.id} lootBox={lootBox} />
            ))}
            <div className='text-center flex flex-col text-default-soft mt-4 text-xxs'>
              {t('otherLootBoxTokensHaveBeenSent')}
            </div>
          </div>

          <div className='order-1 xs:order-2 ml-auto'>
            <Image src={LootBoxIllustration} className='w-32 h-32 mx-auto' />
          </div>
        </div>
      </div>
    </>
  )
}
