import React from 'react'

import { LoadingDots } from '@pooltogether/react-components'
import { usePrizeSortedPods } from 'lib/hooks/usePrizeSortedPods'

export const PodsList = () => {
  const { data: pods, isFetched } = usePrizeSortedPods()

  if (!isFetched) {
    return <LoadingDots />
  }

  return (
    <ul>
      {pods.map((pod) => (
        <PodListItem key={pod.pod.address} pod={pod} />
      ))}
    </ul>
  )
}
