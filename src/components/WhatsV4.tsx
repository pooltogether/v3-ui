import { ExternalLink, LinkTheme } from '@pooltogether/react-components'
import { useTranslation } from 'next-i18next'

export const WhatsV4 = () => {
  const { t } = useTranslation()
  return (
    <div className='rounded-xl bg-opacity-10 bg-actually-black p-4'>
      <h4>{t('whatIsV4Question')}</h4>
      <p>{t('v4SimpleExplainer')}</p>
      <h4 className='mt-2'>{t('v3MigrateQuestion')}</h4>
      <p>
        <ol className='pl-8 list-decimal'>
          <li>
            <ExternalLink theme={LinkTheme.accent} href='https://app.pooltogether.com/account'>
              {t('withdrawFromV3')}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink theme={LinkTheme.accent} href='https://app.pooltogether.com/deposit'>
              {t('depositIntoV4')}
            </ExternalLink>
          </li>
        </ol>
        <span>{t('v3MigrationClosing')}</span>
      </p>
    </div>
  )
}
