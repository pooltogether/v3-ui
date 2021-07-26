import React from 'react'
import {
  SideNavContainer,
  SideNavLink,
  SideAccountIcon,
  SideVoteIcon,
  SideRewardsIcon,
  SidePoolsIcon,
  SidePodsIcon,
  SocialLinks,
  CountBadge
} from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAllProposalsSorted } from 'lib/hooks/useAllProposalsSorted'

export const SideNav = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  const { pathname } = router
  const isPoolView = !['/account', '/rewards', '/pods'].includes(pathname)

  return (
    <div className='flex flex-col justify-between h-full'>
      <SideNavContainer className='top-side-nav'>
        <SideNavLink
          href='/'
          as='/'
          label={'Pools'}
          Link={Link}
          useRouter={useRouter}
          isCurrentPage={isPoolView}
        >
          <SidePoolsIcon />
        </SideNavLink>
        <SideNavLink
          href='/pods'
          as='/pods'
          label={'Pods'}
          Link={Link}
          useRouter={useRouter}
          match='/pods'
        >
          <SidePodsIcon />
        </SideNavLink>
        <SideNavLink
          href='/account'
          as='/account'
          label={t('account')}
          Link={Link}
          useRouter={useRouter}
          match='/account'
        >
          <SideAccountIcon />
        </SideNavLink>
        <SideNavLink
          href='/rewards'
          as='/rewards'
          label={t('rewards')}
          Link={Link}
          useRouter={useRouter}
          match='/rewards'
        >
          <SideRewardsIcon />
        </SideNavLink>
        <SideNavLink
          href='https://vote.pooltogether.com'
          as='https://vote.pooltogether.com'
          label={t('vote')}
          Link={Link}
          useRouter={useRouter}
        >
          <VoteIcon />
        </SideNavLink>
      </SideNavContainer>

      <SideNavContainer className='mb-4'>
        <SocialLinks />
      </SideNavContainer>
    </div>
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
      <SideVoteIcon />
    </div>
  )
}
