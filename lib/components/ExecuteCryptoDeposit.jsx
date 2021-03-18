import React, { useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import { DepositPaneTitle } from 'lib/components/DepositPaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { usePool } from 'lib/hooks/usePool'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { TxStatus } from 'lib/components/TxStatus'
import { useTransaction } from 'lib/hooks/useTransaction'

import IconStar from 'assets/images/icon-star@2x.png'

const bn = ethers.BigNumber.from

export function ExecuteCryptoDeposit(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()
  const quantity = router.query.quantity

  const { usersAddress } = useContext(AuthControllerContext)
  const { pool } = usePool()

  const decimals = pool?.underlyingCollateralDecimals
  const ticker = pool?.underlyingCollateralSymbol
  const tokenAddress = pool?.underlyingCollateralToken
  const poolAddress = pool?.poolAddress
  const controlledTicketTokenAddress = pool?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()

  const [txExecuted, setTxExecuted] = useState(false)

  const quantityFormatted = numberWithCommas(quantity)

  const txName = `${t('deposit')} ${quantityFormatted} ${tickerUpcased}`
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
  const tx = useTransaction(txId)

  useEffect(() => {
    const runTx = async () => {
      setTxExecuted(true)

      let referrerAddress = Cookies.get(REFERRER_ADDRESS_KEY)
      try {
        ethers.utils.getAddress(referrerAddress)
      } catch (e) {
        referrerAddress = ethers.constants.AddressZero
        console.log(`referrer address was an invalid Ethereum address:`, e.message)
      }

      const quantityBN = ethers.utils.parseUnits(quantity, Number(decimals))

      const params = [usersAddress, quantityBN, controlledTicketTokenAddress, referrerAddress]

      const id = await sendTx(txName, PrizePoolAbi, poolAddress, 'depositTo', params)
      setTxId(id)
    }

    if (!txExecuted && quantity && decimals) {
      runTx()
    }
  }, [quantity, decimals])

  useEffect(() => {
    if (tx?.cancelled || tx?.error) {
      previousStep()
    } else if (tx?.completed) {
      nextStep()
    }
  }, [tx])

  return (
    <>
      <DepositPaneTitle ticker={tickerUpcased} pool={pool} />

      <div className='pool-gradient-2 text-accent-1 w-full text-center mx-auto my-4 sm:mt-8 sm:mb-2 px-3 py-3 xs:py-6 rounded-full text-sm xs:text-base sm:text-xl lg:text-2xl'>
        <span className='mr-4'>{t('depositing')}</span>
        <PoolNumber>{numberWithCommas(quantity)}</PoolNumber> {tickerUpcased}
      </div>

      <div style={{ minHeight: 103 }}>
        <TxStatus
          tx={tx}
          inWalletMessage={t('confirmDepositInYourWallet')}
          sentMessage={t('depositConfirming')}
        />
      </div>

      <Banner
        gradient={null}
        className='bg-primary mt-4 sm:mt-2 mx-auto w-full text-accent-1'
        style={{ maxWidth: 380 }}
      >
        <img className='mx-auto mb-3 h-16' src={IconStar} />

        <p>
          {t('ticketsAreInstantAndPerpetual')}
          <br />
          {t('winningsAutomaticallyAdded')}
        </p>
      </Banner>
    </>
  )
}
