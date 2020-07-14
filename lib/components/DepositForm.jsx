import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  quantity,
  decimals
) => {
  if (
    !quantity
  ) {
    poolToast.error(`Deposit Quantity needs to be filled in`)
    return
  }

  const params = [
    usersAddress,
    ethers.utils.parseUnits(quantity, decimals),
    [], // bytes calldata
    {
      gasLimit: 700000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPeriodicPrizePoolAbi,
    'mintTickets',
    params,
    'Deposit',
  )
}

export const DepositForm = (props) => {
  const router = useRouter()

  const {
    handleSubmit,
    vars,
    stateSetters,
    disabled,
  } = props

  const quantity = router.query.quantity

  const poolData = useContext(PoolDataContext)
  const { usersChainValues, genericChainValues } = poolData

  const {
    usersTokenBalance,
  } = usersChainValues || {}

  const {
    isRngRequested,
    tokenDecimals,
  } = genericChainValues || {}

  let {
    tokenSymbol,
  } = genericChainValues || {}

  const poolIsLocked = isRngRequested
  tokenSymbol = tokenSymbol || 'TOKEN'

  const overBalance = quantity && usersTokenBalance && usersTokenBalance.lt(
    ethers.utils.parseUnits(quantity, tokenDecimals)
  )

  return <>
    <form
      onSubmit={handleSubmit}
    >
      {poolIsLocked && <FormLockedOverlay
        title='Deposit'
      >
        <div>
          The Pool is currently being awarded and until awarding is complete can not accept withdrawals.
        </div>
      </FormLockedOverlay>}

      {disabled && <FormLockedOverlay
        title='Deposit'
      >
        <>
          <div
          >
            Unlock deposits by first approving the pool's ticket contract to have a DAI allowance.
          </div>

          <div
            className='mt-3 sm:mt-5 mb-5'
          >
            <Button
            >
              Unlock Deposits
            </Button>
          </div>
        </>
      </FormLockedOverlay>}

      {/* {overBalance && <>
        <div className='text-yellow-400'>
          You only have {displayAmountInEther(usersTokenBalance, { decimals: tokenDecimals })} {tokenSymbol}.
          <br />The maximum you can deposit is {displayAmountInEther(usersTokenBalance, { precision: 2, decimals: tokenDecimals })}.
        </div>
      </>} */}

      <div
        className='my-5'
      >
        <Button
          disabled={quantity.length === 0 || parseInt(quantity, 10) <= 0}
          // disabled={overBalance}
          color='green'
        >
          Continue
        </Button>
      </div>
    </form>
  </>
}
