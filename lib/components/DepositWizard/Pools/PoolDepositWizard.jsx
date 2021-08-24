import React from 'react'
import { useRouter } from 'next/router'
import { usePoolBySymbol } from '@pooltogether/hooks'

import { DepositWizard } from 'lib/components/DepositWizard'
import { PoolDepositAmount } from 'lib/components/DepositWizard/Pools/PoolDepositAmount'
import { PoolReviewAndSubmitDeposit } from 'lib/components/DepositWizard/Pools/PoolReviewAndSubmitDeposit'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'
import { PoolDepositReceipt } from 'lib/components/DepositWizard/Pools/PoolDepositReceipt'

export const PoolDepositWizard = (props) => {
  const router = useRouter()

  const { networkName, symbol } = router.query
  const chainId = networkNameToChainId(networkName)

  const { data: pool, isFetched } = usePoolBySymbol(chainId, symbol)

  return (
    <DepositWizard
      chainId={chainId}
      tokenAddress={pool?.tokens.underlyingToken.address}
      contractAddress={pool?.prizePool.address}
      isFetched={isFetched}
      // Steps
      DepositAmount={PoolDepositAmount}
      DepositAmountProps={{ pool }}
      ReviewAndSubmitDeposit={PoolReviewAndSubmitDeposit}
      ReviewAndSubmitDepositProps={{ pool }}
      DepositReceipt={PoolDepositReceipt}
      DepositReceiptProps={{ pool }}
    />
  )
}
