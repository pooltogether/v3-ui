import { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { Modal } from 'lib/components/Modal'
import { prizeQuery } from 'lib/queries/prizeQuery'

import PrizeIllustration from 'assets/images/prize-illustration@2x.png'

const debug = require('debug')('pool-app:NewPrizeWinnerEventListener')

export const NewPrizeWinnerEventListener = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [storedRecentPrizeId, setStoredRecentPrizeId] = useState(null)
  const [newPrizeModalVisible, setNewPrizeModalVisible] = useState(null)

  const { usersAddress } = useContext(AuthControllerContext)
  const { pools } = useContext(PoolDataContext)

  // TODO: Expand this to work for every pool!
  const pool = pools?.[0]

  const recentPrizeId = pool?.currentPrizeId - 1
  debug('recentPrizeId', recentPrizeId)

  const prizeId = `${pool?.poolAddress}-${recentPrizeId}`
  const variables = {
    prizeId
  }

  const { loading, error, data } = useQuery(prizeQuery, {
    variables,
    skip: !pool?.poolAddress || !prizeId,
    fetchPolicy: 'network-only',
  })
  const recentPrize = data?.prize
  
  useEffect(() => {
    if (recentPrizeId && storedRecentPrizeId !== recentPrizeId) {
      debug('setting new stored prize count! prize awarded?')
      debug('setting new stored prize count! prize awarded?')
      debug('setting new stored prize count! prize awarded?')
      setStoredRecentPrizeId(recentPrizeId)
    }

    if (!newPrizeModalVisible && storedRecentPrizeId !== null && recentPrizeId !== storedRecentPrizeId) {
      debug('storedRecentPrizeId', storedRecentPrizeId)
      debug('storedRecentPrizeId', storedRecentPrizeId)
      debug('showingModal!')
      setNewPrizeModalVisible(true)
    }
  }, [pool])


  if (recentPrizeId === 0 || !recentPrize || !storedRecentPrizeId) {
    debug('returning null because one of these is true', recentPrizeId === 0, !recentPrize, !storedRecentPrizeId)
    return null
  }



  const handleClose = (e) => {
    e.preventDefault()

    setNewPrizeModalVisible(false)
  }

  debug({recentPrize})

  let winner
  if (recentPrize.winners.length > 0) {
    winner = data.prize.winners[0]
  }
  const isWinner = winner?.toLowerCase() === usersAddress?.toLowerCase()

  const recentPrizeAwarded = recentPrize.awardedTimestamp
  debug('newPrizeModalVisible', newPrizeModalVisible)
  debug('!!recentPrizeAwarded', !!recentPrizeAwarded)

  const show = newPrizeModalVisible && !!recentPrizeAwarded && !isNaN(recentPrizeId)
  debug('show', show)

  return <>
    <Modal
      handleClose={handleClose}
      visible={show}
      header={<>
        {t('aPrizeHasBeenAwarded')}
      </>}
    >
      <img
        src={PrizeIllustration}
        className='w-1/2 sm:w-1/2 lg:w-1/3 mx-auto'
      />

      {!usersAddress && <>
        {t('connectAWalletToSeeIfYouWon')}
      </>}

      {usersAddress && <>
        <div className='mt-4'>
          {isWinner ? <>
            <h4
              className='text-flashy'
            >
              {t('youWon')}
            </h4>
          </> : <>
            <h4
            >
              {t('unfortunatelyYouDidntWinThisOne')}
            </h4>
            <h6
            >
              {t('tryAgainNextWeek')}
            </h6>
          </>}
        </div>
      </>}

      <div className='mt-4'>
        <Button
          secondary
          onClick={(e) => {
            e.preventDefault()

            setNewPrizeModalVisible(false)

            const href = '/prizes/[symbol]/[prizeNumber]'
            const as = `/prizes/${pool?.symbol}/${pool?.currentPrizeId - 1}`

            router.push(
              href,
              as,
              { shallow: true }
            )
          }}
        >
          {t('viewPrize')}
        </Button>
      </div>
    </Modal>
  </>
}
