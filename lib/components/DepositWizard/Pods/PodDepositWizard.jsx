import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { DepositWizard } from 'lib/components/DepositWizard'
import { PodDepositAmount } from 'lib/components/DepositWizard/Pods/PodDepositAmount'
import { PodReviewAndSubmitDeposit } from 'lib/components/DepositWizard/Pods/PodReviewAndSubmitDeposit'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { usePod } from 'lib/hooks/usePod'
import { PodDepositReceipt } from 'lib/components/DepositWizard/Pods/PodDepositReceipt'

export const PodDepositWizard = (props) => {
  const router = useRouter()

  const { networkName, podAddress } = router.query
  const chainId = networkNameToChainId(networkName)

  const { data: pod, isFetched } = usePod(chainId, podAddress)

  return (
    <DepositWizard
      chainId={chainId}
      tokenAddress={pod?.tokens.underlyingToken.address}
      contractAddress={pod?.pod.address}
      isFetched={isFetched}
      // Steps
      DepositAmount={PodDepositAmount}
      DepositAmountProps={{ pod }}
      ReviewAndSubmitDeposit={PodReviewAndSubmitDeposit}
      ReviewAndSubmitDepositProps={{ pod }}
      DepositReceipt={PodDepositReceipt}
      DepositReceiptProps={{ pod }}
    />
  )
}
