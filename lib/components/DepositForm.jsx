import React, { useContext } from 'react'
import { ethers } from 'ethers'

import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { FormLockedOverlay } from 'lib/components/FormLockedOverlay'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export const DepositForm = (props) => {
  const {
    handleSubmit,
    vars,
    stateSetters,
    disabled,
  } = props

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

  let depositAmount, setDepositAmount
  if (vars && stateSetters) {
    depositAmount = vars.depositAmount
    setDepositAmount = stateSetters.setDepositAmount
  }

  const overBalance = depositAmount && usersTokenBalance && usersTokenBalance.lt(
    ethers.utils.parseUnits(depositAmount, tokenDecimals)
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
            <Button>
              Unlock Deposits
            </Button>
          </div>
        </>
      </FormLockedOverlay>}

      <TextInputGroup
        large
        id='depositAmount'
        label={<>
          Quantity <span className='text-purple-600 italic'></span>
        </>}
        required
        disabled={disabled}
        type='number'
        pattern='\d+'
        onChange={(e) => setDepositAmount(e.target.value)}
        value={depositAmount}
      />

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
          disabled={depositAmount.length === 0 || parseInt(depositAmount, 10) <= 0}
          // disabled={overBalance}
          color='green'
        >
          Continue
        </Button>
      </div>
    </form>
  </>
}
