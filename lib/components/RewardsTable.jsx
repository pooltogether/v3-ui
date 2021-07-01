import React, { useContext } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

import { Card } from 'lib/components/Card'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'

export const RewardsTable = (props) => {
  const { t } = useTranslation()

  const { children, depositColumnHeader } = props

  const widthClass = props.columnOneWidthClass ?? 'sm:w-48 lg:w-64'

  return (
    <>
      <div className='hidden sm:flex bg-card justify-between rounded-lg px-4 sm:px-8 py-2 mt-5 text-xxs text-accent-1'>
        <div className={widthClass}>{t('asset')}</div>
        <div className='w-20 lg:w-32'>APR</div>
        <div className='w-20 lg:w-32 sm:mx-4'>{t('rewards')}</div>

        <div className='w-20 lg:w-32 sm:mx-4'>{depositColumnHeader}</div>
        <div className='w-10 lg:w-20'></div>
        <div className='w-20 lg:w-32 sm:mx-4'>{t('wallet')}</div>
      </div>

      {children}
    </>
  )
}

export const RewardsTableRow = (props) => {
  const screenSize = useScreenSize()

  const gradientClasses = {
    'border-b-8-gradient': Boolean(props.gradientBorder),
    'border-uniswap-gradient': Boolean(props.uniswap)
  }

  if (screenSize <= ScreenSize.sm) {
    return (
      <div className='bg-card flex flex-col justify-center items-center rounded-lg my-4'>
        <div className='w-full py-4 px-4'>
          <div className='flex flex-col items-center text-center rounded-lg w-full pt-6 pb-4 sm:py-6'>
            <ColumnOne {...props} />
            <ColumnTwo {...props} />
          </div>
          <div
            className='w-full sm:hidden border-default opacity-20 mb-2'
            style={{ borderTopWidth: 1 }}
          />
          <RemainingColumns {...props} />
        </div>

        {Boolean(props.gradientBorder) && (
          <div className={classnames('rounded-b-lg h-2 w-full', gradientClasses)} />
        )}
      </div>
    )
  }

  return (
    <Card noMargin noPad className='flex flex-col justify-between items-center my-1'>
      <div className='w-full flex justify-between items-center py-4 px-8 my-1'>
        <ColumnOne {...props} />
        <ColumnTwo {...props} />
        <RemainingColumns {...props} />
      </div>
      {Boolean(props.gradientBorder) && (
        <div className={classnames('rounded-b-lg h-2 w-full', gradientClasses)} />
      )}
    </Card>
  )
}

const ColumnOne = (props) => {
  const widthClass = props.columnOneWidthClass ?? 'sm:w-48 lg:w-64'

  return (
    <div className={`${widthClass} sm:pr-1 flex flex-col min-w-max sm:flex-row items-center`}>
      {props.columnOneImage}

      <div className='flex flex-col justify-center my-auto leading-none sm:leading-normal'>
        {props.columnOneContents}
      </div>
    </div>
  )
}

const ColumnTwo = (props) => {
  return <div className='sm:w-20 lg:w-32 text-xl sm:text-lg'>{props.columnTwoContents}</div>
}

const RemainingColumns = (props) => {
  return props.remainingColumnsContents
}

export const RewardsTableCell = (props) => {
  const { label, topContentJsx, centerContentJsx, bottomContentJsx, divTwoClassName } = props

  return (
    <>
      <div className='w-full flex flex-col sm:w-20 lg:w-32 items-start my-2 sm:mx-4'>
        {label && <div className='sm:hidden font-normal text-accent-1'>{label}</div>}
        <div
          className={classnames(
            divTwoClassName
              ? divTwoClassName
              : 'w-full sm:h-20 flex sm:flex-col justify-between items-start leading-snug'
          )}
        >
          <span className='flex sm:inline items-baseline'>
            <span className='text-lg font-bold'>{topContentJsx}</span>
            <div className='flex items-center sm:h-6 ml-2 sm:ml-0'>{centerContentJsx}</div>
          </span>

          {bottomContentJsx}
        </div>
      </div>
    </>
  )
}

export const RewardsTableAprDisplay = (props) => {
  const { t } = useTranslation()

  const { apr, isPrize } = props

  return (
    <div className='mt-3 sm:mt-0 leading-snug'>
      <span className='font-bold'>{apr.split('.')?.[0]}</span>.{apr.split('.')?.[1]}%{' '}
      <span className='sm:hidden text-xxs text-accent-1 mt-1 sm:mt-2'>APR</span>
      {isPrize && <div className='lowercase text-xs'>+ {t('prize')}</div>}
    </div>
  )
}
