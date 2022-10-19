import { ExternalLink, LinkTheme, SquareLink } from '@pooltogether/react-components'
import classNames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { Trans, useTranslation } from 'next-i18next'

export const DeprecatedWarning = (props: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <div className={classNames('rounded-xl bg-opacity-10 bg-actually-black p-4', props.className)}>
      <h3 className='items-center'>
        <FeatherIcon icon='alert-triangle' className='text-gradient-yellow inline-flex mb-1 mr-2' />
        <span>{t('v3InterfaceHasBeenDeprecated')}</span>
      </h3>
      <p>
        <Trans
          i18nKey='v3FundsAreSafe'
          components={{
            // link1: (
            //   <ExternalLink
            //     theme={LinkTheme.accent}
            //     href={'https://app.pooltogether.com/account'}
            //     children={undefined}
            //   />
            // ),
            // link2: (
            //   <ExternalLink
            //     theme={LinkTheme.accent}
            //     href={'https://tools.pooltogether.com/token-faucet'}
            //     children={undefined}
            //   />
            // ),
            link1: (
              <ExternalLink
                theme={LinkTheme.accent}
                href={'https://v3.docs.pooltogether.com/'}
                children={undefined}
              />
            )
          }}
        />
      </p>
    </div>
  )
}
