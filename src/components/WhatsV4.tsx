import { ExternalLink, LinkTheme } from '@pooltogether/react-components'

export const WhatsV4 = () => {
  return (
    <div className='rounded-xl bg-opacity-10 bg-actually-black p-4'>
      <h4>What is PoolTogether v4?</h4>
      <p>
        <ExternalLink
          theme={LinkTheme.accent}
          href='https://medium.com/pooltogether/the-new-pooltogether-e77517240167'
        >
          PoolTogether v4
        </ExternalLink>{' '}
        gives users across blockchains access to thousands of prizes daily.
      </p>
      <h4 className='mt-2'>How do I migrate?</h4>
      <p>
        <ol className='pl-8 list-decimal'>
          <li>
            <ExternalLink href='https://app.pooltogether.com/account'>
              Withdraw from v3
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href='https://app.pooltogether.com/deposit'>Deposit into v4</ExternalLink>
          </li>
        </ol>
        <span>
          That's it! You'll be automatically entered to win prizes every draw. Be sure to come back
          to the app to check if you won!
        </span>
      </p>
    </div>
  )
}
