import React, { useContext, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import ClipLoader from 'react-spinners/ClipLoader'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { isEmpty, map, find, defaultTo, sum } from 'lodash'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { useTranslation, Trans } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { poolToast } from 'lib/utils/poolToast'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

import IconTarget from 'assets/images/icon-target.svg'

export const AccountWinnings = () => {
  const { t } = useTranslation()
  
  const { pools, dynamicPlayerDrips, usersChainData, graphDripData } = useContext(PoolDataContext)
  const { usersAddress, provider } = useContext(AuthControllerContext)
 
  const getTotalWinnings = () => {
    const amounts = map(usersDripTokenData, (dripTokenData, dripTokenAddress) => {
      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)

      return parseFloat(
        ethers.utils.formatUnits(
          dripData.claimable,
          dripData.dripToken.decimals
        )
      )
    })

    return sum(amounts)
  }

  return <>
    <h5
      className='font-normal text-accent-2 mt-16 mb-4'
    >
      {t('myWinnings')}
    </h5>

    <div
      className='xs:mt-3 bg-card rounded-lg xs:mx-0 px-2 sm:px-6 py-2 xs:py-3'
    >
      <div className='flex  justify-between xs:pt-4 pb-0 px-2 xs:px-4'>

        <div className='flex-col'>
          <h6
            className='flex items-center font-normal'
          >
            {t('allTimeWinnings')}
          </h6>

          <h3>
            <PoolNumber>
              {numberWithCommas(getTotalWinnings(), { precision: 6 })}
            </PoolNumber>
          </h3>
          <div
            className='opacity-60'
          >
            ${numberWithCommas(getTotalWinnings(), { precision: 6 })}
          </div>
        </div>

        <div>
          <img
            src={IconTarget}
            className='w-32 mx-auto'
          />
        </div>
      </div>

      <div
        className='text-inverse flex flex-col justify-between xs:px-2'
      >
        <table
          className='table-fixed w-full text-xxs xs:text-base sm:text-xl mt-6'
        >
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  </>
}
