import {
  BottomAccountIcon,
  BottomNavContainer,
  BottomNavLink,
  BottomPoolsIcon,
  BottomVoteIcon,
  BottomRewardsIcon,
  CountBadge
} from '@pooltogether/react-components'
import { useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const BottomNav = (props) => {
  const router = useRouter()
  const { pathname } = router
  const isPoolView = !['/account', '/rewards'].includes(pathname)

  return (
    <BottomNavContainer>
      <BottomNavLink
        shallow
        href='/'
        as='/'
        label={'Pools'}
        Link={Link}
        useRouter={useRouter}
        isCurentPage={isPoolView}
      >
        <BottomPoolsIcon />
      </BottomNavLink>
      <BottomNavLink
        shallow
        href='/account'
        as='/account'
        label={'Account'}
        Link={Link}
        useRouter={useRouter}
        match='/account'
      >
        <BottomAccountIcon />
      </BottomNavLink>
      <BottomNavLink
        shallow
        href='/rewards'
        as='/rewards'
        label={'Rewards'}
        Link={Link}
        useRouter={useRouter}
        match='/rewards'
      >
        <BottomRewardsIcon />
      </BottomNavLink>
      <BottomNavLink
        href='https://vote.pooltogether.com'
        as='https://vote.pooltogether.com'
        label={'Vote'}
        Link={Link}
        useRouter={useRouter}
        match='/vote'
      >
        <VoteIcon />
      </BottomNavLink>
    </BottomNavContainer>
  )
}

const VoteIcon = () => {
  const { sortedProposals } = useAllProposalsSorted()
  const activeCount = sortedProposals?.active?.length

  return (
    <div className='relative'>
      {activeCount > 0 && (
        <CountBadge className='z-10 absolute -top-2 -right-2' count={activeCount} />
      )}
      <BottomVoteIcon />
    </div>
  )
}
