import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { WithdrawWizard } from 'lib/components/WithdrawWizard'
import { PodWithdrawAmount } from 'lib/components/WithdrawWizard/Pods/PodWithdrawAmount'
import { PodReviewAndSubmitWithdraw } from 'lib/components/WithdrawWizard/Pods/PodReviewAndSubmitWithdraw'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { usePod } from 'lib/hooks/usePod'
import { PodWithdrawReceipt } from 'lib/components/WithdrawWizard/Pods/PodWithdrawReceipt'

export const PodWithdrawWizard = (props) => {
  const router = useRouter()

  const { networkName, podAddress } = router.query
  const chainId = networkNameToChainId(networkName)

  const { data: pod, isFetched } = usePod(chainId, podAddress)

  return (
    <WithdrawWizard
      chainId={chainId}
      tokenAddress={pod?.tokens.underlyingToken.address}
      contractAddress={pod?.pod.address}
      isFetched={isFetched}
      // Steps
      WithdrawAmount={PodWithdrawAmount}
      WithdrawAmountProps={{ pod }}
      ReviewAndSubmitWithdraw={PodReviewAndSubmitWithdraw}
      ReviewAndSubmitWithdrawProps={{ pod }}
      WithdrawReceipt={PodWithdrawReceipt}
      WithdrawReceiptProps={{ pod }}
    />
  )
}
