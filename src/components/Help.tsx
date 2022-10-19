import { ExternalLink, LinkTheme } from '@pooltogether/react-components'
import classNames from 'classnames'
import { Trans, useTranslation } from 'next-i18next'

export const Help = (props: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <div className={classNames('rounded-xl bg-opacity-10 bg-actually-black p-4', props.className)}>
      <h4>{t('needHelp')}</h4>
      <p>
        <Trans
          i18nKey='getHelpOnDiscord'
          components={{
            link1: (
              <ExternalLink
                theme={LinkTheme.accent}
                href='https://pooltogether.com/discord'
                children={undefined}
              />
            )
          }}
        />
      </p>
    </div>
  )
}
