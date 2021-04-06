import React from 'react'

import { IndexUI } from 'lib/components/IndexUI'
import { useAllPools } from 'lib/hooks/usePools'
import { LoadingScreen } from 'lib/components/LoadingScreen'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'

import PoolTogetherMark from 'assets/images/pooltogether-white-mark.svg'

export default function IndexPage(props) {
  const { data, isFetching, isFetched } = useAllPools()

  // if (!isFetched) {
  // if (true) {
  //   return (
  //     <div className='flex flex-col justify-center flex-grow'>
  //       <img
  //         src={PoolTogetherMark}
  //         className='mx-auto w-8 outline-none'
  //         style={{ borderWidth: 0 }}
  //       />
  //       <V3LoadingDots className='mx-auto' />
  //     </div>
  //   )
  // }

  return (
    <ul>
      {isFetching ? <li>Fetching</li> : <li>Hold</li>}
      {isFetched ? <li>Fetched</li> : <li>Not fetched</li>}
    </ul>
  )
  return (
    <>
      <IndexUI {...props} />
    </>
  )
}
