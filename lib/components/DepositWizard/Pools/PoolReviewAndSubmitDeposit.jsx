import React from 'react'
import Cookies from 'js-cookie'
import { useUsersAddress } from '@pooltogether/hooks'
import { ethers } from 'ethers'
import { numberWithCommas } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PrizePool'

import { ReviewAndSubmitDeposit } from 'lib/components/DepositWizard/ReviewAndSubmitDeposit'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { REFERRER_ADDRESS_KEY } from 'lib/constants'
import { DepositExpectationsWarning } from 'lib/components/DepositExpectationsWarning'

export const PoolReviewAndSubmitDeposit = (props) => {
  const { pool, contractAddress, quantity } = props
  const tokenSymbol = pool.tokens.underlyingToken.symbol
  const controlledTicketTokenAddress = pool.tokens.ticket.address
  const usersAddress = useUsersAddress()
  const { t } = useTranslation()
  const sendTx = useSendTransaction()

  const submitDepositTransaction = async () => {
    const decimals = pool.tokens.underlyingToken.decimals
    const quantityBN = ethers.utils.parseUnits(quantity, decimals)

    let referrerAddress = Cookies.get(REFERRER_ADDRESS_KEY)
    try {
      ethers.utils.getAddress(referrerAddress)
    } catch (e) {
      referrerAddress = ethers.constants.AddressZero
      console.log(`referrer address was an invalid Ethereum address:`, e.message)
    }

    const params = [usersAddress, quantityBN, controlledTicketTokenAddress, referrerAddress]
    const txName = `${t('deposit')} ${numberWithCommas(quantity)} ${tokenSymbol}`

    return await sendTx(txName, PrizePoolAbi, contractAddress, 'depositTo', params)
  }

  return (
    <ReviewAndSubmitDeposit
      {...props}
      label={t('depositIntoPool', { token: tokenSymbol })}
      tokenSymbol={tokenSymbol}
      submitDepositTransaction={submitDepositTransaction}
      cards={[
        <DepositExpectationsWarning
          creditLimitMantissa={pool.config.tokenCreditRates[0].creditLimitMantissa}
          creditRateMantissa={pool.config.tokenCreditRates[0].creditRateMantissa}
          className='my-8'
        />
      ]}
    />
  )
}
