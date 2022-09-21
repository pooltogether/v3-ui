import { ExternalLink, LinkTheme, SquareLink } from '@pooltogether/react-components'
import FeatherIcon from 'feather-icons-react'
import { Trans, useTranslation } from 'next-i18next'

export const DeprecatedWarning = () => {
  const { t } = useTranslation()
  return (
    <div className='rounded-xl bg-opacity-10 bg-actually-black p-4'>
      <h3 className='items-center'>
        <FeatherIcon icon='alert-triangle' className='text-gradient-yellow inline-flex mb-1 mr-2' />
        <span>{t('v3InterfaceHasBeenDeprecated')}</span>
      </h3>
      <p>
        <Trans
          i18nKey='v3FundsAreSafe'
          components={{
            link1: (
              <ExternalLink
                theme={LinkTheme.accent}
                href={'https://app.pooltogether.com/account'}
                children={undefined}
              />
            ),
            link2: (
              <ExternalLink
                theme={LinkTheme.accent}
                href={'https://tools.pooltogether.com/token-faucet'}
                children={undefined}
              />
            )
          }}
        />
      </p>
      <div className='grid sm:grid-cols-2 gap-x-4'>
        <SquareLink href='https://app.pooltogether.com/account' className='mt-4'>
          <span>{t('withdraw')}</span>
          <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
        </SquareLink>
        <SquareLink href='https://tools.pooltogether.com/token-faucet' className='mt-4'>
          <span>{t('rewards')}</span>
          <FeatherIcon icon='external-link' className='ml-1 my-auto w-5 h-5' />
        </SquareLink>
      </div>
    </div>
  )
}
