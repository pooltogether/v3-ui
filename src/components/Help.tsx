import { ExternalLink, LinkTheme } from '@pooltogether/react-components'
import { Trans, useTranslation } from 'next-i18next'

export const Help = () => {
  const { t } = useTranslation()
  return (
    <div className='rounded-xl bg-opacity-10 bg-actually-black p-4'>
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
