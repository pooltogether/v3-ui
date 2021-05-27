import React from 'react'
import { useUsersAddress } from '@pooltogether/hooks'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { LootBoxWon } from 'lib/components/LootBoxWon'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'
import { isSelfAtom } from 'lib/components/AccountUI'
import { useLootBoxesWon } from 'lib/hooks/useLootBoxesWon'

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
  const usersAddress = useUsersAddress()
  const { data: lootBoxesWon, isFetched: lootBoxesIsFetched } = useLootBoxesWon(usersAddress)

  if (!lootBoxesIsFetched || lootBoxesWon.length === 0) {
    return null
  }

  return (
    <>
      <h5 className='font-normal text-accent-2 mt-16 mb-4'>{t('myLootBoxes')}</h5>

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
            <img src={LootBoxIllustration} className='w-32 h-32 mx-auto' />
          </div>
        </div>
      </div>
    </>
  )
}
