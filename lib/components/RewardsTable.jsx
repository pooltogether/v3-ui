import React, { useContext } from 'react'
import classnames from 'classnames'
import ContentLoader from 'react-content-loader'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { UI_LOADER_ANIM_DEFAULTS } from 'lib/constants'
import { Card } from 'lib/components/Card'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import useScreenSize, { ScreenSize } from 'lib/hooks/useScreenSize'

export const RewardsTable = (props) => {
  const { t } = useTranslation()

  const { children } = props

  const widthClass = props.columnOneWidthClass ?? 'sm:w-64'

  return (
    <>
      <div className='hidden sm:flex bg-card justify-between rounded-lg px-4 sm:px-8 py-2 mt-5 text-xxs text-accent-1 capitalize'>
        <div className={widthClass}>{t('asset')}</div>
        <div className='w-20'>APR</div>
        <div className='w-20'>{t('rewards')}</div>

        <div className='w-64 flex flex-row'>
          <div className='w-20'>{t('yourStake')}</div>
          <div className='w-20'></div>
          <div className='w-20'>{t('wallet')}</div>
        </div>
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
      <div
        className={classnames(
          'bg-card flex flex-col justify-center items-center rounded-lg py-4 px-4 my-4',
          gradientClasses
        )}
      >
        <div className='flex flex-col items-center text-center rounded-lg w-full py-6'>
          <ColumnOne {...props} />
          <ColumnTwo {...props} />
        </div>
        <RemainingColumns {...props} />
      </div>
    )
  }

  return (
    <Card
      noMargin
      noPad
      className={classnames('flex justify-between items-center py-4 px-8 my-1', gradientClasses)}
    >
      <ColumnOne {...props} />
      <ColumnTwo {...props} />
      <RemainingColumns {...props} />
    </Card>
  )
}

const ColumnOne = (props) => {
  const widthClass = props.columnOneWidthClass ?? 'sm:w-64'

  return (
    <div className={`${widthClass} sm:pr-1 flex flex-col sm:flex-row items-center`}>
      {props.columnOneImage}

      <div
        className='flex flex-col justify-center my-auto leading-none sm:leading-normal'
        style={{ minWidth: 'max-content' }}
      >
        {props.columnOneContents}
      </div>
    </div>
  )
}

const ColumnTwo = (props) => {
  return <div className='sm:w-20 mt-1 sm:mt-0 text-xl sm:text-lg'>{props.columnTwoContents}</div>
}

const RemainingColumns = (props) => {
  return props.remainingColumnsContents
}

export const RewardsTableContentsLoading = () => {
  // if (typeof window === 'undefined') {
  //   return null
  // }

  return <ThemedClipSpinner size={16} />

  // const { theme } = useContext(ThemeContext)

  // const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  // const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  // if (isMobile) {
  //   return (
  //     <div className='w-full p-4'>
  //       <ContentLoader
  //         {...UI_LOADER_ANIM_DEFAULTS}
  //         viewBox='0 0 100% 20'
  //         width='100%'
  //         height={90}
  //         backgroundColor={bgColor}
  //         foregroundColor={foreColor}
  //       >
  //         <rect x='0' y='0' rx='2' ry='2' width='60%' height='40' />
  //         <rect x='0' y='50' rx='2' ry='2' width='40%' height='30' />
  //       </ContentLoader>
  //     </div>
  //   )
  // }

  // return (
  //   <div className='w-full p-4'>
  //     <ContentLoader
  //       {...UI_LOADER_ANIM_DEFAULTS}
  //       viewBox='0 0 100% 20'
  //       width='100%'
  //       height={90}
  //       backgroundColor={bgColor}
  //       foregroundColor={foreColor}
  //     >
  //       <rect x='0' y='0' rx='2' ry='2' width='90' height='45' />
  //       <rect x='85%' y='0' rx='2' ry='2' width='80' height='30' />
  //       <rect x='85%' y='45' rx='2' ry='2' width='80' height='30' />
  //     </ContentLoader>
  //   </div>
  // )
}

export const RewardsTableCell = (props) => {
  const { label, topContentJsx, centerContentJsx, bottomContentJsx } = props

  return (
    <>
      <div className='w-full sm:w-20 flex flex-col items-start my-2'>
        {label && <h6 className='sm:hidden'>{label}</h6>}
        <div className='w-full sm:w-20 sm:h-20 flex sm:flex-col justify-between items-start'>
          <span className='flex sm:inline items-baseline'>
            <span className='text-lg font-bold'>{topContentJsx}</span>
            <div className='flex items-center justify-center sm:h-6 ml-2 sm:ml-0'>
              {centerContentJsx}
            </div>
          </span>

          {bottomContentJsx}
        </div>
      </div>
    </>
  )
}

export const RewardsTableAprDisplay = (props) => {
  const { apr } = props

  return (
    <>
      <span className='font-bold'>{apr.split('.')?.[0]}</span>.{apr.split('.')?.[1]}%{' '}
      <span className='sm:hidden text-xxs text-accent-1'>APR</span>
    </>
  )
}
