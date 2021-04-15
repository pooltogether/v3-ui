import React, { useContext } from 'react'

import { useTranslation } from 'lib/../i18n'
import { LootBoxWon } from 'lib/components/LootBoxWon'
import { useMultiversionPlayerPrizes } from 'lib/hooks/useMultiversionPlayerPrizes'
import { useContractAddresses } from 'lib/hooks/useContractAddresses'

import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'
import { useAllPools } from 'lib/hooks/usePools'

// TODO: FINISH & TTEST this component
// This component should only show up for the currentUser viewing their own account
export const AccountLootBoxes = () => {
  const { t } = useTranslation()

  const { contractAddresses } = useContractAddresses()
  const { data: pools } = useAllPools()

  // const { usersAddress } = useContext(AuthControllerContext)

  const usersAddress = '0x80845058350b8c3df5c3015d8a717d64b3bf9267'

  const { data } = useMultiversionPlayerPrizes(usersAddress)

  const awardedExternalErc721Nfts = data?.awardedExternalErc721Nfts || []

  let lootBoxesWon = awardedExternalErc721Nfts.filter(
    (_awardedNft) => _awardedNft.address === contractAddresses.lootBox
  )

  lootBoxesWon = lootBoxesWon.filter((lootBoxWon) =>
    pools.find((_pool) => _pool.id === lootBoxWon.prize.prizePool.id)
  )

  if (lootBoxesWon.length === 0) {
    return null
  }

  return (
    <>
      <h5 className='font-normal text-accent-2 mt-16 mb-4'>{t('myLootBoxes')}</h5>

      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'>
        <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>
          <div className='flex-col order-2 xs:order-1 xs:w-3/4'>
            {lootBoxesWon.map((lootBoxWon) => (
              <LootBoxWon
                pools={pools}
                key={lootBoxWon.id}
                awardedExternalErc721LootBox={lootBoxWon}
              />
            ))}
          </div>

          <div className='order-1 xs:order-2 ml-auto'>
            <img src={LootBoxIllustration} className='w-32 h-32 mx-auto' />
          </div>
        </div>
      </div>
    </>
  )
}
