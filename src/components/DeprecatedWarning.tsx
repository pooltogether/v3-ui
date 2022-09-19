import { ExternalLink, LinkTheme, SquareLink } from '@pooltogether/react-components'
import FeatherIcon from 'feather-icons-react'

export const DeprecatedWarning = () => {
  return (
    <div className='rounded-xl bg-opacity-10 bg-actually-black p-4'>
      <h3 className='items-center'>
        <FeatherIcon icon='alert-triangle' className='text-gradient-yellow inline-flex mb-1 mr-2' />
        <span>V3 App has been deprecated</span>
      </h3>
      <p>
        Your funds are still locked in the PoolTogether contracts and are only accessible by you.
        The PoolTogether DAO is no longer awarding prizes for v3 pools. If you would like to
        withdraw your funds, please visit the{' '}
        <ExternalLink theme={LinkTheme.accent} href={'https://app.pooltogether.com'}>
          account page
        </ExternalLink>
        . Any unclaimed rewards from v3 are available{' '}
        <ExternalLink theme={LinkTheme.accent} href={'https://tools.pooltogether.com/token-faucet'}>
          here
        </ExternalLink>
        .
      </p>
      <SquareLink href='https://app.pooltogether.com/account' className='mt-4'>
        <span>Withdraw</span>
        <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
      </SquareLink>
      <SquareLink href='https://tools.pooltogether.com/token-faucet' className='mt-4'>
        <span>Rewards</span>
        <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
      </SquareLink>
      <h4 className='mt-8'>Why?</h4>
      <p>
        The{' '}
        <ExternalLink
          theme={LinkTheme.accent}
          href='https://github.com/pooltogether/v3-ui/tree/master'
        >
          PoolTogther v3
        </ExternalLink>{' '}
        app is dependent on several subgraphs that are currently live on the The Graph's{' '}
        <ExternalLink theme={LinkTheme.accent} href='https://thegraph.com/hosted-service'>
          Hosted Service
        </ExternalLink>
        . Beginning October 2022 all subgraphs must be migrated to the{' '}
        <ExternalLink
          theme={LinkTheme.accent}
          href='https://thegraph.com/blog/sunsetting-hosted-service'
        >
          Decentralized Network
        </ExternalLink>
        . Since the release of{' '}
        <ExternalLink
          theme={LinkTheme.accent}
          href='https://thegraph.com/blog/sunsetting-hosted-service'
        >
          PoolTogether v4
        </ExternalLink>{' '}
        the PoolTogether DAO has shifted focus to the latest version and can no longer justify the
        costs required to maintain support for this legacy app.
      </p>
    </div>
  )
}
