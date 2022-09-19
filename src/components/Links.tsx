import { SquareLink } from '@pooltogether/react-components'
import FeatherIcon from 'feather-icons-react'

export const Links = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <SquareLink href='https://app.pooltogether.com/deposit'>
        <span>Deposit in v4</span>
        <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
      </SquareLink>
      <SquareLink href='https://app.pooltogether.com/account'>
        <span>Withdraw from v3</span>
        <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
      </SquareLink>
      <SquareLink href='https://v2.pooltogether.com/en/account'>
        <span>Withdraw from v2</span>
        <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
      </SquareLink>
      <SquareLink href='https://v1.pooltogether.com'>
        <span>Withdraw from v1</span>
        <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
      </SquareLink>
    </div>
  )
}
