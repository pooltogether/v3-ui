import { ReviewAndSubmitDeposit } from 'lib/components/DepositWizard/ReviewAndSubmitDeposit'
import { useRouter } from 'next/router'
import React from 'react'
import { useUsersAddress } from '@pooltogether/hooks'
import { ethers } from 'ethers'
import { numberWithCommas } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'
import PodAbi from 'abis/PodAbi'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

export const PodReviewAndSubmitDeposit = (props) => {
  const { pod, contractAddress, quantity } = props
  const tokenSymbol = pod.tokens.underlyingToken.symbol
  const usersAddress = useUsersAddress()
  const { t } = useTranslation()
  const sendTx = useSendTransaction()

  const submitDepositTransaction = async () => {
    const decimals = pod.tokens.underlyingToken.decimals
    const quantityBN = ethers.utils.parseUnits(quantity, decimals)

    const params = [usersAddress, quantityBN]
    const txName = `${t('deposit')} ${numberWithCommas(quantity)} ${tokenSymbol}`

    return await sendTx(txName, PodAbi, contractAddress, 'depositTo', params)
  }

  return (
    <ReviewAndSubmitDeposit
      {...props}
      label={t('depositIntoPod', { token: tokenSymbol })}
      tokenSymbol={tokenSymbol}
      submitDepositTransaction={submitDepositTransaction}
    />
  )
}
