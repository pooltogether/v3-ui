import React, { useContext } from 'react'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { usePlayerPrizesQuery } from 'lib/hooks/usePlayerPrizesQuery'
import { usePools } from 'lib/hooks/usePools'

import IconTarget from 'assets/images/icon-target@2x.png'

// Currently this component should only show up for the currentUser viewing their own account
export const AccountLootBoxes = () => {
  return null


  const { t } = useTranslation()
  
  const { contractAddresses } = usePools()

  const { usersAddress } = useContext(AuthControllerContext)

  const { data } = usePlayerPrizesQuery(usersAddress)

  const awardedExternalErc721Nfts = data?.awardedExternalErc721Nfts || []

  const lootBoxesWon = awardedExternalErc721Nfts
    .filter(_awardedNft => _awardedNft.address === contractAddresses.lootBox)

  console.log(lootBoxesWon)

  if (lootBoxesWon.length === 0) { return null }

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
          <h6
            className='flex items-center font-normal'
          >
            
            {/* {t('lootBoxNumber', {
              number
            })} */}
            {/* {id} */}
          </h6>

          <h3>
            {/* $<PoolNumber>
            </PoolNumber> */}
          </h3>
        </div>

        <div
          className='order-1 xs:order-2 ml-auto'
        >
          <img
            src={IconTarget}
            className='w-24 h-24 mx-auto'
          />
        </div>
      </div>
    </div>
  </>
}
