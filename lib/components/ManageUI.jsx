import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { IndexUILoader } from 'lib/components/IndexUILoader'

export const ManageUI = (
  props,
) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext
  
  const poolDataContext = useContext(PoolDataContext)
  const {
    loading,
    poolAddresses,
    pool,
  } = poolDataContext

  if (loading) {
    return <IndexUILoader />
  }

  const isRngCompleted = pool?.isRngCompleted
  const isRngRequested = pool?.isRngRequested
  const canStartAward = pool?.canStartAward
  const canCompleteAward = pool?.canCompleteAward
  console.log({ canStartAward, canCompleteAward, isRngCompleted, isRngRequested,})

  return <>
    <div
      className='w-full px-2 py-4 sm:py-2'
    >
      <div
        className='flex items-center justify-between '
      >
        <div
          className='text-xl sm:text-2xl lg:text-3xl font-bold'
        >
          {pool?.name}
        </div>

        <div className='-mt-2'>
          <PoolActionsUI
            poolAddresses={poolAddresses}
            usersAddress={usersAddress}
          />
        </div>
      </div>
    </div>

    <div
      className='flex flex-col w-full py-4 sm:py-2'
    >    
      <div
        className='flex text-inverse justify-between w-full sm:w-1/2 lg:w-1/2 p-3'
      >
        <div>
          Can start award?
        </div>
        <div>
          {canStartAward?.toString()}
        </div>
      </div>
      <div
        className='flex text-inverse justify-between w-full sm:w-1/2 lg:w-1/2 p-3'
      >
        <div>
          Can complete award?
        </div>
        <div>
          {canCompleteAward?.toString()}
        </div>
      </div>
      <div
        className='flex text-inverse justify-between w-full sm:w-1/2 lg:w-1/2 p-3'
      >
        <div>
          Random number completed? (isRngCompleted)
        </div>
        <div>
          {isRngCompleted?.toString()}
        </div>
      </div>
      <div
        className='flex text-inverse justify-between w-full sm:w-1/2 lg:w-1/2 p-3'
      >
        <div>
          Random number requested? (isRngRequested)
        </div>
        <div>
          {isRngRequested?.toString()}
        </div>
      </div>
    </div>
  </>
}
