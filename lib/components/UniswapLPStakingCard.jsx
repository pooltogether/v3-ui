import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useForm } from 'react-hook-form'
import Dialog from '@reach/dialog'

import { Card } from 'lib/components/Card'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useUniswapLPPoolAddress } from 'lib/hooks/useUniswapLPPoolAddress'
import { useUniswapStakingPool } from 'lib/hooks/useUniswapLPStakingPool'
import { Erc20Image } from 'lib/components/Erc20Image'
import { NETWORK } from 'lib/utils/networks'
import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { APP_ENVIRONMENT, useAppEnv } from 'lib/hooks/useAppEnv'
import useScreenSize from 'lib/hooks/useScreenSize'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { Input } from 'lib/components/Input'
import { Button } from 'lib/components/Button'

import PoolIcon from 'assets/images/pool-icon.svg'
import EtherIcon from 'assets/images/ether-icon.png'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { PoolNumber } from 'lib/components/PoolNumber'
import { parseUnits } from 'ethers/lib/utils'

export const UniswapLPStakingCard = (props) => {
  const { appEnv } = useAppEnv()
  const { usersAddress } = useContext(AuthControllerContext)
  const { data: stakingPoolData, isFetched } = useUniswapStakingPool()
  const screenSize = useScreenSize()

  if (appEnv !== APP_ENVIRONMENT.mainnets || !isFetched || !usersAddress) {
    return null
  }

  return (
    <>
      <h5 id='governance-claims' className='font-normal text-accent-2 mt-16 mb-4'>
        Staking
      </h5>
      <Card noPad>
        <div className='flex flex-col sm:flex-row py-2'>
          <div className='border-accent-3 sm:border-dashed sm:border-r-2 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 flex'>
            <div
              className='flex flex-row sm:flex-col justify-center my-auto'
              style={{ minWidth: 'max-content' }}
            >
              <LPTokenLogo className='sm:mx-auto' />
              <a
                href='https://info.uniswap.org/pairs#/pools/0xff2bdf3044c601679dede16f5d4a460b35cebfee'
                target='_blank'
                rel='noreferrer noopener'
                className='text-xs font-bold my-auto ml-2 sm:ml-0 sm:mt-2 text-inverse hover:opacity-70'
              >
                POOL/ETH Pair
              </a>
            </div>
            <div className='sm:bg-body'></div>
          </div>

          <div className='flex flex-col sm:flex-row justify-between w-full py-2 px-4 xs:px-6 sm:px-10'>
            <ClaimTokens stakingPoolData={stakingPoolData} />
            <ManageStakedAmount stakingPoolData={stakingPoolData} />
          </div>
        </div>
      </Card>
    </>
  )
}

const LPTokenLogo = (props) => (
  <div className={classnames('relative', props.className)}>
    <img
      src={PoolIcon}
      className={classnames('absolute rounded-full', {
        'w-8 h-8': !props.small,
        'w-4 h-4': props.small
      })}
    />
    <img
      src={EtherIcon}
      className={classnames('rounded-full', {
        'w-8 h-8 ml-4': !props.small,
        'w-4 h-4 ml-2': props.small
      })}
    />
  </div>
)

LPTokenLogo.defaultProps = {
  small: false
}

const ManageStakedAmount = (props) => {
  const { stakingPoolData } = props
  const { user } = stakingPoolData
  const { lpToken, tickets } = user
  const { balance: lpBalance, balanceUnformatted: lpBalanceUnformatted } = lpToken
  const { balance: ticketBalance, balanceUnformatted: ticketBalanceUnformatted } = tickets

  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false)
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false)

  return (
    <div className='flex flex-col text-left sm:text-right'>
      <div className='flex sm:justify-end mb-2'>
        <LPTokenLogo small className='my-auto' />
        <span className='ml-2 text-xxs font-bold uppercase'>POOL/ETH UNI-V2 LP</span>
      </div>

      <span className='text-xxxs font-bold uppercase'>Deposited</span>
      <span className='text-xl font-bold leading-none mb-2'>
        <PoolNumber>{numberWithCommas(lpBalance)}</PoolNumber>
      </span>

      <span className='text-xxxs font-bold uppercase'>Balance</span>
      <span className='text-xl font-bold leading-none mb-2'>
        <PoolNumber>{numberWithCommas(ticketBalance)}</PoolNumber>
      </span>

      <ManageDepositTriggers
        openDepositModal={() => setDepositModalIsOpen(true)}
        openWithdrawModal={() => setWithdrawModalIsOpen(true)}
      />

      <DepositModal
        stakingPoolData={stakingPoolData}
        isOpen={depositModalIsOpen}
        closeModal={() => setDepositModalIsOpen(false)}
      />
      <WithdrawModal
        stakingPoolData={stakingPoolData}
        isOpen={withdrawModalIsOpen}
        closeModal={() => setWithdrawModalIsOpen(false)}
      />
    </div>
  )
}

const ManageDepositTriggers = (props) => {
  const { openDepositModal, openWithdrawModal } = props

  // TODO: Allow trigger

  return (
    <div className='flex flex-row mr-auto sm:mr-0 sm:ml-auto'>
      <button onClick={openDepositModal}>Deposit</button>
      <span className='mx-2 opacity-70'>/</span>
      <button onClick={openWithdrawModal}>Withdraw</button>
    </div>
  )
}

