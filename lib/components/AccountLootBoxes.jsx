import React, { useContext } from 'react'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { LootBoxWon } from 'lib/components/LootBoxWon'
import { usePlayerPrizesQuery } from 'lib/hooks/usePlayerPrizesQuery'
import { usePools } from 'lib/hooks/usePools'

import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'

// Currently this component should only show up for the currentUser viewing their own account
export const AccountLootBoxes = () => {
  const { t } = useTranslation()
  
  const { contractAddresses } = usePools()

  const { usersAddress } = useContext(AuthControllerContext)

  const { data } = usePlayerPrizesQuery(usersAddress)

  const awardedExternalErc721Nfts = data?.awardedExternalErc721Nfts || []

  const lootBoxesWon = awardedExternalErc721Nfts
    .filter(_awardedNft => _awardedNft.address === contractAddresses.lootBox)

  if (lootBoxesWon.length === 0) { return null }

  console.log(lootBoxesWon)
  return <>
    <h5
      className='font-normal text-accent-2 mt-16 mb-4'
    >
      {t('myLootBoxes')}
    </h5>

    <div
      className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'
    >
      <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>

        <div className='flex-col order-2 xs:order-1'>
          {lootBoxesWon.map(lootBoxWon => <LootBoxWon lootBox={lootBoxWon} />)}
        </div>

        <div
          className='order-1 xs:order-2 ml-auto'
        >
          <img
            src={LootBoxIllustration}
            className=' h-32 mx-auto'
          />
        </div>
      </div>
    </div>
  </>
}
