import React, { useCallback } from 'react'
import { Card } from '@pooltogether/react-components'
import { usePodShareBalance } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { ethers } from 'ethers'
import { numberWithCommas } from '@pooltogether/utilities'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import PodAbi from 'abis/PodAbi'
import { ReviewAndSubmitDeposit } from 'lib/components/DepositWizard/ReviewAndSubmitDeposit'
import { useAllUsersPodTickets } from 'lib/hooks/useAllUsersPodTickets'
import { useSendTransactionWrapper } from 'lib/hooks/useSendTransactionWrapper'

import Bell from 'images/bell-red@2x.png'

export const PodReviewAndSubmitDeposit = (props) => {
  const { pod, contractAddress, quantity, nextStep } = props
  const chainId = pod.metadata.chainId
  const tokenSymbol = pod.tokens.underlyingToken.symbol
  const decimals = pod.tokens.underlyingToken.decimals
  const podAddress = pod.pod.address
  const { address: usersAddress } = useOnboard()
  const { t } = useTranslation()
  const sendTx = useSendTransactionWrapper()

  const { refetch: refetchPodShareBalance } = usePodShareBalance(chainId, usersAddress, podAddress)
  const { refetch: refetchAllPodTickets } = useAllUsersPodTickets(usersAddress)

  const submitDepositTransaction = useCallback(async () => {
    const quantityBN = ethers.utils.parseUnits(quantity, decimals)

    const params = [usersAddress, quantityBN]
    const txName = `${t('deposit')} ${numberWithCommas(quantity)} ${tokenSymbol}`

    return await sendTx({
      name: txName,
      contractAbi: PodAbi,
      contractAddress,
      method: 'depositTo',
      params,
      callbacks: {
        onSuccess: () => {
          nextStep()
        },
        refetch: () => {
          refetchAllPodTickets()
          refetchPodShareBalance()
        }
      }
    })
  }, [quantity, contractAddress])

  return (
    <ReviewAndSubmitDeposit
      {...props}
      label={t('depositIntoPod', { token: tokenSymbol })}
      tokenSymbol={tokenSymbol}
      submitDepositTransaction={submitDepositTransaction}
      cards={[
        <Card
          className='flex flex-col mx-auto my-8'
          backgroundClassName='bg-functional-red'
          sizeClassName='max-w-md'
        >
          <Image className='mx-auto h-8 mb-4 text-xs sm:text-base' src={Bell} />
          <p>{t('withdrawAnyTimePod')}</p>
          {/* TODO: Link to FAQ/Knowledge base */}
          {/* <ExternalLink>Learn more</ExternalLink> */}
        </Card>
      ]}
    />
  )
}