const ClaimTokens = (props) => {
  const { stakingPoolData } = props
  const { user } = stakingPoolData
  const { claimableBalance, claimableBalanceUnformatted, tickets, dripTokensPerDay } = user
  const { balanceUnformatted: ticketBalanceUnformatted } = tickets

  const showClaimable = !ticketBalanceUnformatted.isZero() || !claimableBalanceUnformatted.isZero()

  if (!showClaimable) return null

  return (
    <div className='flex flex-col text-left mb-4 sm:mb-0'>
      <div className='flex mb-2'>
        <img src={PoolIcon} className='my-auto mr-2 rounded-full w-4 h-4' />
        <span className='text-xxs font-bold'>POOL Earned</span>
      </div>

      <span className='text-2xl font-bold leading-none mb-1'>
        <PoolNumber>{numberWithCommas(claimableBalance)}</PoolNumber>
      </span>

      <span className='text-xxs flex'>
        {numberWithCommas(dripTokensPerDay)}
        <img src={PoolIcon} className='my-auto ml-2 mr-1 rounded-full w-4 h-4' /> POOL / day
      </span>

      <div className='mr-auto mt-2'>
        <TransactionButton>Claim</TransactionButton>
      </div>
    </div>
  )
}

const TransactionButton = (props) => {
  return <button>{props.children}</button>
}

const onSubmit = (d, e) => console.log(d, e)
const onError = (d, e) => console.log(d, e)

const WithdrawModal = (props) => (
  <ActionModal
    {...props}
    title={'Unstake'}
    action={'withdraw'}
    ticker={'POOL/ETH UNI-V2 LP'}
    onSubmit={onSubmit}
    maxAmount={props.stakingPoolData.user.tickets.balance}
    maxAmountUnformatted={props.stakingPoolData.user.tickets.balanceUnformatted}
  />
)

const DepositModal = (props) => (
  <ActionModal
    {...props}
    title={'Stake'}
    action={'deposit'}
    ticker='POOL/ETH UNI-V2 LP'
    onSubmit={onSubmit}
    maxAmount={props.stakingPoolData.user.lpToken.balance}
    maxAmountUnformatted={props.stakingPoolData.user.lpToken.balanceUnformatted}
  />
)

const ActionModal = (props) => {
  const {
    isOpen,
    closeModal,
    title,
    action,
    onSubmit,
    maxAmount,
    maxAmountUnformatted,
    ticker,
    stakingPoolData
  } = props

  const decimals = stakingPoolData.user.lpToken.decimals
  // const step = 1 * Math.pow(10, -1 * decimals)
  // console.log(decimals, step)

  const { register, handleSubmit, setValue, errors, formState } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })
  const { isDirty, isValid } = formState

  console.log(errors, isDirty, isValid)

  return (
    <Dialog
      aria-label={`POOL/ETH UNI-V2 LP Pool ${action} Modal`}
      isOpen={isOpen}
      onDismiss={closeModal}
    >
      <div className='relative text-inverse p-4 bg-card h-full sm:h-auto rounded-none sm:rounded-xl sm:max-w-sm mx-auto flex flex-col'>
        <div className='flex'>
          <button
            className='absolute r-4 t-4 close-button trans text-inverse hover:opacity-30'
            onClick={closeModal}
          >
            <FeatherIcon icon='x' className='w-6 h-6' />
          </button>
        </div>

        <div className='flex flex-row mb-4'>
          <LPTokenLogo small className='my-auto mr-2' />
          <h5>{title} POOL/ETH LP</h5>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className='flex flex-col'>
          <div className='flex flex-row justify-between mt-4 mb-2'>
            <label className='my-0 capitalize' htmlFor={`_${action}`}>
              {action}
            </label>
            <div>
              <span className='mr-1'>Balance:</span>
              <button
                type='button'
                onClick={() => setValue(action, maxAmount, { shouldValidate: true })}
              >
                {numberWithCommas(maxAmount)}
              </button>
            </div>
          </div>
          <input
            name={action}
            ref={register({
              required: true,
              pattern: {
                value: /^\d*\.?\d*$/,
                message: 'please enter a positive number'
              },
              validate: {
                greaterThanBalance: (value) =>
                  parseUnits(value, decimals).lte(maxAmountUnformatted) ||
                  'Please enter a number less than your balance'
              }
            })}
            className='bg-body p-2 w-full rounded-xl'
          />
          <span className='h-6 w-full text-xxs text-orange'>
            {errors?.[action]?.message || null}
          </span>

          <div className='flex flex-row w-full justify-between mt-2'>
            <Button type='button' className='mr-2' width='w-full' onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type='submit'
              border='green'
              text='primary'
              bg='green'
              hoverBorder='green'
              hoverText='primary'
              hoverBg='green'
              className='ml-2'
              width='w-full'
              disabled={!isDirty || !isValid}
            >
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

const DepositIntoPool = (props) => {
  const { stakingPoolData } = props
  return <ManageContainer></ManageContainer>
}

const WithdrawFromPool = (props) => {
  const { stakingPoolData } = props

  const { register } = useForm({
    mode: 'all'
  })

  return <ManageContainer></ManageContainer>
}

const ManageContainer = (props) => (
  <div className={classnames('sm:bg-body p-2 sm:p-4 rounded mb-2 last:mb-0', props.className)}>
    {props.children}
  </div>
)
